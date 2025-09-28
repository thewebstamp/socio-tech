import { useEffect, useRef, useState } from 'react';
import { useAuthData } from '../context/authContest.jsx';
import { useUtilData } from '../context/utilContext.jsx';
import { X } from 'lucide-react';
import moment from 'moment';
import api from './lib/axios.jsx';

export default function Comments({ comments, fetchComment }) {
    const [loading, setLoading] = useState(false);
    const { user, postId } = useAuthData();
    const { setShowComment, handleShowComment } = useUtilData();

    //comment pop for small and large screen-------
    const commentRef = useRef(null);
    const commentContRef = useRef(null);

    useEffect(() => {
        function handleCommentClose(e) {
            if (!commentRef.current?.contains(e.target)) {
                setShowComment(false);
                handleShowComment();
            }
        };

        commentContRef.current.addEventListener("click", handleCommentClose);
    }, []);

    const [content, setContent] = useState("");

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    // Make comment
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/createComment", { content, post_id: postId }, {
                withCredentials: true
            });
            await fetchComment();
            setContent("");

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={commentContRef} className='flex justify-center items-center [@media(max-width:680px)]:items-end [@media(max-width:680px)]:justify-end fixed z-30 w-full h-screen bg-[#dcdcdcd4] dark:bg-[#323232cd] left-0 top-0'>
            <div ref={commentRef} className='w-full max-w-[550px] max-h-[70vh] [@media(max-width:680px)]:max-h-[80vh] overflow-y-auto overflow-x-hidden pb-10 bg-white dark:bg-black shadow-lg rounded-xl'>
                <div className='relative'>
                    <div className='w-full max-w-[532px] px-[15px] pb-2 sticky top-0 bg-white dark:bg-black'>
                        <X strokeWidth={3} onClick={() => { setShowComment(false); handleShowComment() }} className='cursor-pointer text-red-700 mb-3 mt-3' />
                        <form className='flex gap-3 [@media(max-width:680px)]:gap-2 items-center' onSubmit={handleSubmit}>
                            <img className='w-[35px] h-[35px] rounded-full object-center object-cover' src={`${user.profile_picture}`} alt="" />
                            <input className='h-[37px] flex-1 border-2 border-gray-500 px-3 text-[16.5px] [@media(max-width:680px)]:placeholder:text-[16.4px] placeholder-gray-600 dark:placeholder-gray-400 dark:text-gray-100 rounded-md dark:bg-[#2d2d2d]' type="text" placeholder='Make a comment' value={content} onChange={handleChange} />
                            <button className='flex justify-center items-center h-[35px] fredoka bg-blue-500 font-medium tracking-[0.2px] text-white shadow-lg px-4 [@media(max-width:680px)]:px-3 rounded-md' type="submit">
                                {
                                    loading ? (
                                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Send"
                                    )
                                }
                            </button>
                        </form>
                    </div>

                    <div className='flex flex-col gap-1 mt-4 px-[15px]'>
                        {
                            comments.map((c) => (
                                <div key={c.id}>
                                    <div className='flex bg-[#f4f4f47f] dark:bg-[#0f0f0f9d] rounded-xl pt-2 pb-[6px]'>
                                        <img className='flex-none w-[35px] h-[35px] rounded-full object-center object-cover' src={`${c.profile_picture}`} alt="" />
                                        <div className='josefin flex flex-1 flex-col gap-[1px] text-[18.5px] dark:text-[18.8px] ml-4 [@media(max-width:680px)]:ml-3'>
                                            <span className='font-bold text-[17px] dark:font-semibold leading-[1.3rem] text-gray-900 dark:text-gray-200'>{c.name}</span>
                                            <p className='text-gray-600 text-[17px] dark:text-gray-300 dark:font-light leading-[1.3rem]'>{c.content}</p>
                                        </div>
                                    </div>

                                    <div className='flex'>
                                        <span className='ml-auto pr-2 text-center josefin font-normal text-[13px] text-gray-500 leading-[1rem]'>{moment(c.created_at).fromNow()}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}