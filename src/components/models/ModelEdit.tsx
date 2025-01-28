import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  baseURL: z.string().url("Must be a valid URL"),
  modelName: z.string().min(1, "Model name is required"),
  temperature: z.string().regex(/^\d*\.?\d*$/, "Must be a valid number between 0 and 1"),
  otherParams: z.string().refine((value) => {
    try {
      if (value === '') return true;
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }, "Must be valid JSON"),
});

type ModelEditProps = {
  model: {
    id: number;
    name: string;
    description: string;
    baseURL: string;
    modelName: string;
    temperature: string;
    otherParams: string;
  };
  onSave: (values: z.infer<typeof formSchema>) => void;
};

export function ModelEdit({ model, onSave }: ModelEditProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: model.name,
      description: model.description,
      baseURL: model.baseURL,
      modelName: model.modelName,
      temperature: model.temperature,
      otherParams: model.otherParams,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    toast({
      title: "Model updated",
      description: "Your changes have been saved successfully.",
    });
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
                <Input placeholder="Enter model name" {...field} />
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
                <Textarea placeholder="Enter model description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baseURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter completion base URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter model name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1" 
                  placeholder="Enter temperature (0-1)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otherParams"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Parameters (JSON)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='Enter additional parameters as JSON (e.g., {"max_tokens": 100})' 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </Form>
  );
}