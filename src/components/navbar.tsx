"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FallbackImage from "@/lib/imgLoader";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { getRequestsCount } from "@/app/api/user/requests";
const navItems = [
  { name: "Home", href: "/" },
  { name: "Stocks", href: "/products" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "My Inquiries", href: "/my-inquiry" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const {
    user,
    isAuthenticated,
    logout,
    setRequestsCount,
    requestsCount,
    isLoggedIn,
  } = useStore();

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1240);
  };

  useEffect(() => {
    setIsOpen(false);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname]);

  useEffect(() => {
    const fetchRequestsCount = async () => {
      const count = await getRequestsCount();
      if (count) {
        setRequestsCount(count);
      }
    };
    fetchRequestsCount();
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary shadow-sm min-h-16">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 cursor-pointer max-w-64"
          >
            <FallbackImage
              src="/logo/logo_sticky.png"
              alt="ChemStock Logo"
              width={40}
              height={40}
              className="w-full h-12 mix-blend-darken"
              priority
            />
            {/* <span className="text-xl font-bold text-gray-900">ChemStock</span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav
            className={cn(
              "hidden md:flex items-center space-x-8",
              isMobile ? "md:hidden" : ""
            )}
          >
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href={item.href}
                  className={`text-base font-semibold cursor-pointer flex items-center gap-0.5 ${
                    pathname === item.href
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <Link href="/inquiry">
              <Button className="cursor-pointer h-8 relative">
                <h4
                  style={{
                    lineHeight: "1rem",
                    height: "1.25rem",
                    width: "1.25rem",
                  }}
                  className="text-center h-5 w-5 text-[10px] absolute -top-1 -right-1 bg-red-500 text-white border-0 rounded-full flex items-center justify-center"
                >
                  <span className="relative top-[1px]">
                    {requestsCount > 99 ? "99+" : requestsCount}
                  </span>
                </h4>
                New Inquiries
              </Button>
            </Link>
            <Button asChild className="cursor-pointer h-8">
              <Link href="/request">Request a Stock</Link>
            </Button>
            {isAuthenticated && user?.role === "seller" && (
              <Button asChild className="cursor-pointer h-8">
                <Link href="/seller/add-product">Post Your Stock</Link>
              </Button>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {isAuthenticated ? (
                user?.role === "admin" ? (
                  <Button
                    asChild
                    className="cursor-pointer h-8 hover:bg-amber-100 hover:border-amber-600 hover:text-amber-600 bg-amber-100 border border-amber-600 text-amber-600 font-bold"
                  >
                    <Link href="/admin">Admin Dashboard</Link>
                  </Button>
                ) : user?.role === "seller" ? (
                  <Button
                    asChild
                    className="cursor-pointer h-8 hover:bg-amber-100 hover:border-amber-600 hover:text-amber-600 bg-amber-100 border border-amber-600 text-amber-600 font-bold"
                  >
                    <Link href="/seller">Seller Dashboard</Link>
                  </Button>
                ) : (
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="cursor-pointer h-8"
                  >
                    Logout
                  </Button>
                )
              ) : (
                <Button asChild className="cursor-pointer">
                  <Link href={isLoggedIn ? "/seller" : "/seller/signup"}>
                    Post Your Stocks
                  </Link>
                </Button>
              )}
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <div className={cn("md:hidden", isMobile ? "md:block" : "")}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="cursor-pointer"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "md:hidden bg-white border-t",
              isMobile ? "md:block" : ""
            )}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-base font-medium py-2 cursor-pointer ${
                    pathname === item.href ? "text-primary" : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="cursor-pointer">
                <Link href="/inquiry">New Inquiries</Link>
              </Button>
              <Button asChild className="cursor-pointer">
                <Link href="/request">Request a Stock</Link>
              </Button>
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" ? (
                    <Button
                      asChild
                      className="cursor-pointer hover:bg-amber-100 hover:border-amber-600 hover:text-amber-600 bg-amber-100 border border-amber-600 text-amber-600 font-bold"
                    >
                      <Link href="/admin">Admin Dashboard</Link>
                    </Button>
                  ) : user?.role === "seller" ? (
                    <Button
                      asChild
                      className="cursor-pointer hover:bg-amber-100 hover:border-amber-600 hover:text-amber-600 bg-amber-100 border border-amber-600 text-amber-600 font-bold"
                    >
                      <Link href="/seller">Seller Dashboard</Link>
                    </Button>
                  ) : null}
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="w-full cursor-pointer"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full cursor-pointer">
                  <Link href={isLoggedIn ? "/seller" : "/seller/signup"}>
                    Post Your Stocks
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style >
        {`
          nav * {
            font-size: 0.8rem;
          }
        `}
      </style>
    </header>
  );
}
