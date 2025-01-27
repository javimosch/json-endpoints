import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send } from "lucide-react";

const TestAgent = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  // Mock agents data - will be replaced with actual data later
  const agents = [
    { id: "1", name: "Assistant" },
    { id: "2", name: "Researcher" },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { role: 'user', content: message }]);
    setMessage("");
    
    // Mock response - will be replaced with actual API call later
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "This is a mock response. The actual integration will be implemented later." 
      }]);
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Test Agent</h1>
      </div>

      <div className="mb-6">
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger>
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4">
        <ScrollArea className="h-[500px] mb-4 p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted mr-4'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-semibold">
                    {msg.role === 'user' ? 'You' : 'Agent'}
                  </span>
                </div>
                {msg.content}
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TestAgent;