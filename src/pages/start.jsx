import Images from "../assets/images.js";
import { useState } from "react";
import Login from "../components/login.jsx";
import Signup from "../components/signup.jsx";

function Start() {
    const [displayStatus, setDisplayStatus] = useState("");
    const loginSwitch = () => { setDisplayStatus("login") };
    const signupSwitch = () => { setDisplayStatus("signup") };
    const closeSwitch = () => { setDisplayStatus("") };

    const ShowForm = () => {
        if (displayStatus === "") {
            return (
                <div className="relative z-10 w-full flex gap-3 px-5 pb-7 font-semibold">
                    <span className="tracking-wide cursor-pointer text-lg font-semibold text-center flex-1 py-2 text-white rounded-xl bg-cyan-700 shadow-md" onClick={loginSwitch}>Login</span>
                    <span className="tracking-wide cursor-pointer text-lg font-semibold text-center flex-1 py-2 text-black rounded-xl bg-gray-300 shadow-md" onClick={signupSwitch}>Signup</span>
                </div>
            )
        }

        if (displayStatus === "login") {
            return (<Login cancel={closeSwitch} func2={signupSwitch} />)
        } else if (displayStatus === "signup") {
            return (<Signup cancel={closeSwitch} func1={loginSwitch} />)
        }
    };

    return (
        <div className="bg-[#3D537C] flex justify-center items-center w-screen min-h-screen h-auto">
            <div className="rounded-3xl [@media(max-width:685px)]:rounded-[0px] overflow-hidden josefin relative text-center [@media(max-width:685px)]:w-full w-[400px] h-[600px] [@media(max-width:685px)]:min-h-screen flex flex-col justify-between bg-[#01184A]">
                {
                    displayStatus === "" ?
                        <div className="relative z-10 px-10 pt-10 bg-[#01184A]">
                            <h1 className="fredoka tracking-wider font-semibold text-4xl text-gray-100">Socio<span className="text-cyan-500">Tech</span></h1>
                            <p className="leading-snug text-[16.5px] text-gray-300 pt-2 pb-2">Where tech and creative minds meet to connect, collaborate, and grow.</p>
                        </div>
                        : <div></div>
                }
                <img className="px-2 absolute w-full opacity-37 translate-y-1/2 bottom-1/2 z-1" src={Images.main} alt="SocioTech Image" />
                <ShowForm />
            </div>
        </div>
    )
};

export default Start;