import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import Friends from "../components/friends.jsx";
import Connect from "../components/users.jsx";
import api from "../components/lib/axios.jsx";

function Users() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("user")) { navigate("/welcome") }
    }, []);

    const [friends, setFriends] = useState([]);

    const fetchConnections = async () => {
        try {
            const res = await api.get("/connections");
            setFriends(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchConnections();
    }, []);

    //Fetch users that I do not follow
    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    //Connect with user
    const handleConnect = async (user) => {
        const followed_id = user.id;
        try {
            await api.post("/connect", { followed_id });
            // setUsers((prev) => prev.filter((u => u.id !== user.id)));
            fetchUsers();
            fetchConnections();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen">
            <Friends friends={friends} />
            <Connect users={users} handleConnect={handleConnect} />
        </div>
    )
}

export default Users