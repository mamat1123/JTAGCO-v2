import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} JTAGCO. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}