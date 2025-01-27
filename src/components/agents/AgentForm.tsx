import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  modelId: z.string().min(1, "Please select a model"),
  toolIds: z.array(z.string()).min(0),
});

type AgentFormProps = {
  onSuccess: () => void;
};

export function AgentForm({ onSuccess }: AgentFormProps) {
  // Mock data - replace with actual data fetching later
  const models = [
    { id: "1", name: "GPT-4" },
    { id: "2", name: "Claude" },
  ];

  const tools = [
    { id: "1", name: "Web Search" },
    { id: "2", name: "Calculator" },
    { id: "3", name: "Code Interpreter" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      modelId: "",
      toolIds: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter agent name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter agent description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="modelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="toolIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Tools</FormLabel>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <FormField
                    key={tool.id}
                    control={form.control}
                    name="toolIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tool.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tool.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, tool.id])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== tool.id)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {tool.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Agent</Button>
      </form>
    </Form>
  );
}