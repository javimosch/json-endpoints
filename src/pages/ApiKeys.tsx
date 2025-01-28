import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ApiKey {
  id: string;
  name: string;
  key: string;
}

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const { toast } = useToast();

  const handleAddKey = () => {
    if (!newKeyName) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      });
      return;
    }

    const newKey: ApiKey = {
      id: Math.random().toString(36).substring(7),
      name: newKeyName,
      key: `sk-${Math.random().toString(36).substring(7)}`,
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    toast({
      title: "Success",
      description: "API key created successfully",
    });
  };

  const handleRemoveKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    toast({
      title: "Success",
      description: "API key removed successfully",
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">API Keys</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New API Key</CardTitle>
          <CardDescription>
            Generate a new API key for your application
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="API Key Name"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleAddKey}>
            <Plus className="mr-2 h-4 w-4" />
            Generate Key
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {apiKeys.map((key) => (
          <Card key={key.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="font-semibold">{key.name}</p>
                <p className="text-sm text-muted-foreground">{key.key}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveKey(key.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}