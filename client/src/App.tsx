import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Router as WouterRouter, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ScienceReasoning from "./pages/ScienceReasoning";
import IsboWorkshop from "./pages/IsboWorkshop";

function Router() {
  // GitHub Pages gibi alt yol altında yayınlanan derlemelerde wouter'a base bildir;
  // ana derlemede BASE_URL="/" olduğu için davranış değişmez.
  const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  // make sure to consider if you need authentication for certain routes
  return (
    <WouterRouter base={routerBase}>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/giris"} component={Login} />
      <Route path={"/bilim-zeka"} component={ScienceReasoning} />
      <Route path={"/isbo-atolyesi"} component={IsboWorkshop} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
