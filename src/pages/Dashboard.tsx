import withAuth from "@/hoc/withAuth";
import DashboardComponent from "@/components/DashboardComponent";

const Dashboard = withAuth(DashboardComponent);

export default Dashboard;