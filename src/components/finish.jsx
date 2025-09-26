import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthData } from "../context/authContest.jsx";
import api from "./lib/axios.jsx";

function Finish({ registeredEmail }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [err, setErr] = useState(null);
    const [values, setValues] = useState({
        email: registeredEmail,
        fullname: '',
        username: ''
    });
    const handleChange = (e) => {
        setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    };

    const { setUser } = useAuthData();

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/finishSignup", values, {
                withCredentials: true
            });
            if (res.status === 200) {
                console.log(res.data);
                await setUser(res.data);
                setErr(null);
                navigate("/");
            }
        } catch (error) {
            setErr(error.response.data.error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative rounded-tl-2xl rounded-tr-2xl border z-10 bg-[#07274e] pt-5 pb-7">
            <div>
                <h3 className="fredoka font-semibold tracking-[0.2px] text-[#c89900] text-xl">Finish Signup</h3>
                <form className="px-9" onSubmit={handleClick}>
                    <div className="flex flex-col gap-4 mt-5 mb-7">
                        <input className="border-none bg-gray-200 outline-none placeholder-gray-500 text-black text-[20px] font-normal px-4 py-1 rounded-xl" type="text" name="fullname" placeholder="Enter Full Name" onChange={handleChange} required />
                        <input className="border-none bg-gray-200 outline-none placeholder-gray-500 text-black text-[20px] font-normal px-4 py-1 rounded-xl" type="text" name="username" placeholder="Create Username" onChange={handleChange} required />
                    </div>
                    <button className="rounded-xl text-gray-100 text-[19px] cursor-pointer shadow-xl font-semibold py-2 w-full bg-cyan-600" type="submit">
                        {
                            loading? (
                                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Finish"
                            )
                        }
                    </button>
                    {err && <p>{err}</p>}
                </form>
            </div>
        </div>
    )
}

export default Finish;