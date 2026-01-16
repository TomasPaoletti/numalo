"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const AuthenticatedNavBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={cn(
        "bg-sidebar border-sidebar-border fixed top-0 right-0 left-0 z-50 border-b transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className={cn(
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg p-2 text-sm font-medium transition-colors",
                isActive("/admin") &&
                  "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              Panel
            </Link>
            <Link
              href="/admin/settings"
              className={cn(
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg p-2 text-sm font-medium transition-colors",
                isActive("/admin/settings") &&
                  "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              Ajustes
            </Link>
          </div>

          <div>
            <Link href="/admin/rifas">
              <Button size="sm">Crear rifa</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthenticatedNavBar;
