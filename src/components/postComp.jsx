import SingleMainPost from "./singleMainPost.jsx";

function PostComp({ post }) {
  return (
    <div className="flex flex-col gap-4 mt-4 [@media(max-width:685px)]:!mt-3 mb-0 [@media(max-width:1000px)]:gap-3">
      {post.map((p) => (
        <SingleMainPost key={p.id} p={p} />
      ))}
    </div>
  );
}

export default PostComp;