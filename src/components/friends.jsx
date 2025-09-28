import { useNavigate } from 'react-router-dom';

function Friends({ friends }) {
    const navigate = useNavigate();

    return (
        <div className="mt-7">
            {
                friends.length > 0
                    ?
                    <div className="mt-2 josefin bg-white dark:bg-black rounded-2xl shadow-lg px-3 pt-4 pb-10">
                        <h2 className="pl-1 font-bold fredoka text-[24px] [@media(max-width:685px)]:text-[22px] tracking-[0.5px] text-gray-500">Your connections</h2>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,max-content))] gap-y-3 [@media(max-width:685px)]:gap-y-4 gap-x-6">
                            {
                                friends.map((friend) => (
                                    <div onClick={() => { navigate(`/profile/${friend.id}`) }} key={friend.id}>
                                        <hr className="mb-3 border-none h-[1px] bg-gray-300 [@media(max-width:685px)]:hidden dark:bg-gray-900" />
                                        <div className="cursor-pointer flex gap-2 items-center">
                                            <img className="w-[55px] h-[55px] object-cover rounded-full" src={`${friend.profile_picture}`} alt="" />
                                            <p className="flex flex-col">
                                                <span className="font-bold text-[17.5px] text-gray-800 dark:text-gray-200 leading-[1.2rem]">{friend.name}</span>
                                                <span className="text-gray-500 text-[14.5px] dark:text-gray-400 dark:font-light leading-[1.2rem]">@{friend.username}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    : <div></div>
            }
        </div>
    )
};

export default Friends;