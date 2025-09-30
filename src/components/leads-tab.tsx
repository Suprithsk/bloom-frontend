import { Users, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Lead } from "@/types/dashboard";
import { useState, useEffect } from "react";

const LeadsTab = ({ leads }: { leads: Lead[] }) => {
    const navigate = useNavigate();
    const [selectedSort, setSelectedSort] = useState("all");
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

    const getLeadStatusColor = (status: string) => {
        switch (status) {
            case "NEW":
                return "bg-blue-500 text-white";
            case "CONTACTED":
                return "bg-yellow-500 text-white";
            case "COMPLETED":
                return "bg-green-500 text-white";
            case "CLOSED":
                return "bg-gray-500 text-white";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    // Sort and filter leads based on selected option
    useEffect(() => {
        let sortedLeads = [...leads];

        switch (selectedSort) {
            case "all":
                sortedLeads = leads;
                break;
            case "price-low-high":
                sortedLeads = sortedLeads.sort((a, b) => a.total_price - b.total_price);
                break;
            case "price-high-low":
                sortedLeads = sortedLeads.sort((a, b) => b.total_price - a.total_price);
                break;
            case "most-recent":
                sortedLeads = sortedLeads.sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                break;
            case "least-recent":
                sortedLeads = sortedLeads.sort(
                    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
                break;
            default:
                sortedLeads = leads;
        }

        setFilteredLeads(sortedLeads);
    }, [selectedSort, leads]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSort(e.target.value);
    };

    return (
        <div className="border p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">My Leads</h1>
                <div className="flex items-center gap-3">
                    <label htmlFor="sortByLeads" className="text-sm font-medium">
                        Sort By:
                    </label>
                    <select
                        id="sortByLeads"
                        value={selectedSort}
                        onChange={handleSortChange}
                        className="px-3 py-1 border border-border rounded-md bg-background text-sm"
                    >
                        <option value="all">All</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="most-recent">Date: Most Recent</option>
                        <option value="least-recent">Date: Least Recent</option>
                    </select>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Lead ID
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Customer Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Phone Number
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Price
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Created On
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredLeads.length > 0 ? (
                                filteredLeads.map((lead) => (
                                    <tr
                                        key={lead.lead_id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm text-foreground font-medium">
                                            {lead.lead_id}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-foreground">
                                            {lead.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {Array.isArray(lead.category)
                                                ? lead.category.join(", ")
                                                : lead.category}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-foreground">
                                            {lead.phone_number}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-foreground font-medium">
                                            ₹{lead.total_price}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-foreground">
                                            {lead.email || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {lead.created_at}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={`${getLeadStatusColor(
                                                    lead.status
                                                )} text-xs`}
                                            >
                                                {lead.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs px-2 py-1 bg-green-400 text-white hover:bg-green-400 hover:text-white"
                                                    onClick={() =>
                                                        navigate(`/leads/${lead.lead_id}`)
                                                    }
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="text-xs px-2 py-1"
                                                    onClick={() => {
                                                        /* Handle delete */
                                                        console.log("Delete lead:", lead.lead_id);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                                        No result match your search criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {leads.length === 0 && (
                <Card className="p-8 text-center">
                    <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        No Leads Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Start adding leads to track your potential customers.
                    </p>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Lead
                    </Button>
                </Card>
            )}
        </div>
    );
};

export default LeadsTab;