import PostComp from "./postComp.jsx";
import Images from "../assets/images.js";

export default function Posts({ post }) {
  return (
    <div className="flex flex-col gap-4 mt-1 mb-5">
      {
        post.length > 0
          ? <PostComp post={post} />
          : <div className="josefin px-4 flex flex-col gap-5 items-center justify-center mt-8">
            <img src={Images.noPost} alt="" />
            <p className="text-[18.5px] text-gray-600 dark:text-gray-400 text-center"><span className="text-[22px]">🙁</span> You and your connections haven't made any post yet</p>
          </div>
      }
    </div>
  );
}