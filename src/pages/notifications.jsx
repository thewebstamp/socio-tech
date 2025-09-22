import Empty from "../components/empty.jsx";
import Images from "../assets/images.js";

function Notifications() {
  const p = "You don’t have any notifications right now. When new updates or activity come in, they’ll appear here so you never miss a thing."

  return (
    <div className="min-h-[calc(100vh-70px)] [@media(max-width:685px)]:min-h-[calc(100vh-105px)] flex items-center">
      <Empty p={p} img={Images.notification} />
    </div>
  );
}

export default Notifications;