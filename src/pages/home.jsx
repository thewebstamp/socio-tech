import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Posts from "../components/posts.jsx";
import Status from "../components/status.jsx";
import api from "../components/lib/axios.jsx";
import Comments from "../components/comment.jsx";
import { useUtilData } from "../context/utilContext.jsx";
import { useAuthData } from "../context/authContest.jsx";

function Home() {
    const { showComment } = useUtilData();
    const { postId } = useAuthData();
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("user")) {
            navigate("/welcome")
        }
    }, []);

    const [post, setPost] = useState([]);
    const [status, setStatus] = useState([]);

    // Fetch Posts
    const fetchPosts = async () => {
        try {
            const res = await api.get("/post");
            setPost(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch Status
    const fetchStatus = async () => {
        try {
            const res = await api.get("/fetchStatus");
            setStatus(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    //Render in useEffect
    useEffect(() => {
        fetchPosts();
        fetchStatus();
    }, []);

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
        fetchComment();
        }, []);

    return (
        <div className="min-h-[calc(100vh-70px)] [@media(max-width:685px)]:min-h-[calc(100vh-105px)]">
            <Status status={status} fetchStatus={fetchStatus} fetchPosts={fetchPosts} />
            <Posts post={post} />
            {
                showComment && <Comments comments={comments} fetchComment={fetchComment} />
            }
        </div>
    )
}

export default Home;