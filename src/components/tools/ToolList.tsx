import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToolList() {
  // This is a mock implementation - we'll need to integrate with actual data storage later
  const tools = [
    { id: 1, name: "Calculator", description: "Performs mathematical calculations" },
    { id: 2, name: "Weather API", description: "Fetches weather information" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <Card key={tool.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">{tool.name}</CardTitle>
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
            <p className="text-muted-foreground">{tool.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}