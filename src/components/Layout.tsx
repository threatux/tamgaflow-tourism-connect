import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AIConcierge from "./AIConcierge";

const Layout = () => (
  <div className="min-h-screen relative overflow-x-hidden">
    <Navbar />
    <main className="container px-4 sm:px-6 py-8 sm:py-12 md:py-20">
      <Outlet />
    </main>
    <footer className="container px-4 sm:px-6 py-8 sm:py-10 mt-12 sm:mt-20 border-t border-border/60">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center md:text-left">
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shrink-0">
            <div className="size-2.5 bg-gold rounded-sm rotate-45" />
          </div>
          <span className="font-bold text-foreground">TamgaFlow</span>
          <span className="opacity-60">· Powered by TOUROSAT</span>
        </div>
        <p className="font-medium text-[11px] sm:text-xs">© 2026 Team THREATUX · Tourism Revenue Hackathon</p>
        <div className="flex items-center gap-3 sm:gap-4 text-[10px] uppercase tracking-wider font-semibold opacity-70 flex-wrap justify-center">
          <span>🛰 Sentinel-2</span>
          <span>🗺 SRTM</span>
          <span>🌍 MODIS</span>
        </div>
      </div>
    </footer>
    <AIConcierge />
  </div>
);

export default Layout;
