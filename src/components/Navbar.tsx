import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Главная", icon: "🏔" },
  { to: "/owner", label: "Владелец", icon: "🏠" },
  { to: "/tourist", label: "Турист", icon: "🎒" },
  { to: "/map", label: "Карта", icon: "🗺" },
  { to: "/dashboard", label: "Фонд", icon: "📊" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="container flex items-center justify-between h-16 px-4">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-[var(--shadow-glow)] group-hover:scale-105 transition-transform">
            <span className="text-base font-bold text-primary-foreground">T</span>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-gold border-2 border-background" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold font-display text-foreground">
              TamgaFlow
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold -mt-0.5">
              Powered by TOUROSAT
            </span>
          </div>
        </NavLink>
        <nav className="hidden md:flex gap-1 p-1 rounded-2xl bg-muted/60 border border-border/50">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-md"
                    : "text-foreground/70 hover:text-foreground hover:bg-background/60"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {/* Mobile compact */}
        <nav className="md:hidden flex gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-lg text-base transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </nav>
      </div>
      {/* Subtle ornament line */}
      <div className="ornament-divider opacity-50" />
    </header>
  );
};

export default Navbar;
