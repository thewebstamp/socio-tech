import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthData } from "../context/authContest.jsx";
import axios from "axios";

function Finish({ registeredEmail }) {
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
        try {
            const res = await axios.post("http://localhost:1800/api/auth/finishSignup", values, {
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
                    <input className="rounded-xl text-gray-100 text-[19px] cursor-pointer shadow-xl font-semibold py-2 w-full bg-cyan-600" type="submit" value="Finish" />
                    {err && <p>{err}</p>}
                </form>
            </div>
        </div>
    )
}

export default Finish;