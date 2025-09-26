import { Settings, UserCircle } from "lucide-react";
import { useAuthData } from "../../context/authContest.jsx";
import { useNavigate } from "react-router-dom";
import { useUtilData } from "../../context/utilContext.jsx";
import { useState } from "react";
import api from "../lib/axios.jsx";

function NavPopLC() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useAuthData();
    const { switschSDash } = useUtilData();

    const logout = async () => {
        setLoading(true);
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-3 josefin py-4 rounded-2xl shadow-lg bg-white dark:bg-black border border-[rgb(184,184,184)]">
            <a href="#" onClick={() => { navigate(`profile/${user.id}`); switschSDash() }} className="flex gap-2 items-center dark:text-gray-100 text-black px-3 pr-5 py-[1px] mx-4 rounded-xl text-[16px] cursor-pointer">
                <UserCircle className="text-[#07274e] dark:text-[#00b1dd]" />
                <span className="font-semibold">See My Profile</span>
            </a>
            <div className="flex gap-2 items-center dark:text-gray-100 text-black px-3 pr-5 py-[1px] mx-4 rounded-xl text-[16px] font-medium cursor-pointer">
                <Settings className="text-[#07274e] dark:text-[#00b1dd]" />
                <span className="font-semibold">Settings & Privacy</span>
            </div>
            <div onClick={() => { switschSDash(); logout() }} className="flex justify-center items-center text-center px-3 pr-5 py-2 mx-4 rounded-xl tracking-wide text-[17.5px] text-white fredoka bg-[#9d0e0e] cursor-pointer shadow">
                {
                    loading ? (
                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Logout"
                    )
                }
            </div>
        </div>
    )
}

export default NavPopLC;