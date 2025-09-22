import UserProfile from "../components/userProfile.jsx";
import PostComp from '../components/postComp.jsx';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../components/lib/axios.jsx";
import { useUtilData } from "../context/utilContext.jsx";
import { useAuthData } from "../context/authContest.jsx";
import Comments from "../components/comment.jsx";
import Empty from "../components/empty.jsx";
import Images from "../assets/images.js";

function Profile() {
    const { showComment } = useUtilData();
    const { postId, user } = useAuthData();
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("user")) {
            navigate("/welcome")
        }
    }, []);

    const [post, setPost] = useState([]);
    const { id } = useParams();
    const fetchUserPost = async () => {
        try {
            const res = await api.get(`/fetchUserPost/${id}`);
            setPost(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        if (id) { fetchUserPost(); }
    }, [id]);

    //Fetch Comment
    const [comments, setComments] = useState([]);
    const fetchComment = async () => {
        try {
            const res = await api.get(`/fetchComment/${postId}`);
            setComments(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (postId) { fetchComment(); }
    }, [postId]);

    return (
        <div className="pb-7 min-h-screen">
            <UserProfile id={id} />
            {
                post.length > 0 && <PostComp post={post} />
            }
            {
                showComment && <Comments comments={comments} fetchComment={fetchComment} />
            }
            {
                post.length === 0 && id == user.id &&
                <div className="mt-10 flex flex-col gap-4 items-center text-center josefin">
                    <img className="w-[60%] max-w-[250px]" src={Images.noPost} alt="" />
                    <p className="text-[18.5px] text-gray-600 dark:text-gray-400">You haven't made a post yet</p>
                </div>
            }
        </div>
    )
}

export default Profile;