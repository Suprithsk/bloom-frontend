import { X } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface DeleteModalProps {
    showDeleteConfirm: string | null;
    setShowDeleteConfirm: React.Dispatch<React.SetStateAction<string | null>>;
    handleDelete: (id: string) => void;
}
const DeleteModal = ({ showDeleteConfirm, setShowDeleteConfirm, handleDelete }: DeleteModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Delete Lead
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-6">
                        Are you sure you want to delete this lead? This action
                        cannot be undone.
                    </p>
                    <div className="flex gap-4">
                        
                        <Button
                            variant="destructive"
                            onClick={() => handleDelete(showDeleteConfirm)}
                            className="flex-1"
                        >
                            Yes, Delete
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(null)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteModal;
