import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const EmbedChat = () => {
  const { toast } = useToast();
  const [copiedSimple, setCopiedSimple] = useState(false);
  const [copiedAdvanced, setCopiedAdvanced] = useState(false);

  const simpleSnippet = '<script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>';
  const advancedSnippet = `// Initialize with custom configuration
const config = {
  init: false,
  // Add your custom configuration here
};

import('https://cdn.gpteng.co/gptengineer.js')
  .then((module) => {
    module.initChat(config);
  })
  .catch(console.error);`;

  const copyToClipboard = async (text: string, isSimple: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isSimple) {
        setCopiedSimple(true);
        setTimeout(() => setCopiedSimple(false), 2000);
      } else {
        setCopiedAdvanced(true);
        setTimeout(() => setCopiedAdvanced(false), 2000);
      }
      toast({
        title: "Copied to clipboard",
        description: "The code snippet has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the code manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Embed Chat</h1>
      </div>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Simple Integration</h2>
          <p className="text-muted-foreground mb-4">
            Add this script tag to your HTML file before your main application script.
          </p>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{simpleSnippet}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(simpleSnippet, true)}
            >
              {copiedSimple ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Advanced Integration</h2>
          <p className="text-muted-foreground mb-4">
            Use this JavaScript code for more control over the chat initialization.
          </p>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{advancedSnippet}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(advancedSnippet, false)}
            >
              {copiedAdvanced ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmbedChat;