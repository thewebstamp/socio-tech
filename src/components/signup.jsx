import { useState } from "react";
import { X } from "lucide-react";
import Finish from "./finish";
import api from './lib/axios.jsx';

function Signup({ func1, cancel }) {
    const [loading, setLoading] = useState(fales);
    const [proceed, setProceed] = useState(false); //This should be set to true after a successful api req
    const [registeredEmail, setRegisterdEmail] = useState(null); //use axios to set this
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [errorMsg, setErrorMsg] = useState("");
    const handleChange = (e) => {
        setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/beginSignup", values);
            if (response.status === 200) {
                setRegisterdEmail(response.data);
                setErrorMsg("");
                setProceed(true);
            };

        } catch (error) {
            setErrorMsg(error.response.data.error)
        } finally {
            setLoading(false);
        }
    }

    return (
        proceed ? <Finish registeredEmail={registeredEmail} /> //registered email is email that was sent as response to beginSignup from server
            : <div className="relative rounded-tl-2xl rounded-tr-2xl border-2 z-10 bg-[#07274e] pt-5 pb-7">
                <div>
                    <X className="cursor-pointer absolute left-3 text-white" onClick={cancel} />
                    <h2 className="josefin font-bold text-[#c89900] text-2xl">Signup</h2>
                    <form className="px-9" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 mt-5 mb-4">
                            <input className="border-none outline-none bg-gray-200 placeholder-gray-500 text-black text-[20px] px-4 py-1 rounded-xl" type="email" name="email" placeholder="Enter Email" onChange={handleChange} required />
                            <input className="border-none outline-none bg-gray-200 placeholder-gray-500 text-black text-[20px] px-4 py-1 rounded-xl" type="password" name="password" placeholder="Create Password" onChange={handleChange} required />
                        </div>
                        <div>
                            <button className="rounded-xl text-black text-[19px] cursor-pointer shadow-xl font-semibold py-2 w-full bg-cyan-600" type="submit">
                                {
                                    loading? (
                                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Create Account"
                                    )
                                }
                            </button>
                            {errorMsg && <p className="text-[#c89900] text-[17px] mt-2">{errorMsg}</p>}
                            <p className="text-gray-300 font-light text-[19px] my-2">
                                Already have an account?
                                <span className="font-semibold text-gray-200 cursor-pointer" onClick={func1}> Login</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
    )
};

export default Signup;