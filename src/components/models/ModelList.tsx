import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ModelEdit } from "./ModelEdit";
import { useToast } from "@/hooks/use-toast";

export function ModelList() {
  const [editingModel, setEditingModel] = useState<number | null>(null);
  const { toast } = useToast();

  // This is a mock implementation - we'll need to integrate with actual data storage later
  const models = [
    { 
      id: 1, 
      name: "GPT-4", 
      description: "Latest GPT-4 model from OpenAI",
      baseURL: "https://api.openai.com/v1",
      modelName: "gpt-4",
      temperature: "0.7",
      otherParams: '{"max_tokens": 100}'
    },
    { 
      id: 2, 
      name: "Claude", 
      description: "Anthropic's Claude model",
      baseURL: "https://api.anthropic.com/v1",
      modelName: "claude-2",
      temperature: "0.8",
      otherParams: '{"top_p": 1}'
    },
  ];

  const handleDelete = (id: number) => {
    // Mock delete implementation
    toast({
      title: "Model deleted",
      description: "The model has been deleted successfully.",
    });
  };

  const handleSave = (values: any) => {
    // Mock save implementation
    setEditingModel(null);
    toast({
      title: "Model updated",
      description: "The model has been updated successfully.",
    });
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <Card key={model.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">{model.name}</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setEditingModel(model.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(model.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{model.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editingModel !== null} onOpenChange={() => setEditingModel(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Model</DialogTitle>
          </DialogHeader>
          {editingModel && (
            <ModelEdit 
              model={models.find(m => m.id === editingModel)!} 
              onSave={handleSave}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}