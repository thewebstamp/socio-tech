import { Moon, SearchIcon, Sun, HomeIcon, Users, MessageCircle, Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NavPopLC from "./subComponents/navPopLC.jsx";
import NavPopSC from "./subComponents/navPopSC.jsx";
import { useUtilData } from "../context/utilContext.jsx";
import { useAuthData } from "../context/authContest.jsx";
import { useLocation, useNavigate } from "react-router-dom";

function Nav() {
    const { user } = useAuthData();
    const location = useLocation();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(
        () => {
            if (localStorage.getItem('theme')) {
                return localStorage.getItem('theme');
            }

            return (
                window.matchMedia('(prefers-color-scheme : dark)').matches
                    ? 'dark'
                    : 'light'
            )
        }
    );

    // save theme in localStorage
    const themeSwitch = () => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    useEffect(() => {
        themeSwitch();
    }, [theme]);

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(
            theme === 'dark'
                ? 'light'
                : 'dark'
        );
    };

    // theme icon function
    const ThemeIcon = () => {
        if (theme === 'dark') {
            return <Sun className="w-[22px] dark:text-white h-[22px] cursor-pointer" onClick={toggleTheme} />
        } else if (theme === 'light') {
            return <Moon className="w-[22px] h-[22px] cursor-pointer" onClick={toggleTheme} />
        }
    };

    //matchMedia component
    const [isSmall, setIsSmall] = useState(
        window.matchMedia("(max-width: 1000px)").matches
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setIsSmall(window.matchMedia("(max-width: 1000px)").matches);
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);

    //--------profile pop for small and large screen-------
    const { showSDash, setShowSDash, switschSDash } = useUtilData();
    const smallScreenRef = useRef(null);
    const largeScreenRef = useRef(null);
    const navRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                !smallScreenRef.current?.contains(e.target) &&
                !largeScreenRef.current?.contains(e.target) &&
                !navRef.current?.contains(e.target)
            ) {setShowSDash(false)}
        }

        document.addEventListener("click", handleClickOutside);

        return (() => {
            document.removeEventListener("click", handleClickOutside)
        })
    }, []);

    //active page highlight
    const isActive = (path) => location.pathname === path;

    return (
        <div ref={navRef} className="relative w-full bg-white dark:bg-black">
            <div className="flex [@media(max-width:700px)]:flex-col justify-between [@media(max-width:700px)]:gap-2 items-center px-[3vw] [@media(max-width:1000px)]:px-[4vw] pt-[5px] pb-1 [@media(max-width:1000px)]:py-2 [@media(max-width:700px)]:pt-1 bg-inherit h-[59px] [@media(max-width:1000px)]:h-[65px] [@media(max-width:685px)]:h-[97px]">
                <div className="flex [@media(max-width:700px)]:justify-between [@media(max-width:700px)]:w-full items-center gap-12 [@media(max-width:1000px)]:gap-10">
                    <a href="#" onClick={() => { navigate('/') }}>
                        <h1 className="cyan-color fredoka font-semibold text-[32px] [@media(max-width:700px)]:text-[30px]">SocioTech</h1>
                    </a>
                    <div className="flex items-center gap-5 [@media(max-width:1000px)]:gap-4">
                        <div>
                            <ThemeIcon />
                        </div>
                        <form action="" className="flex items-center gap-2 rounded-xl [@media(max-width:1000px)]:rounded-full [@media(max-width:1000px)]:p-[6px] bg-gray-200 dark:bg-[#2e2e2e] px-[12px] py-[4px]">
                            <label htmlFor="search"><SearchIcon className="dark:text-gray-200 w-[20px] h-[20px]" /></label>
                            <input className="[@media(max-width:1000px)]:hidden border-none outline-none bg-transparent placeholder-gray-600 dark:placeholder-gray-500" type="text" name="search" placeholder="Search..." />
                        </form>
                    </div>
                </div>

                <div className="flex items-center gap-12 [@media(max-width:700px)]:gap-[0px] [@media(max-width:700px)]:justify-between [@media(max-width:700px)]:w-full [@media(max-width:700px)]:max-w-[450px] [@media(max-width:700px)]:px-1">
                    <a href="#" className="relative cursor-pointer">
                        <HomeIcon strokeWidth={2.3} onClick={() => { navigate("/") }} className={`w-[25px] h-[25px] ${isActive("/")? "text-[#1e6aa8]" : "text-black dark:text-white"} `} />
                    </a>
                    <a href="#" className="relative cursor-pointer" onClick={() => { navigate(`/users/${user.id}`) }}>
                        <Users strokeWidth={2.3} className={`w-[25px] h-[25px] ${isActive(`/users/${user.id}`)? "text-[#1e6aa8]" : "text-black dark:text-white"}`} />
                        <div className="hidden absolute top-[-10px] right-[-15px] w-[23px] h-[23px] font-semibold text-[14px] tracking-wide rounded-full flex justify-center items-center bg-[#ec2c2c] fredoka text-white"></div>
                    </a>
                    <a href="#" className="relative cursor-pointer" onClick={() => { navigate('/messages') }}>
                        <MessageCircle strokeWidth={2.3} className={`w-[25px] h-[25px] ${isActive('/messages')? "text-[#1e6aa8]" : "text-black dark:text-white"}`} />
                        <div className="absolute top-[-10px] right-[-10px] w-[20px] h-[20px] font-semibold text-[12.5px] tracking-wide rounded-full flex justify-center items-center bg-[#ec2c2c] fredoka text-white">1</div>
                    </a>
                    <a href="#" className="relative cursor-pointer" onClick={() => {navigate("/notifications")}}>
                        <Bell strokeWidth={2.3} className={`w-[25px] h-[25px] ${isActive('/notifications')? "text-[#1e6aa8]" : "text-black dark:text-white"}`} />
                        <div className="absolute top-[-10px] right-[-10px] w-[20px] h-[20px] font-semibold text-[14px] tracking-wide rounded-full flex justify-center items-center bg-[#ec2c2c] fredoka text-white">1</div>
                    </a>
                    <div className="relative cursor-pointer" onClick={switschSDash}>
                        <img className="w-[37px] h-[37px] object-cover object-center rounded-full" src={`https://socio-tech-server.onrender.com/uploads/${user.profile_picture}`} alt="Profile Image" />
                        <div className="absolute bottom-[0] right-[0] green w-[10px] h-[10px] rounded-full"></div>
                    </div>
                    {
                        showSDash ?
                            isSmall
                                ? <div className="absolute top-[0px] left-[0px]"><NavPopSC ref={smallScreenRef} /></div>
                                : <div className="absolute right-[3vw] top-[50px]"><NavPopLC ref={largeScreenRef} /></div>
                            : ""
                    }
                </div>
            </div>
            <hr className="border-none h-[1px] bg-gray-500 dark:bg-gray-800" />
        </div>
    )
}

export default Nav;