
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CreateModelBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-card rounded-lg m-8 p-0">
      <CardContent className="flex items-center justify-between gap-4 p-8">
        <div>
          <h4 className="text-xl md:text-2xl font-bold text-foreground">
            Create your 3D Models
          </h4>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Transform Your Retail Space with Replaci's seamless virtual furniture
            customization
          </p>
        </div>

        <div>
          <Button
            onClick={() => navigate("/configurator")}
            className="rounded-full bg-green-500 text-primary-foreground px-5 py-2 md:px-6 md:py-3 shadow-sm hover:opacity-95"
            aria-label="Create 3D Model"
          >
            Create 3D Model
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateModelBanner;