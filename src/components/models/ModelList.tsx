import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModelList() {
  // This is a mock implementation - we'll need to integrate with actual data storage later
  const models = [
    { id: 1, name: "GPT-4", description: "Latest GPT-4 model from OpenAI" },
    { id: 2, name: "Claude", description: "Anthropic's Claude model" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <Card key={model.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">{model.name}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
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
  );
}