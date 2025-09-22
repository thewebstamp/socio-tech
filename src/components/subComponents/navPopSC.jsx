import { X, LogOut, Users, Calendar, MonitorPlay, BarChart3, Globe, Settings, HandCoins, GraduationCap, NotebookText } from "lucide-react";
import { useUtilData } from "../../context/utilContext.jsx";
import { useAuthData } from "../../context/authContest.jsx";
import { useNavigate } from "react-router-dom";

function NavPopSC() {
    const navigate = useNavigate();
    const { switschSDash } = useUtilData();

    const dashData = [
        {
            data: "Settings",
            icon: <Settings className="text-gray-600 dark:text-gray-400" />,
            id: 1
        },
        {
            data: "Groups",
            icon: <Users className="text-gray-600 dark:text-gray-400" />,
            id: 2,
            notification: "2"
        },
        {
            data: "Events",
            icon: <Calendar className="text-gray-600 dark:text-gray-400" />,
            id: 3,
            notification: "9+"
        },
        {
            data: "Watch",
            icon: <MonitorPlay className="text-gray-600 dark:text-gray-400" />,
            id: 4
        },
        {
            data: "Explore",
            icon: <Globe className="text-gray-600 dark:text-gray-400" />,
            id: 5
        },
        {
            data: "Analytics",
            icon: <BarChart3 className="text-gray-600 dark:text-gray-400" />,
            id: 6
        },
        {
            data: "Fundraiser",
            icon: <HandCoins className="text-gray-600 dark:text-gray-400" />,
            id: 7
        },
        {
            data: "Tutorials",
            icon: <GraduationCap className="text-gray-600 dark:text-gray-400" />,
            id: 8
        },
        {
            data: "Courser",
            icon: <NotebookText className="text-gray-600 dark:text-gray-400" />,
            id: 9
        }
    ];

    // -------
    const { user, logout } = useAuthData();

    return (
        <div className="josefin relative w-screen max-w-[585px] h-screen overflow-y-scroll bg-gray-200 dark:bg-[#212121] shadow-lg">
            <div className="flex flex-col gap-3">
                <div className="sticky z-30 top-[0px] flex flex-col gap-1 bg-[#07274e] dark:bg-black border-b-4  dark:border-b-[#1d1d1d] px-12 pt-[45px] pb-4">
                    <div className="absolute top-5 right-5  flex gap-1 fredoka items-center font-medium text-[19.5px]" onClick={switschSDash}>
                        <X strokeWidth={2.5} className="text-white" />
                    </div>

                    <a href="#" onClick={() => { switschSDash(); navigate(`profile/${user.id}`)  }} className="flex items-center gap-3 py-2 rounded-2xl text-gray-100 cursor-pointer">
                        <div className='relative'>
                            <img className="w-[37px] h-[37px] border-[1px] border-gray-500 object-cover object-center rounded-full" src={`http://localhost:1800/uploads/${user.profile_picture}`} alt="User Image" />
                            <div className="absolute bottom-[0] right-[0] green w-[10px] h-[10px] rounded-full"></div>
                        </div>
                        <span className="font-semibold fredoka text-[17.5px] tracking-[1px]">My Profile</span>
                    </a>
                    <hr className="border-none h-[1px] bg-gray-500" />
                    <div className="flex items-center gap-3 py-2 rounded-2xl text-gray-300 cursor-pointer">
                        <LogOut strokeWidth={2.2} />
                        <span onClick={() => {switschSDash(); logout()}} className="font-semibold dark:font-semibold text-[18.5px]">Logout</span>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr_1fr] gap-3 mt-5 px-7 pb-6">
                    {
                        dashData.map((data) => (
                            <div key={data.id} className="flex flex-col gap-2 cursor-pointer bg-[#00000018] dark:bg-[#000000bc] rounded-2xl px-7 py-4">
                                <span className="relative">
                                    {data.icon}
                                    {
                                        data.notification
                                            ? <div className="absolute top-[-10px] left-[15px] w-[20px] h-[20px] font-medium text-[13px] tracking-wide rounded-full flex justify-center items-center bg-[#ec2c2c] fredoka text-white dark:text-gray-100">{data.notification}</div>
                                            : ''
                                    }
                                </span>
                                <div className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">{data.data}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default NavPopSC;