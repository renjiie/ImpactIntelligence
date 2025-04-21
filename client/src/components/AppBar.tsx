import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { HelpCircle, User, ChartScatter } from "lucide-react";

const AppBar = () => {
  const [location, navigate] = useLocation();

  return (
    <header className="bg-[var(--color-primary-main)] text-white elevation-4 z-10">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <ChartScatter className="mr-2" />
          <h1 className="text-xl font-medium">PRD Impact Analysis</h1>
        </div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-[var(--color-primary-dark)] text-white"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-[var(--color-primary-dark)] text-white"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppBar;
