
import withAuth from "@/hoc/withAuth";
import SubscriptionsComponent from "@/components/SubscriptionComponent";

const Subscriptions = withAuth(SubscriptionsComponent);

export default Subscriptions;