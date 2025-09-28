import { useState } from "react";
import { X } from 'lucide-react';
import { useAuthData } from "../context/authContest";
import { useNavigate } from "react-router-dom";
import api from "./lib/axios.jsx";
import { GoogleLogin } from "@react-oauth/google";

function Login({ func2, cancel }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const handleChange = (e) => {
        setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    };

    const { setUser } = useAuthData();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/login", values, { withCredentials: true });
            if (res.status === 200) {
                await setUser(res.data);
                setErrorMsg("");
                navigate("/");
            }
        } catch (error) {
            setErrorMsg(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative rounded-tl-2xl rounded-tr-2xl border-t-2 z-10 bg-[#07274e] pt-5 pb-7">
            <div>
                <X className="cursor-pointer absolute left-3 text-white" onClick={cancel} />
                <h2 className="josefin font-bold text-gray-100 text-2xl">Login</h2>
                <form className="px-9" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 mt-5 mb-4">
                        <input className="border-none bg-gray-200 outline-none placeholder-gray-500 text-black text-[20px] font-normal px-4 py-1 rounded-xl" type="text" name="username" placeholder="Enter Username or Email" onChange={handleChange} required />
                        <div className="flex flex-col">
                            <input className="border-none bg-gray-200 outline-none placeholder-gray-500 text-black text-[20px] font-normal px-4 py-1 rounded-xl" type="password" name="password" placeholder="Enter Password" onChange={handleChange} required />
                            <div className="w-[fit-content] text-[#c89900] text-[17px] mt-2 pl-3 font-semibold text-left">Forgot Password ?</div>
                        </div>
                    </div>

                    <div>
                        <button className="flex justify-center items-center rounded-xl text-black text-[19px] cursor-pointer shadow-xl font-semibold py-2 w-full bg-cyan-600" type="submit">
                            {
                                loading? (
                                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Login"
                                )
                            }
                        </button>
                        {errorMsg && <p className="text-[#c89900] text-[17px] mt-2">{errorMsg}</p>}
                        <p className="text-gray-300 font-light text-[19px] my-2">
                            Don't have an account?
                            <span className="font-semibold text-gray-200 cursor-pointer" onClick={func2}> Signup</span>
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-3">
                            <span className="flex-1 h-[1px] bg-gray-500"></span> <p className="text-gray-300">or</p> <span className="flex-1 h-[1px] bg-gray-500"></span>
                        </div>
                    </div>
                </form>

                <div className="text-gray-400 flex justify-center mt-2 px-9">
                    <GoogleLogin
                        onSuccess={
                            async (credentialResponse) => {
                                try {
                                    const res = await api.post("/auth/google", {
                                        token: credentialResponse.credential
                                    });
                                    localStorage.setItem("user", JSON.stringify(res.data));
                                    window.location.href = "/";
                                } catch (err) {
                                    console.log("Google login error", err);
                                }
                            }} onError={() => console.log("Google login failed")}
                    />
                </div>
            </div>
        </div>
    )
};

export default Login;