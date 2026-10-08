import { createRoot } from "react-dom/client";
import IsboWorkshop from "@/pages/IsboWorkshop";
import "./index.css";

/**
 * GitHub Pages için ayrık giriş noktası: yalnızca İSBO Soru Atölyesi'ni
 * sunucu bağımlılıkları (tRPC, auth) olmadan mount eder.
 */
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<IsboWorkshop />);
}
