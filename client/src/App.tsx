import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import DashboardTabular from "@/pages/DashboardTabular";
import AppBar from "@/components/AppBar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/dashboard/:id" component={Dashboard}/>
      <Route path="/dashboard-tabular/:id" component={DashboardTabular}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="app-container flex flex-col h-screen">
      <TooltipProvider>
        <AppBar />
        <main className="flex-grow flex overflow-hidden">
          <Router />
        </main>
      </TooltipProvider>
    </div>
  );
}

export default App;
