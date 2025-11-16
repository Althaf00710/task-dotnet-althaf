import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex gap-6">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-lg ${isActive ? "text-blue-600 font-bold" : "text-gray-700"}`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `text-lg ${isActive ? "text-blue-600 font-bold" : "text-gray-700"}`
        }
      >
        Categories
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `text-lg ${isActive ? "text-blue-600 font-bold" : "text-gray-700"}`
        }
      >
        Products
      </NavLink>      
    </nav>
  );
}
