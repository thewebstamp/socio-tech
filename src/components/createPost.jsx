import { useState, useRef, useEffect } from 'react';
import { useAuthData } from '../context/authContest.jsx';
import { X, ImagesIcon } from 'lucide-react';
import axios from 'axios';
import { useUtilData } from '../context/utilContext.jsx';

function CreatePost({ fetchPosts }) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuthData();
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const { setShowPost, handleCreatePost } = useUtilData();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Merge new files with old ones
        const newImages = [...images, ...files];

        if (newImages.length > 4) {
            alert("You can only upload up to 4 images");
            return;
        }

        setImages(newImages);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("content", content);

            images.forEach((img) => {
                formData.append("images", img);
            });

            await axios.post("http://localhost:1800/api/posts", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setShowPost(false);
            fetchPosts();
            handleCreatePost();
            setContent("");
            setImages([]);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const createPostContRef = useRef(null);
    const createPostRef = useRef(null);

    useEffect(() => {
        createPostContRef.current.addEventListener("click", (e) => {
            if (!createPostRef.current?.contains(e.target)) {
                setShowPost(false);
                handleCreatePost();
            }
        })
    }, []);

    return (

        <div ref={createPostContRef} className='flex justify-center items-center [@media(max-width:680px)]:items-end [@media(max-width:680px)]:justify-end fixed z-30 w-full h-screen bg-[#dcdcdcd6] dark:bg-[#323232cd] left-0 top-0'>
            <div ref={createPostRef} className='josefin bg-white px-4 pb-7 [@media(max-width:680px)]:pb-10 w-full max-w-[550px] max-h-[70vh] [@media(max-width:680px)]:max-h-[80vh] overflow-y-auto bg-white dark:bg-black shadow-xl rounded-xl'>
                <X strokeWidth={3} onClick={() => { setShowPost(false); handleCreatePost() }} className='cursor-pointer text-red-700 dark:text-red-600 mb-3 mt-3' />
                <div className='flex gap-3 items-center'>
                    <img className='w-[40px] h-[40px] rounded-full' src={`https://socio-tech-server.onrender.com/uploads/${user.profile_picture}`} alt="" />
                    <span>
                        <p className='fredoka text-[17px] text-gray-900 dark:text-gray-200 font-semibold dark:font-medium'>{user.name}</p>
                        <p className='font-normal dark:font-light text-gray-500 dark:text-gray-300 text-[16.5px]'>@{user.username}</p>
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    <textarea className='my-3 placeholder:text-gray-500 text-black text-[19px] dark:bg-[#2c2c2c] dark:text-gray-200 dark:placeholder:text-gray-400 px-4 py-3 w-full rounded-lg border-0 outline-0 bg-gray-300' rows={6} placeholder={`Write a caption ${user.name}. . .`} value={content} onChange={(e) => setContent(e.target.value)} name="content" id=""></textarea>
                    <div className='flex justify-between gap-5 px-2'>
                        <input className='hidden' type="file" name='images' multiple accept="image/*" onChange={handleFileChange} id="file" />
                        <div className='flex flex-col gap-2'>
                            <label className='cursor-pointer flex gap-2 items-center cursor pointer' htmlFor='file'>
                                <ImagesIcon className='cyan-color' />
                                <span className='flex items-center h-[35px] text-[18.5px] dark:text-gray-300'>Photos</span>
                            </label>
                            <div className="relative flex gap-1 mt-1">
                                {images.map((img, i) => (
                                    <div className='reletive flex flex-col items-center' key={i}>
                                        <X strokeWidth={2.5} className='absolute top-[2px] bg-gray-100 rounded-full p-[3px] w-[17px] h-[17px] cursor-pointer' onClick={() => { setImages((prev) => prev.filter((_, index) => (index !== i))) }} />
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt="preview"
                                            className="w-[75px] h-[75px] object-cover rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className='h-[fit-content] cursor-pointer shadow-xl fredoka rounded-lg px-5 py-[5px] font-medium tracking-[0.3px] text-white bg-[#099ec3]' type="submit">
                            {
                                loading ? (
                                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "POST"
                                )
                            }
                        </button>
                    </div>
                    {error && <p>{error}</p>}
                </form>
            </div>
        </div>
    )
};

export default CreatePost;