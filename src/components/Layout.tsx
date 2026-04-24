import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AIConcierge from "./AIConcierge";

const Layout = () => (
  <div className="min-h-screen relative">
    <Navbar />
    <main className="container px-4 py-10 md:py-14">
      <Outlet />
    </main>
    <footer className="container px-4 py-8 text-center text-xs text-muted-foreground border-t border-border/50 mt-12">
      <p className="font-semibold tracking-wide">
        © 2025 TamgaFlow · Team THREATUX · Tourism Revenue Hackathon
      </p>
    </footer>
    <AIConcierge />
  </div>
);

export default Layout;
