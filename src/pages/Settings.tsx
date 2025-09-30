import withAuth from "@/hoc/withAuth";
import SettingsComponent from "@/components/SettingsComponent";

const Settings = withAuth(SettingsComponent);

export default Settings;