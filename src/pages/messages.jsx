import Empty from "../components/empty.jsx";
import Images from "../assets/images.js";

function Messages() {
    const p = "Start new conversations, continue where you left off, and never miss a moment with your connections.";

    return (
        <div className="min-h-[calc(100vh-70px)] [@media(max-width:685px)]:min-h-[calc(100vh-105px)] flex items-center">
            <Empty img={Images.chatting} p={p} />
        </div>
    );
};

export default Messages;