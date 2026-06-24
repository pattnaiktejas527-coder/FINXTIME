import Dashboard from "./pages/Dashboard";
import AICoach from "./pages/AICoach";
import History from "./pages/History";
import Analytics from "./pages/Analytics";

const routes = [
  { path: "/", element: <Dashboard /> },
  { path: "/ai-coach", element: <AICoach /> },
  { path: "/history", element: <History /> },
  { path: "/analytics", element: <Analytics /> },
];

export default routes;