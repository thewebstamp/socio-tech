import { SiX, SiFacebook, SiInstagram, SiLinkedin, SiPinterest } from 'react-icons/si';
import { Network, MessageCircle, MoreVertical, Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import api from './lib/axios.jsx';
import { useAuthData } from '../context/authContest.jsx';
import { useNavigate } from 'react-router-dom';

function UserProfile({ id }) {
    const navigate = useNavigate();
    const userId = useAuthData().user.id;
    const { setUser } = useAuthData();
    const [image, setImage] = useState([]);
    const [profileImage, setProfileImage] = useState([]);
    const [userp, setUserp] = useState({});
    const [uploadError, setUploadError] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await api.get(`/userProfile/${id}`);
            setUserp(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    //Change Cover/Profile Picture
    const handleSelectFile = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 1) {
            alert("You can only select one image");
            return;
        }
        setImage(files);
    };

    const handleChangeCover = async () => {
        if (!image || image.length === 0) return setUploadError("Please choose an image.");
        const fd = new FormData();
        fd.append("image", image[0]);

        try {
            const res = await api.put("/editCover", fd, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });
            await fetchUser();
            setUser((prev) => ({ ...prev, cover_photo: res.data }));
            setImage([]);
            setUploadError(null);

        } catch (error) {
            console.log(error);
            setUploadError(error.response?.data?.error || "Upload failed");
        }
    };

    //Change Profile Picture
    const handleSelectPicture = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 1) { alert("You can only select one image"); return; };
        setProfileImage(files);
    };

    const changeProfilePicture = async () => {
        if (!profileImage || profileImage.length === 0) { setUploadError("Please choose an image") };
        const fd = new FormData();
        fd.append("image", profileImage[0]);

        try {
            const res = await api.put("/editProfilePicture", fd, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });
            await fetchUser();
            setUser((prev) => ({ ...prev, profile_picture: res.data }))
            setProfileImage([]);
            setUploadError(null);
        } catch (error) {
            console.log(error);
            setUploadError(error.response?.data?.error || "Upload failed");
        }
    };

    //Connect and Disconnect
    const [connected, setConnected] = useState([]);

    const fetchConnected = async () => {
        try {
            const res = await api.get(`/relationship`);
            setConnected(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchUser();
            fetchConnected();
        };

    }, [id]);

    if (!userp) return null;

    const isConnected = connected.some((u) => (u.followed_id === parseInt(id)));

    //Connect with user
    const handleConnect = async () => {
        const followed_id = parseInt(id);
        try {
            await api.post("/connect", { followed_id });
            setConnected((prev) => ([...prev, { followed_id }]))

        } catch (error) {
            console.log(error);
        }
    }

    //Disconnect with user
    const handleDisconnect = async () => {
        const followed_id = parseInt(id);
        try {
            await api.delete(`/disconnect/${followed_id}`);
            setConnected((prev) => prev.filter((u) => u.followed_id !== followed_id));

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='josefin bg-white dark:bg-black mt-2 [@media(max-width:800px)]:mt-[-10px]'>
            <div className='relative'>
                <div>
                    <img className='w-full h-[210px] object-cover object-center' src={`https://socio-tech-server.onrender.com/uploads/${userp.cover_photo}`} alt="" />
                    {
                        id == userId &&
                        <>
                            <label className='cursor-pointer w-7 h-7 absolute flex items-center justify-center bottom-3 right-5 bg-gray-300 dark:bg-gray-800 rounded-full shadow-md' htmlFor="changeCover">
                                <Pencil className='dark:text-gray-100 w-[13px] h-[13px]' />
                            </label>
                            <input className='hidden' type="file" id="changeCover" onChange={handleSelectFile} accept='image/^' />
                        </>
                    }
                </div>
                <div className='absolute bottom-[-35px] [@media(max-width:680px)]:bottom-[-27.5px] left-4'>
                    <div className='relative'>
                        {
                            id == userId &&
                            <>
                                <label className='cursor-pointer w-[22px] h-[22px] absolute flex items-center justify-center bottom-2 left-[-5px] bg-gray-300 dark:bg-gray-800 rounded-full shadow-md' htmlFor="changeProfilePicture">
                                    <Pencil className='dark:text-gray-100 w-[10px] h-[10px]' />
                                </label>
                                <input className='hidden' type="file" id="changeProfilePicture" onChange={handleSelectPicture} accept='image/^' />
                            </>
                        }
                        <img className='border-4 border-white dark:border-black rounded-full w-[70px] h-[70px] [@media(max-width:680px)]:w-[55px] [@media(max-width:680px)]:h-[55px] rouned-full object-cover object-center' src={`https://socio-tech-server.onrender.com/uploads/${userp.profile_picture}`} alt="" />
                        <div className="absolute bottom-[13px] right-[0px] green w-[13px] h-[13px] [@media(max-width:680px)]:w-[10px] [@media(max-width:680px)]:h-[10px] rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Image Change Preview */}
            {
                image.length > 0 && (
                    <div className="flex justify-center items-center fixed z-30 w-full h-screen bg-[#dcdcdcd6] dark:bg-[#323232cd] left-0 top-0">
                        <div className="josefin relative h-[80%] pb-5 pt-10 w-full max-w-[400px] bg-gray-100 dark:bg-black shadow-xl rounded-lg flex gap-4 flex-col items-center justify-between">
                            <X strokeWidth={3} className="cursor-pointer absolute top-2 text-red-700 dark:text-red-600" onClick={() => setImage([])} />
                            <img src={URL.createObjectURL(image[0])} alt="preview" className="w-[90%] h-[80%] object-contain rounded-md" />
                            <div className="w-full px-[7%] flex items-center justify-between">
                                <button onClick={() => { handleChangeCover() }} className="h-[fit-content] cursor-pointer shadow-xl fredoka rounded-lg px-5 py-[5px] font-medium tracking-[0.3px] text-white bg-[#099ec3]">Replace</button>
                                <button className="text-lg text-gray-600 dark:text-gray-400" onClick={() => setImage([])}>Cancel</button>
                            </div>
                            {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
                        </div>
                    </div>
                )
            }
            {
                profileImage.length > 0 && (
                    <div className="flex justify-center items-center fixed z-30 w-full h-screen bg-[#dcdcdcd6] dark:bg-[#323232cd] left-0 top-0">
                        <div className="josefin relative h-[80%] pb-5 pt-10 w-full max-w-[400px] bg-gray-100 dark:bg-black shadow-xl rounded-lg flex gap-4 flex-col items-center justify-between">
                            <X strokeWidth={3} className="cursor-pointer absolute top-2 text-red-700 dark:text-red-600" onClick={() => setProfileImage([])} />
                            <img src={URL.createObjectURL(profileImage[0])} alt="preview" className="w-[90%] h-[80%] object-contain rounded-md" />
                            <div className="w-full px-[7%] flex items-center justify-between">
                                <button onClick={() => { changeProfilePicture() }} className="h-[fit-content] cursor-pointer shadow-xl fredoka rounded-lg px-5 py-[5px] font-medium tracking-[0.3px] text-white bg-[#099ec3]">Replace</button>
                                <button className="text-lg text-gray-600 dark:text-gray-400" onClick={() => setProfileImage([])}>Cancel</button>
                            </div>
                            {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
                        </div>
                    </div>
                )
            }

            <div className='mt-[35px] [@media(max-width:680px)]:mt-[23px] rounded-2xl pt-3 pb-5 px-5'>
                <div className='flex justify-between items-center [@media(max-width:680px)]:flex-col [@media(max-width:680px)]:items-start [@media(max-width:680px)]:justify-start'>
                    <div>
                        <div className='flex flex-col gap-[2px]'>
                            <p className='fredoka leading-[1rem] text-[21px] text-gray-900 dark:text-white font-semibold dark:font-medium'>{userp.name}</p>
                            <p className='font-normal dark:font-light text-gray-500 dark:text-gray-400 text-[16.5px]'>{`@${userp.username}`}</p>
                        </div>
                        <div className='dark:text-gray-300 text-gray-800'>
                            <span className='font-bold text-[19px]'>{userp.connections} </span>
                            <span className='font-semibold dark:font-medium text-[19.5px]'>{userp.connections === 1 ? "connection" : "connections"}</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 [@media(max-width:680px)]:mt-1 dark:text-gray-200'>
                        <SiX className='w-[15.5px] h-[15.5px] cursor-pointer' />
                        <SiLinkedin className='w-[15.5px] h-[15.5px] cursor-pointer' />
                        <SiInstagram className='w-[15.5px] h-[15.5px] cursor-pointer' />
                        <SiFacebook className='w-[15.5px] h-[15.5px] cursor-pointer' />
                        <SiPinterest className='w-[15.5px] h-[15.5px] cursor-pointer' />
                    </div>
                </div>

                {
                    userId == id
                        ? ""
                        : <div className='flex justify-between items-center mt-4'>
                            {
                                isConnected
                                    ? <div className='flex gap-3'>
                                        <button onClick={handleDisconnect} className='cursor-pointer flex gap-2 items-center justify-center fredoka bg-blue-500 dark:text-black font-medium tracking-[0.3px] text-white shadow-lg px-5 py-[6px] rounded-md'>
                                            <Network className='w-[18.5px] h-[18.5px]' />
                                            <span className='text-[17px]'>Disconnect</span>
                                        </button>

                                        <button onClick={() => {navigate("/messages")}} className='cursor-pointer flex gap-2 items-center justify-center fredoka bg-gray-300 dark:bg-[#2b2b2b] dark:text-gray-200 font-medium tracking-[0.3px] text-black shadow-lg px-5 py-[6px] rounded-md'>
                                            <MessageCircle className='w-[18.5px] h-[18.5px]' />
                                            <span className='text-[17px]'>Message</span>
                                        </button>
                                    </div>
                                    : <div className='flex gap-3'>
                                        <button onClick={handleConnect} className='cursor-pointer flex gap-2 items-center justify-center fredoka bg-blue-500 dark:text-black font-medium tracking-[0.3px] text-white shadow-lg px-5 py-[6px] rounded-md'>
                                            <Network className='w-[18.5px] h-[18.5px]' />
                                            <span className='text-[17px]'>Connect</span>
                                        </button>
                                    </div>
                            }

                            <MoreVertical className='cursor-pointer' />
                        </div>
                }
            </div>
        </div>
    )
}

export default UserProfile;