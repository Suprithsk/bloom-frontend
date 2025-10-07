import withAuth from "@/hoc/withAuth";
import NotificationsComponent from "@/components/NotificationsComponent";

const Notifications = withAuth(NotificationsComponent);

export default Notifications;