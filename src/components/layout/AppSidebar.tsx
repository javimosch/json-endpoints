import { Bot, Wrench, Brain, Home, MessageSquare } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Tools", href: "/tools", icon: Wrench },
  { name: "Models", href: "/models", icon: Brain },
  { name: "Test Agent", href: "/test-agent", icon: MessageSquare },
];

export function AppSidebar() {
  const location = useLocation();
  const isMobile = useMobile();

  return (
    <div className="flex flex-col w-64 bg-background border-r border-muted">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg font-bold">My App</h1>
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Menu</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col">
                {navigation.map((item) => (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={location.pathname === item.href ? "default" : "ghost"}
                      className="w-full text-left"
                    >
                      <item.icon className="mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      <nav className="flex-1">
        <ul className="flex flex-col">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link to={item.href}>
                <Button
                  variant={location.pathname === item.href ? "default" : "ghost"}
                  className="w-full text-left"
                >
                  <item.icon className="mr-2" />
                  {item.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
