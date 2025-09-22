import { X, Link } from "lucide-react";
import Images from "../assets/images.js";

//temp "suggested for you" data
const suggestion = [
    {
        name: "Smart Elipson",
        profileImage: Images.img1,
        id: 1
    },
    {
        name: "Ebube Chukwu",
        profileImage: Images.img2,
        id: 2
    }
];
//temp "friends online" data
const friendsOnline = [
    {
        name: "Billy Taylor",
        profileImage: Images.img3,
        id: 1
    },
    {
        name: "Matt Matthew",
        profileImage: Images.img4,
        id: 2
    },
    {
        name: "Oreofe Light",
        profileImage: Images.img5,
        id: 3
    },
    {
        name: "Chris Godson",
        profileImage: Images.img6,
        id: 4
    },
    {
        name: "Favour Emmanuel",
        profileImage: Images.img7,
        id: 5
    },
    {
        name: "Kene Godswill",
        profileImage: Images.img8,
        id: 6
    }
];

function NotifyDash() {
    return (
        <div className="w-full flex flex-col gap-3 josefin">
            <div className="flex flex-col gap-4 bg-white dark:bg-black px-3 pt-5 pb-7 rounded-2xl shadow-lg">
                <div className="text-[18px] text-gray-500 font-medium">Sponsored</div>
                <div className="flex flex-col gap-3">
                    <img className="w-full rounded-lg" src={Images.grammarly} alt="" />
                    <div className="font-semibold tracking-[0.2px] leading-[1.4rem] text-gray-900 text-[18.5px] fredoka dark:text-gray-300">Write better, faster with Grammarly.</div>
                </div>
            </div>

            <div className="flex flex-col gap-4 bg-white dark:bg-black px-3 pt-5 pb-9 rounded-2xl shadow-lg">
                <div className="text-[18.5px] text-gray-500 font-medium">Friends Online</div>
                <div className="flex flex-col gap-5">
                    {
                        friendsOnline.map((data) => (
                            <div key={data.id} className="flex items-center">
                                <div className="flex gap-3 items-center cursor-pointer">
                                    <div className="relative">
                                        <img className="w-[30px] h-[30px] object-cover object-center rounded-full" src={data.profileImage} alt="" />
                                        <div className="absolute bottom-[0] right-[0] green w-[10px] h-[10px] rounded-full"></div>
                                    </div>
                                    <span className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">{data.name}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="flex flex-col gap-4 bg-white dark:bg-black px-3 pt-5 pb-9 rounded-2xl shadow-lg">
                <div className="text-[18.5px] text-gray-500 font-medium">Suggestions For You</div>
                <div className="flex flex-col gap-5">
                    {
                        suggestion.map((data) => (
                            <div key={data.id} className="flex items-center justify-between gap-4">
                                <div className="flex gap-3 items-center cursor-pointer">
                                    <img className="w-[30px] h-[30px] object-cover object-center rounded-full" src={data.profileImage} alt="" />
                                    <span className="font-bold dark:font-semibold text-[17.5px] text-gray-900 dark:text-gray-200">{data.name}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Link strokeWidth={3.5} className="w-[16px] h-[16px] cursor-pointer text-[rgb(59,146,0)]" />
                                    <X strokeWidth={3.5} className="w-[16px] h-[16px] cursor-pointer text-[rgb(197,0,0);]" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default NotifyDash;