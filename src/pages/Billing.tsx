import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Billing() {
  const { toast } = useToast();

  const handleConfigureBilling = () => {
    // TODO: This should redirect to Stripe Customer Portal
    // Implementation would look something like:
    // const { data } = await supabase.functions.invoke('create-portal-session')
    // window.location.href = data.url
    toast({
      title: "Coming Soon",
      description: "Billing configuration will be available soon",
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">Billing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
          <CardDescription>
            Configure your billing settings and view payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleConfigureBilling}>Configure Billing</Button>
        </CardContent>
      </Card>
    </div>
  );
}