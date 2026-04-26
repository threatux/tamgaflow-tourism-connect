import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const navItems = [
  { to: "/", label: "Главная" },
  { to: "/tourist", label: "Discover" },
  { to: "/concierge", label: "AI Concierge" },
  { to: "/map", label: "Карта" },
  { to: "/owner", label: "Владельцу" },
  { to: "/dashboard", label: "Фонд" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // lock body scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[1100] glass-strong border-b border-border/60">
      <div className="container flex items-center justify-between h-[64px] sm:h-[72px] px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[var(--shadow-glow-teal)] group-hover:scale-105 transition-premium shrink-0">
            <div className="size-3 sm:size-3.5 bg-gold rounded-sm rotate-45 shadow-sm" />
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-[15px] sm:text-[17px] font-extrabold font-display text-foreground tracking-tight truncate">
              TamgaFlow
            </span>
            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.2em] text-primary font-bold -mt-0.5">
              Powered by TOUROSAT
            </span>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative px-3 lg:px-4 py-2 rounded-xl text-[13px] lg:text-sm font-semibold transition-premium ${
                  isActive
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <NavLink
          to="/tourist"
          className="hidden md:inline-flex items-center gap-1.5 h-10 px-4 lg:px-5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-premium shadow-sm"
        >
          Попробовать
          <span className="text-xs">→</span>
        </NavLink>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-xl bg-card border border-border text-foreground active:scale-95 transition-premium shrink-0"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      {open && (
        <div className="md:hidden fixed inset-0 top-[64px] z-40 bg-background/98 backdrop-blur-xl animate-fade-in overflow-y-auto">
          <div className="container px-4 py-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-between px-5 py-4 rounded-2xl text-base font-bold transition-premium ${
                    isActive
                      ? "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground shadow-[var(--shadow-glow-teal)]"
                      : "bg-card border border-border text-foreground active:scale-[0.98]"
                  }`
                }
              >
                <span>{item.label}</span>
                <ArrowRight className="h-4 w-4 opacity-60" />
              </NavLink>
            ))}

            <button
              onClick={() => {
                setOpen(false);
                navigate("/tourist");
              }}
              className="mt-3 inline-flex items-center justify-center gap-2 h-14 rounded-2xl bg-foreground text-background font-bold text-base shadow-sm active:scale-[0.98] transition-premium"
            >
              Попробовать сейчас
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-6 text-center text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.18em]">
              TamgaFlow · Powered by TOUROSAT
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
