import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

interface JsonItem {
  id?: string;
  title: string;
  json: string;
}

export default function JsonEndpoints() {
  const [items, setItems] = useState<JsonItem[]>([]);
  const [currentItem, setCurrentItem] = useState<JsonItem>({ title: "", json: "{}" });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "readAll" })
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch items",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async () => {
    try {
      // Validate JSON
      JSON.parse(currentItem.json);

      const response = await fetch("/api/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "createUpdate",
          payload: currentItem
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast({
        title: "Success",
        description: isEditing ? "Item updated successfully" : "Item created successfully"
      });

      setCurrentItem({ title: "", json: "{}" });
      setIsEditing(false);
      fetchItems();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof SyntaxError ? "Invalid JSON format" : "Failed to save item",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "remove",
          payload: { id }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      toast({
        title: "Success",
        description: "Item deleted successfully"
      });

      fetchItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: JsonItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit JSON Item" : "Create New JSON Item"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Title"
            value={currentItem.title}
            onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
          />
          <div className="h-[400px] border rounded-md">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={currentItem.json}
              onChange={(value) => setCurrentItem({ ...currentItem, json: value || "{}" })}
              options={{
                minimap: { enabled: false },
                formatOnPaste: true,
                formatOnType: true
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              {isEditing ? "Update" : "Create"}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={() => {
                setCurrentItem({ title: "", json: "{}" });
                setIsEditing(false);
              }}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] border rounded-md">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={item.json}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false }
                  }}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(item.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <a href={`/api/jsons/${item.title}.json`} target="_blank" className="text-blue-600 hover:text-blue-800">
                  View JSON
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
