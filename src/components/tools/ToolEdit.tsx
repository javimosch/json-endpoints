import { useState } from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { History, RotateCcw } from "lucide-react";
import { ToolForm } from "./ToolForm";
import { useToast } from "@/hooks/use-toast";

type Snapshot = {
  id: string;
  timestamp: Date;
  changes: string;
};

export function ToolEdit({ toolId, onClose }: { toolId: number; onClose: () => void }) {
  const { toast } = useToast();
  // Mock snapshots - in a real app, these would come from the backend
  const [snapshots] = useState<Snapshot[]>([
    {
      id: "1",
      timestamp: new Date(2024, 0, 28, 14, 30),
      changes: "Updated tool description"
    },
    {
      id: "2",
      timestamp: new Date(2024, 0, 28, 15, 45),
      changes: "Changed tool type to Source code"
    },
    {
      id: "3",
      timestamp: new Date(2024, 0, 28, 16, 20),
      changes: "Updated source code implementation"
    }
  ]);

  const handleRevert = (snapshotId: string) => {
    // In a real app, this would revert to the selected snapshot
    console.log("Reverting to snapshot:", snapshotId);
    toast({
      title: "Changes reverted",
      description: "The tool has been restored to the selected version."
    });
  };

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 pr-6">
        <h2 className="text-2xl font-bold mb-6">Edit Tool</h2>
        <ToolForm onSuccess={onClose} />
      </div>

      {/* Right sidebar */}
      <div className="w-80 border-l pl-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5" />
          <h3 className="font-semibold">Snapshots</h3>
        </div>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="group relative rounded-lg border p-4 hover:bg-muted/50"
              >
                <div className="mb-2 text-sm text-muted-foreground">
                  {format(snapshot.timestamp, "MMM d, yyyy HH:mm")}
                </div>
                <p className="text-sm">{snapshot.changes}</p>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRevert(snapshot.id)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}