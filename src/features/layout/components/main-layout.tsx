import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <main className="flex-1 px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}