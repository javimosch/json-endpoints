import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Tool, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const sections = [
    {
      title: "Agents",
      description: "Manage your AI agents",
      icon: Bot,
      link: "/agents",
    },
    {
      title: "Tools",
      description: "Configure agent tools",
      icon: Tool,
      link: "/tools",
    },
    {
      title: "Models",
      description: "Manage LLM models",
      icon: Brain,
      link: "/models",
    },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.title} to={section.link}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <section.icon className="h-8 w-8 text-primary" />
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Index;