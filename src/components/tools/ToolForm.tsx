import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["deno", "source"]),
  denoFunctionName: z.string().optional().refine((val) => {
    if (val === undefined) return true;
    return val.length >= 2;
  }, "Function name must be at least 2 characters"),
  sourceCode: z.string().optional().refine((val) => {
    if (val === undefined) return true;
    return val.length >= 10;
  }, "Source code must be at least 10 characters"),
}).refine((data) => {
  if (data.type === "deno") {
    return !!data.denoFunctionName;
  }
  if (data.type === "source") {
    return !!data.sourceCode;
  }
  return true;
}, {
  message: "Please fill in the required fields based on your selection",
  path: ["type"],
});

type ToolFormProps = {
  onSuccess: () => void;
};

export function ToolForm({ onSuccess }: ToolFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "deno",
      denoFunctionName: "",
      sourceCode: "",
    },
  });

  const selectedType = form.watch("type");

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
                <Input placeholder="Enter tool name" {...field} />
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
                <Textarea placeholder="Enter tool description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="deno" />
                    </FormControl>
                    <FormLabel className="font-normal">Deno Function</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="source" />
                    </FormControl>
                    <FormLabel className="font-normal">Source Code</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === "deno" && (
          <FormField
            control={form.control}
            name="denoFunctionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deno Function Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter function name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedType === "source" && (
          <FormField
            control={form.control}
            name="sourceCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Code</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter source code"
                    className="min-h-[200px] font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">Create Tool</Button>
      </form>
    </Form>
  );
}