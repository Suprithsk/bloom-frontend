import withAuth from "@/hoc/withAuth";
import ProfileComponent from "@/components/ProfileComponent";

const Profile = withAuth(ProfileComponent);

export default Profile;