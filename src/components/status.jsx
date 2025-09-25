// Status.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import Images from "../assets/images.js";
import { PlusCircle, ArrowRight, ArrowLeft, ImagesIcon, X } from "lucide-react";
import api from './lib/axios.jsx'
import { useUtilData } from "../context/utilContext.jsx";
import { useAuthData } from "../context/authContest.jsx";
import CreatePost from "./createPost.jsx"

export default function Status({ fetchPosts, status = [], fetchStatus }) {
    const { user } = useAuthData();
    const scrollerRef = useRef(null);
    const [showScrollerArrows, setShowScrollerArrows] = useState(false);

    // Create status (upload) state
    const [image, setImage] = useState([]); // array of File(s) (we only accept one here)
    const [uploadError, setUploadError] = useState(null);
    const { showPost, setShowPost, handleCreatePost } = useUtilData();

    // Viewer (modal) state
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerItems, setViewerItems] = useState([]); // array of statuses for selected user
    const [viewerIndex, setViewerIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const autoplayTimeout = useRef(null);
    const AUTOPLAY_MS = 5000; // changeable

    // Group statuses by user so each user occupies a single card
    const grouped = useMemo(() => {
        const map = new Map();
        status.forEach((s) => {
            const uid = s.userId;
            if (!map.has(uid)) map.set(uid, []);
            map.get(uid).push(s);
        });
        // produce an array with most recent first per user
        return Array.from(map.values()).map((arr) => {
            arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            return {
                userId: arr[0].userId,
                name: arr[0].name,
                profile_picture: arr[0].profile_picture,
                items: arr, // sorted newest -> oldest
            };
        });
    }, [status]);

    // Check overflow to show/hide scroller arrows
    useEffect(() => {
        const checkOverflow = () => {
            const scroller = scrollerRef.current;
            if (!scroller) return setShowScrollerArrows(false);
            // inner container is the first child
            const inner = scroller.querySelector(":scope > div");
            if (!inner) return setShowScrollerArrows(false);
            setShowScrollerArrows(inner.scrollWidth > scroller.clientWidth + 4);
        };
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [grouped.length]);

    // Scroller navigation (main row)
    const scrollByOne = (dir = "right") => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        const firstChild = scroller.querySelector(":scope > div > *");
        if (!firstChild) return;
        const cardWidth = firstChild.getBoundingClientRect().width;
        const gap = parseInt(getComputedStyle(scroller.querySelector(":scope > div")).gap) || 0;
        const distance = Math.round(cardWidth + gap);
        scroller.scrollBy({ left: dir === "right" ? distance : -distance, behavior: "smooth" });
    };

    // ---------- Upload / preview / share ----------
    const handleSelectFile = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 1) {
            alert("You can only share one image at a time");
            return;
        }
        setImage(files);
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!image || image.length === 0) return setUploadError("Please choose an image.");
        const fd = new FormData();
        fd.append("image", image[0]);

        try {
            await api.post("/status", fd, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImage([]);
            setUploadError(null);
            if (typeof fetchStatus === "function") await fetchStatus();
        } catch (err) {
            console.error(err);
            setUploadError(err.response?.data?.error || "Upload failed");
        }
    };

    // ---------- Viewer modal logic (auto-play / swipe / progress) ----------
    // close viewer and clear timers
    const closeViewer = () => {
        setViewerOpen(false);
        setViewerItems([]);
        setViewerIndex(0);
        setIsPaused(false);
        clearTimeout(autoplayTimeout.current);
    };

    // autoplay effect
    useEffect(() => {
        if (!viewerOpen) return;
        clearTimeout(autoplayTimeout.current);
        if (!isPaused) {
            autoplayTimeout.current = setTimeout(() => {
                if (viewerIndex < viewerItems.length - 1) {
                    setViewerIndex((i) => i + 1);
                } else {
                    closeViewer();
                }
            }, AUTOPLAY_MS);
        }
        return () => clearTimeout(autoplayTimeout.current);
    }, [viewerOpen, viewerIndex, isPaused, viewerItems.length]);

    // progress bar animation for current item
    useEffect(() => {
        if (!viewerOpen) return;

        const bars = document.querySelectorAll(".progress-bar-fill");
        bars.forEach((bar, i) => {
            bar.style.transition = "none";
            if (i < viewerIndex) {
                // already completed
                bar.style.width = "100%";
            } else if (i === viewerIndex) {
                // reset then animate
                bar.style.width = "0%";
                requestAnimationFrame(() => {
                    bar.style.transition = `width ${AUTOPLAY_MS}ms linear`;
                    bar.style.width = "100%";
                });
            } else {
                // upcoming → reset
                bar.style.width = "0%";
            }
        });
    }, [viewerIndex, viewerOpen, isPaused]);

    // swipe gestures
    const touchStartX = useRef(null);
    const handleTouchStartViewer = (e) => {
        touchStartX.current = e.touches[0].clientX;
        setIsPaused(true); // pause while touching
    };
    const handleTouchEndViewer = (e) => {
        const start = touchStartX.current;
        if (start == null) {
            setIsPaused(false);
            return;
        }
        const diff = e.changedTouches[0].clientX - start;
        if (diff > 50) {
            // swipe right -> prev
            setViewerIndex((i) => Math.max(i - 1, 0));
        } else if (diff < -50) {
            // swipe left -> next
            setViewerIndex((i) => Math.min(i + 1, viewerItems.length - 1));
        }
        touchStartX.current = null;
        setIsPaused(false);
    };

    // prev/next in viewer
    const viewerPrev = () => setViewerIndex((i) => Math.max(i - 1, 0));
    const viewerNext = () => {
        if (viewerIndex < viewerItems.length - 1) setViewerIndex((i) => i + 1);
        else closeViewer();
    };

    // prevent body scroll when an overlay is open
    useEffect(() => {
        if (image.length > 0 || viewerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [image.length, viewerOpen]);

    // When opening viewer, mark as viewed
    const openViewerForGrp = (group, startIndex = 0) => {
        setViewerItems(group.items);
        setViewerIndex(startIndex);
        setViewerOpen(true);
        setIsPaused(false);

        // Mark this group's statuses as viewed
        setViewedStatusIds(prev => {
            const updated = new Set(prev);
            group.items.forEach(item => updated.add(item.statusId));
            return updated;
        });
    };

    const [viewedStatusIds, setViewedStatusIds] = useState(() => {
        const saved = localStorage.getItem("viewedStatusIds");
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // persist to localStorage on change
    useEffect(() => {
        localStorage.setItem("viewedStatusIds", JSON.stringify([...viewedStatusIds]));
    }, [viewedStatusIds]);

    // ---------- Render ----------
    return (
        <section className="w-full max-w-full">
            <div className="relative josefin">
                {/* Left arrow (overlay) */}
                {showScrollerArrows && (
                    <button
                        type="button"
                        aria-label="Scroll left"
                        onClick={() => scrollByOne("left")}
                        className="[@media(max-width:685px)]:hidden pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 z-20 ml-2 p-2 rounded-full bg-white/80 dark:bg-black/60 shadow hover:bg-white dark:hover:bg-black transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    </button>
                )}

                {/* Right arrow (overlay) */}
                {showScrollerArrows && (
                    <button
                        type="button"
                        aria-label="Scroll right"
                        onClick={() => scrollByOne("right")}
                        className="[@media(max-width:685px)]:hidden pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 z-30 mr-2 p-2 rounded-full bg-white/80 dark:bg-black/60 shadow hover:bg-white dark:hover:bg-black transition"
                    >
                        <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    </button>
                )}

                {/* Scroll container */}
                <div ref={scrollerRef} className="w-full overflow-x-auto scroll-smooth no-scrollbar">
                    <div className="flex gap-3 [@media(max-width:685px)]:gap-2 w-max pt-2">
                        {/* Add Status card (first item) */}
                        <form onSubmit={handleUploadSubmit}>
                            <input
                                type="file"
                                name="statusImage"
                                id="statusImage"
                                accept="image/*"
                                onChange={handleSelectFile}
                                className="hidden"
                            />
                            <label htmlFor="statusImage" className="cursor-pointer">
                                <div className="flex-none w-[130px] [@media(max-width:1220px)]:w-[115px] [@media(max-width:685px)]:!w-[90px] h-[180px] [@media(max-width:1220px)]:h-[170px] [@media(max-width:685px)]:!h-[160px] shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-black">
                                    <div className="h-[140px] [@media(max-width:1220px)]:h-[130px] [@media(max-width:685px)]:!h-[120px]">
                                        <img className="w-full h-full object-cover object-center" src={Images.welcome} alt="Your profile" />
                                    </div>
                                    <div className="w-full h-[35px] flex items-center justify-center pr-[4px] gap-2 [@media(max-width:685px)]:gap-1">
                                        <PlusCircle className="text-gray-600 dark:text-gray-400 [@media(max-width:685px)]:w-[20px] [@media(max-width:685px)]:h-[20px]" />
                                        <span className="font-semibold dark:font-medium fredoka tracking-[0.2px] text-[16px] [@media(max-width:685px)]:text-[15px] dark:text-gray-100">Status</span>
                                    </div>
                                </div>
                            </label>

                            {/* Preview modal / share when an image is selected */}
                            {image.length > 0 && (
                                <div className="flex justify-center items-center fixed z-30 w-full h-screen bg-[#dcdcdcd6] dark:bg-[#323232cd] left-0 top-0">
                                    <div className="josefin relative h-[80%] pb-5 pt-10 w-full max-w-[400px] bg-gray-100 dark:bg-black shadow-xl rounded-lg flex gap-4 flex-col items-center justify-between">
                                        <X strokeWidth={3} className="cursor-pointer absolute top-2 text-red-700 dark:text-red-600" onClick={() => setImage([])} />
                                        <img src={URL.createObjectURL(image[0])} alt="preview" className="w-[90%] h-[80%] object-contain rounded-md" />
                                        <div className="w-full px-[7%] flex items-center justify-between">
                                            <input type="submit" value="SHARE" className="h-[fit-content] cursor-pointer shadow-xl fredoka rounded-lg px-5 py-[5px] font-medium tracking-[0.3px] text-white bg-[#099ec3]" />
                                            <button type="button" className="text-lg text-gray-600 dark:text-gray-400" onClick={() => setImage([])}>Cancel</button>
                                        </div>
                                        {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Mapped grouped status cards (one card per user) */}
                        {grouped.map((g) => {
                            const hasUnseen = g.items.some(item => !viewedStatusIds.has(item.statusId));
                            return (
                                <article
                                    key={g.userId}
                                    className={`relative flex-none w-[130px] [@media(max-width:1220px)]:w-[115px] [@media(max-width:685px)]:!w-[90px] h-[180px] [@media(max-width:1220px)]:h-[170px] [@media(max-width:685px)]:!h-[160px] shadow-xl rounded-2xl overflow-hidden cursor-pointer ${hasUnseen ? "border-2 border-blue-500" : "border-0"}`}
                                    onClick={() => openViewerForGrp(g, 0)}
                                >
                                    <img
                                        className="absolute z-10 w-[30px] h-[30px] border-2 border-blue-400 rounded-full left-3 top-3"
                                        src={`https://socio-tech-server.onrender.com/uploads/${g.profile_picture}`}
                                        alt={`${g.name} avatar`}
                                    />
                                    <span className="absolute w-full bottom-2 left-0 pl-2 text-white text-[15.5px] drop-shadow bg-[#00000025] pr-3">
                                        {g.name}
                                    </span>
                                    <img
                                        className="w-full h-full object-cover"
                                        src={`https://socio-tech-server.onrender.com/uploads/${g.items[0].image}`}
                                        alt={`${g.name} status`}
                                    />
                                    {g.items.length > 1 && (
                                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                                            {g.items.length}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Create Post trigger (kept original) */}
            {
                showPost
                    ? <CreatePost fetchPosts={fetchPosts} />
                    : <div onClick={() => { setShowPost(true); handleCreatePost() }} className="flex gap-5 [@media(max-width:1000px)]:gap-4 [@media(max-width:685px)]:!gap-2 items-center bg-white dark:bg-black px-3 py-2 rounded-2xl shadow-lg mt-4 [@media(max-width:1000px)]:mt-3 [@media(max-width:1000px)]:!py-[7px] border-[1px] border-gray-300 dark:border-gray-900">
                        <img className="cursor-pointer w-[42px] h-[42px] [@media(max-width:1000px)]:w-[35px] [@media(max-width:1000px)]:h-[35px] rounded-full" src={`http://localhost:1800/uploads/${user.profile_picture}`} alt="" />
                        <span className="cursor-pointer h-[40px] [@media(max-width:1000px)]:h-[33px] flex flex-1 items-center fredoka pl-5 bg-gray-200 dark:bg-[#2c2c2c] dark:text-gray-300 tracking-[0.2px] text-gray-800 text-[17px] rounded-2xl">Create a Post</span>
                        <ImagesIcon className="cursor-pointer w-[30px] h-[30px] [@media(max-width:1000px)]:w-[25px] [@media(max-width:1000px)]:h-[25px] cyan-color" />
                    </div>
            }

            {/* Modal viewer */}
            {viewerOpen && viewerItems.length > 0 && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    onTouchStart={handleTouchStartViewer}
                    onTouchEnd={handleTouchEndViewer}
                >
                    {/* progress bars */}
                    <div className="absolute top-2 left-0 w-full flex space-x-1 px-2">
                        {viewerItems.map((it, i) => (
                            <div key={it.statusId || i} className="flex-1 bg-gray-600 h-1 rounded overflow-hidden">
                                <div
                                    className="progress-bar-fill bg-white h-1"
                                    style={{
                                        width: i < viewerIndex ? "100%" : "0%",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* content */}
                    <div
                        className="relative max-w-3xl w-full h-[80%] flex items-center justify-center"
                        onMouseDown={() => setIsPaused(true)}
                        onMouseUp={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                    >
                        <img
                            src={`http://localhost:1800/uploads/${viewerItems[viewerIndex].image}`}
                            alt=""
                            className="w-full h-full object-contain rounded-md"
                        />
                    </div>

                    {/* left/right nav (desktop only) */}
                    {viewerItems.length > 1 && (
                        <>
                            {viewerIndex > 0 && (
                                <button onClick={viewerPrev} className="hidden md:block absolute left-4 text-white text-3xl">
                                    ‹
                                </button>
                            )}
                            {viewerIndex < viewerItems.length - 1 && (
                                <button onClick={viewerNext} className="hidden md:block absolute right-4 text-white text-3xl">
                                    ›
                                </button>
                            )}
                        </>
                    )}

                    {/* close */}
                    <button onClick={closeViewer} className="absolute top-4 right-4 text-white text-2xl">✕</button>
                </div>
            )}
        </section>
    );
}