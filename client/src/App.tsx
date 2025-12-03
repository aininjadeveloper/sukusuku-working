import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Account from "@/pages/account";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsConditions from "@/pages/terms-conditions";
import Disclaimer from "@/pages/disclaimer";
import RefundPolicy from "@/pages/refund-policy";
import PenoraFull from "@/pages/penora-full";
import ImageGeneFull from "@/pages/imagegene-full";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/account" component={Account} />
      <Route path="/login" component={Login} />
      <Route path="/penora" component={PenoraFull} />
      <Route path="/imagegene" component={ImageGeneFull} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-conditions" component={TermsConditions} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
