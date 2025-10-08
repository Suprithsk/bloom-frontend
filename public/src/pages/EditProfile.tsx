import withAuth from "@/hoc/withAuth";
import EditProfileComponent from "@/components/EditProfileComponent";

const EditProfile = withAuth(EditProfileComponent);

export default EditProfile;