import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "🏔 Главная" },
  { to: "/owner", label: "🏠 Владелец" },
  { to: "/tourist", label: "🎒 Турист" },
  { to: "/map", label: "🗺 Карта" },
  { to: "/dashboard", label: "📊 Фонд" },
];

const Navbar = () => {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4">
        <NavLink to="/" className="flex flex-col">
          <span className="text-xl font-bold text-primary">TamgaFlow</span>
          <span className="text-[10px] text-muted-foreground -mt-1">
            Powered by TOUROSAT
          </span>
        </NavLink>
        <nav className="flex gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
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
