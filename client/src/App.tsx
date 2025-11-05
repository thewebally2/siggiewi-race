import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TermsAndConditions from "./pages/TermsAndConditions";
import ContactUs from "./pages/ContactUs";
import Register from "./pages/Register";
import PreviousEditions from "./pages/PreviousEditions";
import AdminDashboard from "./pages/admin/Dashboard";
import EditionsManagement from "./pages/admin/Editions";
import AdminResults from "./pages/admin/Results";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/terms-and-conditions"} component={TermsAndConditions} />
      <Route path={"/contact"} component={ContactUs} />
      <Route path={"/register"} component={Register} />
      <Route path={"/previous-editions"} component={PreviousEditions} />
      <Route path={"/404"} component={NotFound} />
      
      {/* Admin Routes */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/editions"} component={EditionsManagement} />
      <Route path={"/admin/results"} component={AdminResults} />
      
      {/* Fallback */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

