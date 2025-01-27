import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgentList() {
  // This is a mock implementation - we'll need to integrate with actual data storage later
  const agents = [
    { id: 1, name: "Assistant", description: "General purpose AI assistant" },
    { id: 2, name: "Researcher", description: "Specialized in research tasks" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">{agent.name}</CardTitle>
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
            <p className="text-muted-foreground">{agent.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}