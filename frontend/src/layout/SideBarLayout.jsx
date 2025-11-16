import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Tags, Menu, X } from "lucide-react";
import { useState } from "react";

export default function SidebarLayout() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/categories", label: "Categories", icon: <Tags size={20} /> },
    { to: "/products", label: "Products", icon: <Package size={20} /> },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gray-100">

      {/* MOBILE TOP NAV */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white p-4 flex justify-between shadow">
        <h1 className="text-xl font-semibold">Inventory</h1>
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* OVERLAY (mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static 
          bg-white shadow-lg z-50 
          transition-all duration-300 
          min-h-screen
          ${mobileOpen ? "w-64" : "w-0 lg:w-64"} 
          ${open ? "" : "lg:w-20"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-violet-500 text-white">
          <h2 className={`text-xl font-bold transition-all ${open ? "opacity-100" : "opacity-0"}`}>
            Inventory
          </h2>

          <button
            className="hidden lg:flex bg-black/30 hover:bg-black/50 text-white p-1 px-2 rounded"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={14} /> : <Menu size={14} />}
          </button>

          <button className="lg:hidden" onClick={() => setMobileOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="mt-4">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-md text-md transition 
                 ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              <span className={`${open ? "block" : "hidden lg:block"}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-3 mt-16 lg:mt-0 ml-0 lg:ml-0">
        <Outlet />
      </main>
    </div>
  );
}
