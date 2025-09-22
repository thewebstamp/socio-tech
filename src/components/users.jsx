import { useNavigate } from 'react-router-dom';

export default function Connect({ users, handleConnect }) {
    const navigate = useNavigate();

    return (
        <div>
            {
                users.length > 0 && <div className="mt-5 josefin bg-white dark:bg-black rounded-2xl shadow-lg px-3 pt-4 pb-5">
                    <h2 className="pl-1 font-bold fredoka text-[24px] [@media(max-width:685px)]:text-[22px] tracking-[0.5px] text-gray-500">Connect with other users</h2>
                    <div className="mt-5">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,max-content))] gap-y-7 gap-x-2">
                            {
                             users.map((user) => (
                                    <div onClick={() => {navigate(`/profile/${user.id}`)}} key={user.id} className="shadow-lg rounded-lg overflow-hidden bg-gray-100 dark:bg-[#181818a3] pb-2">
                                        <img className="h-20 object-cover w-full" src={`http://localhost:1800/uploads/${user.cover_photo}`} alt="" />
                                        <div className="px-2">
                                            <div className="mt-[-25px]">
                                                <img className="ml-2 h-[47px] w-[47px] object-cover rounded-full" src={`http://localhost:1800/uploads/${user.profile_picture}`} alt="" />
                                                <p className="mt-2 font-bold text-[14.5px] dark:text-gray-200 leading-[1.2rem]">{user.name}</p>
                                                <p className="text-gray-600  text-[14.5px] dark:text-gray-400 dark:font-light leading-[1.2rem]">@{user.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
};