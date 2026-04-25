import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Главная" },
  { to: "/map", label: "Карта" },
  { to: "/owner", label: "Владельцу" },
  { to: "/tourist", label: "Туристу" },
  { to: "/dashboard", label: "Фонд" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/60">
      <div className="container flex items-center justify-between h-[72px] px-6">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[var(--shadow-glow-teal)] group-hover:scale-105 transition-premium">
            <div className="size-3.5 bg-gold rounded-sm rotate-45 shadow-sm" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[17px] font-extrabold font-display text-foreground tracking-tight">
              TamgaFlow
            </span>
            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.2em] text-primary font-bold -mt-0.5">
              Powered by TOUROSAT
            </span>
          </div>
        </NavLink>

        {/* Desktop nav — minimal text links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-xl text-sm font-semibold transition-premium ${
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

        {/* CTA */}
        <NavLink
          to="/tourist"
          className="hidden md:inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-premium shadow-sm"
        >
          Попробовать
          <span className="text-xs">→</span>
        </NavLink>

        {/* Mobile compact */}
        <nav className="md:hidden flex gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-premium ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
