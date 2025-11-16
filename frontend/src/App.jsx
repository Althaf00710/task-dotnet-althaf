import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import SidebarLayout from "./layout/SideBarLayout";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Categories = lazy(() => import("./pages/Categories"));
const Products = lazy(() => import("./pages/Products"));

export default function App() {
  return (
    <Suspense fallback={<div className="p-10 text-lg">Loading...</div>}>
      <Routes>
        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
        </Route>

        <Route
          path="*"
          element={ <NotFound />}
        />
      </Routes>
    </Suspense>
  );
}
