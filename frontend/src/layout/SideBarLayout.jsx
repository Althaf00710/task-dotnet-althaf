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
      <div className="lg:hidden fixed top-0 left-0 w-full flex items-center p-4 
                    text-white bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 backdrop-blur-xl bg-opacity-90 justify-between shadow z-50">
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
          min-h-screen flex flex-col justify-between
          ${mobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"} 
          ${open ? "lg:w-64" : "lg:w-20"}
        `}
      >
        {/* Header */}
        <div className={`
            flex items-center p-4 
            text-white 
            bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 
            backdrop-blur-xl 
            bg-opacity-90
            ${open ? "justify-between" : "lg:justify-center"}
          `}>
          {open && (
            <h3 className="text-lg font-semibold transition-all">
              Organia Inventory
            </h3>
          )}
          
          <div className="flex items-center">
            <button
              className="hidden lg:flex text-white p-2 rounded-full cursor-pointer hover:bg-violet-600"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={14} /> : <Menu size={14} />}
            </button>

            <button className="lg:hidden text-white p-1 hover:bg-violet-600 rounded" onClick={() => setMobileOpen(false)}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-md text-md transition 
                ${isActive ? "bg-violet-100 text-violet-600 font-semibold" : "text-gray-700 hover:bg-gray-100"}
                ${open ? "justify-start" : "lg:justify-center"}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className={`${open ? "block" : "lg:hidden"}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* USER DETAILS at bottom */}
        <div className={`flex items-center gap-3 p-4 border-t bg-gray-200 ${open ? "justify-start" : "lg:justify-center"}`}>
          <img
            src="/user.jpg"
            alt="User"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-400 flex-shrink-0"
          />
          <div className={`${open ? "block" : "lg:hidden"}`}>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700 text-sm">Althaf Ahmed</span>
              <span className="text-purple-600 text-xs">Organia Innovations</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 p-3 mt-16 lg:mt-0 transition-all duration-300 ${open ? "lg:ml-0" : "lg:ml-0"}`}>
        <Outlet />
      </main>
    </div>
  );
}