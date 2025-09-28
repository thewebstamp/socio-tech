import Images from '../assets/images.js';
import { Users, Calendar, MonitorPlay, BarChart3, Globe, Settings, HandCoins, GraduationCap, NotebookText, User } from 'lucide-react';
import { useAuthData } from '../context/authContest.jsx';
import { useNavigate } from 'react-router-dom';

function Dash() {
    const navigate = useNavigate();
    const { user } = useAuthData();
    const alert = () => {return window.alert("This is just a demo")};

    return (
        <div className="flex flex-col gap-3 josefin">
            <a href='#' onClick={() => {navigate(`profile/${user.id}`)}} className="flex items-center gap-3 pl-7 py-2 bg-white dark:bg-black rounded-2xl shadow-lg cursor-pointer">
                <div className='relative'>
                    <img className="w-[35px] h-[35px] object-cover object-center rounded-full" src={`${user.profile_picture}`} alt="User Image" />
                    <div className="absolute bottom-[0] right-[0] green w-[10px] h-[10px] rounded-full"></div>
                </div>
                <div className='flex flex-col justify-center'>
                    <p className="fredoka text-[17px] text-gray-900 dark:text-gray-200 font-semibold dark:font-medium">{user.name}</p>
                    <p className='font-normal dark:font-light text-gray-500 dark:text-gray-300 text-[16.5px]'>{`@${user.username}`}</p>
                </div>
            </a>

            <div className="flex flex-col gap-7 bg-white dark:bg-black rounded-2xl py-6 pl-7 shadow-lg">
                <div onClick={alert} className="cursor-pointer flex items-center gap-6">
                    <div className="relative cursor-pointer">
                        <Users className="text-gray-600 dark:text-gray-400" />
                        <div className="absolute top-[-10px] right-[-15px] w-[20px] h-[20px] font-medium text-[13px] tracking-wide rounded-full flex justify-center items-center bg-[#ec2c2c] fredoka text-white dark:text-gray-100">2</div>
                    </div>
                    <p className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">Groups</p>
                </div>
                <div onClick={alert} className="cursor-pointer flex items-center gap-6">
                    <div className="relative cursor-pointer">
                        <Calendar className="text-gray-600 dark:text-gray-400" />
                        <div className="absolute top-[-10px] right-[-15px] w-[20px] h-[20px] font-medium text-[13px] tracking-wide rounded-full flex justify-center items-center bg-[#ec2c2c] fredoka text-white dark:text-gray-100">9+</div>
                    </div>
                    <p className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">Events</p>
                </div>
                <div onClick={alert} className="cursor-pointer flex items-center gap-6">
                    <MonitorPlay className="text-gray-600 dark:text-gray-400" />
                    <p className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">Watch</p>
                </div>
                <div onClick={alert} className="cursor-pointer flex items-center gap-6">
                    <Globe className="text-gray-600 dark:text-gray-400" />
                    <p className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">Explore</p>
                </div>
                <div onClick={alert} className="cursor-pointer flex items-center gap-6">
                    <BarChart3 className="text-gray-600 dark:text-gray-400" />
                    <p className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">Analytics</p>
                </div>
                <div onClick={alert} className="cursor-pointer flex items-center gap-6">
                    <Settings className="text-gray-600 dark:text-gray-400" />
                    <p className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">Settings</p>
                </div>
            </div>

            <div className="flex flex-col gap-7 bg-white dark:bg-black rounded-2xl py-6 pl-7 shadow-lg">
                <div onClick={alert} className="cursor-pointer flex items-center gap-6">
                    <HandCoins className="text-gray-600 dark:text-gray-400" />
                    <p className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">Fundraiser</p>
                </div>
                <div onClick={alert} className="cursor-pointer flex items-center gap-6">
                    <GraduationCap className="text-gray-600 dark:text-gray-400" />
                    <p className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">Tutorials</p>
                </div>
                <div onClick={alert} className="cursor-pointer flex items-center gap-6">
                    <NotebookText className="text-gray-600 dark:text-gray-400" />
                    <p className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">Courses</p>
                </div>
            </div>
        </div>
    )
}

export default Dash;