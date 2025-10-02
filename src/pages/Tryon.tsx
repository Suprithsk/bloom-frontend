import withAuth from "@/hoc/withAuth";
import TryOnComponent from "@/components/tryon/TryonComponent";

const TryOn = withAuth(TryOnComponent);

export default TryOn;