import { useRef, useState, useEffect } from "react";
import { MoreHorizontal, Heart, MessageCircle, Share2, ArrowRight, ArrowLeft, Save } from "lucide-react";
import { useUtilData } from "../context/utilContext.jsx";
import { useAuthData } from "../context/authContest.jsx";
import moment from "moment";
import api from "./lib/axios.jsx";

export default function SingleMainPost({ p }) {
    // Hide and Read Post Text
    const [manyWords, setManyWords] = useState(false);
    const images = [p.image1, p.image2, p.image3, p.image4].filter(img => img);

    // image slider/scroll
    const scrollerRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollByOne = (dir) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const firstChild = scroller.querySelector(":scope > *");
        const cardWidth = firstChild.getBoundingClientRect().width;
        const distance = Math.round(cardWidth);

        const newIndex = dir === "right"
            ? Math.min(currentIndex + 1, images.length - 1)
            : Math.max(currentIndex - 1, 0);

        scroller.scrollTo({
            left: newIndex * distance,
            behavior: "smooth"
        });
        setCurrentIndex(newIndex);
    };

    const [touchStart, setTouchStart] = useState(null);
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };
    const handleTouchEnd = (e) => {
        if (touchStart === null) return;

        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (diff > 30) {
            scrollByOne("right");
        } else if (diff < -30) {
            scrollByOne("left");
        }

        setTouchStart(null);
    };

    const goToImage = (index) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        const firstChild = scroller.querySelector(":scope > *");
        const cardWidth = firstChild.getBoundingClientRect().width;
        scroller.scrollTo({
            left: index * cardWidth,
            behavior: "smooth"
        });
        setCurrentIndex(index);
    }

    //Show and close comment
    const { setShowComment, handleShowComment } = useUtilData();
    const { setPostId, user } = useAuthData();

    // like and unlike logic
    const [postLikes, setPostLikes] = useState([]);
    const [heart, setHeart] = useState(false);

    const fetchPostLikes = async () => {
        try {
            const res = await api.get(`liked/${p.id}`);
            setPostLikes(res.data);

            // Check if logged-in user liked this post
            const hasLiked = res.data.some((like) => like.like_user_id === user.id);
            setHeart(hasLiked);

        } catch (error) { console.log(error) };
    };

    const handleLikePost = async () => {
        try {
            if (!heart) {
                await api.post("/like", { liked: true, like_post_id: p.id });
            } else {
                await api.delete(`/unLike/${p.id}`);
            };
            fetchPostLikes();

        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchPostLikes();
    }, [p.id])

    return (
        <div onClick={() => { setPostId(p.id) }} className="shadow-lg flex flex-col gap-1 bg-white dark:bg-black pt-4 pb-2 rounded-2xl">
            <div className="flex justify-between items-center px-3">
                <div className="flex items-center gap-2">
                    <img src={`http://localhost:1800/uploads/${p.profile_picture}`} className="w-[42px] h-[42px] rounded-full object-cover object-center" alt="" />
                    <span>
                        <p className="font-bold josefin leading-[1.25rem] tracking-[0.15px] text-[18.2px] dark:text-gray-200">{p.name}</p>
                        <p className="josefin leading-[1.2rem] text-gray-600 dark:text-gray-500 text-[15.8px]">{moment(p.created_at).fromNow()}</p>
                    </span>
                </div>
                <MoreHorizontal className="cursor-pointer mr-2 dark:text-gray-200" />
            </div>

            <div className="relative px-2 [@media(max-width:685px)]:!px-0 mt-[2px]">
                {
                    images.length > 1 && (
                        <>
                            <div className="absolute left-0 px-7 top-1/2 -translate-y-1/2 w-full flex justify-between">
                                <button type="button" aria-label="Scroll Left" onClick={() => scrollByOne("left")} className="[@media(max-width:685px)]:hidden p-2 rounded-full bg-white/80 dark:bg-black/60 shadow hover:bg-white dark:hover:bg-black transition">
                                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                </button>
                                <button type="button" aria-label="Scroll Right" onClick={() => scrollByOne("right")} className="[@media(max-width:685px)]:hidden p-2 rounded-full bg-white/80 dark:bg-black/60 shadow hover:bg-white dark:hover:bg-black transition">
                                    <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                </button>
                            </div>
                            {/* Dot indicators */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, i) => (
                                    <button key={i} onClick={() => goToImage(i)} className={`w-2.5 h-2.5 rounded-full ${currentIndex === i ? "bg-blue-500" : "bg-gray-400/70"}`} />
                                ))}
                            </div>
                        </>
                    )
                }
                <div ref={scrollerRef} className="w-full max-h-[50vh] overflow-x-hidden scroll-smooth no-scrollbar flex">
                    {
                        images.map((img, i) => (
                            <img key={i} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="rounded-xl [@media(max-width:685px)]:rounded-[0] object-cover object-center" src={`http://localhost:1800/uploads/${img}`} alt="" />
                        ))
                    }
                </div>
            </div>

            <div className="px-4 mt-3">
                <p className="josefin text-[19px] dark:text-[19.3px] leading-[1.5rem] dark:text-gray-200 dark:font-light">
                    {
                        p.content.length > 100
                            ? (
                                manyWords
                                    ? <span className="cursor-pointer" onClick={() => { setManyWords(false) }}>{p.content}</span>
                                    : <span className="cursor-pointer" onClick={() => { setManyWords(true) }}>{p.content.substring(0, 100)} . . .</span>
                            )
                            : p.content
                    }
                </p>
            </div>

            <div>
                <div className="flex justify-between px-7 mt-1 dark:text-gray-300">
                    <div className="flex gap-7 items-center">
                        <span className="flex flex-col justify-center items-center">
                            <Heart onClick={handleLikePost} strokeWidth={2.8} className={`w-[22px] h-[22px] cursor-pointer ${heart ? 'text-red-500' : 'cyan-color'}`} />
                            <p className="fredoka">{postLikes.length}</p>
                        </span>
                        <span className="flex flex-col justify-center items-center" onClick={() => { setPostId(p.id); setShowComment(true) }}>
                            <MessageCircle strokeWidth={2.8} onClick={handleShowComment} className="w-[22px] h-[22px] cursor-pointer cyan-color" />
                            <p className="fredoka">{p.comment_count}</p>
                        </span>
                        <span className="flex flex-col justify-center items-center">
                            <Share2 strokeWidth={2.8} className="w-[22px] h-[22px] cursor-pointer cyan-color" />
                            <p className="fredoka">0</p>
                        </span>
                    </div>
                    <Save strokeWidth={2.8} className="w-[22px] h-[22px] cursor-pointer cyan-color" />
                </div>
            </div>

        </div>
    )
}