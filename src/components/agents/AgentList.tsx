import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AgentList() {
  // This is a mock implementation - we'll need to integrate with actual data storage later
  const agents = [
    { 
      id: 1, 
      name: "Assistant", 
      description: "General purpose AI assistant",
      model: { name: "GPT-4" },
      tools: [
        { name: "Web Search" },
        { name: "Calculator" }
      ]
    },
    { 
      id: 2, 
      name: "Researcher", 
      description: "Specialized in research tasks",
      model: { name: "Claude" },
      tools: [
        { name: "Web Search" },
        { name: "Code Interpreter" }
      ]
    },
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
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{agent.description}</p>
            
            <div>
              <p className="text-sm font-medium mb-2">Model</p>
              <Badge variant="secondary">{agent.model.name}</Badge>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Tools</p>
              <div className="flex flex-wrap gap-2">
                {agent.tools.map((tool, index) => (
                  <Badge key={index} variant="outline">
                    {tool.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}