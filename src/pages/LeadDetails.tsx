// EditLeadPage.tsx
import withAuth from "@/hoc/withAuth";
import LeadDetailsComponent from "@/components/LeadDetailsComponent";

const LeadComponent=withAuth(LeadDetailsComponent);

export default LeadComponent;