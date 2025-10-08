import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email address"),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  allModels: string[];
  previewImage: string;
}

const AddLeadModal = ({ isOpen, onClose, allModels, previewImage }: AddLeadModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
    },
  });

  const handleSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone_number", data.phone_number);
      formData.append("email", data.email);
      formData.append("model_ids", JSON.stringify(allModels));
      
      // Convert preview image to blob and append
      const response = await fetch(previewImage);
      const blob = await response.blob();
      formData.append("preview_image", blob, "preview.jpg");

      // Replace with your API endpoint
      const result = await fetch('/api/leads', {
        method: 'POST',
        body: formData
      });

      const responseData = await result.json();

      if (responseData.success) {
        toast.success("Lead created successfully!");
        onClose();
        // Reset form or navigate as needed
      } else {
        throw new Error(responseData.message || "Failed to create lead");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create Lead</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview Image */}
          <div>
            <Label>Preview Image</Label>
            <div className="mt-2 border rounded-lg overflow-hidden">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Models List */}
          <div>
            <Label>Selected Models</Label>
            <div className="mt-2 space-y-2">
              {allModels.map((model, index) => (
                <div key={index} className="bg-muted p-2 rounded">
                  {model}
                </div>
              ))}
            </div>
          </div>

          {/* Customer Form */}
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                {...form.register("name")}
                className={form.formState.errors.name ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                type="tel"
                maxLength={10}
                {...form.register("phone_number")}
                className={form.formState.errors.phone_number ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {form.formState.errors.phone_number && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phone_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Creating..." : "Create Lead"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddLeadModal;