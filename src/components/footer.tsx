"use client";
import Link from "next/link";
import { useStore } from "@/store";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "./ui/select";
import {
  // Facebook,
  // Twitter,
  // Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import FallbackImage from "@/lib/imgLoader";

export default function Footer() {
  const { currency, switchCurrency } = useStore();
  
  return (
    <footer className="bg-gray-200 text-black pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FallbackImage
                src="/logo/logo_sticky.png"
                alt="ChemStock Logo"
                width={40}
                height={40}
                className="w-full max-w-50 h-10 mix-blend-darken"
              />
              {/* <span className="text-xl font-bold">ChemStock</span> */}
            </div>
            <p className="text-black mb-4">
              Your trusted source for high-quality chemicals and dyes stocks.
            </p>
            <div className="flex space-x-4">
              {/* <a
                href="#"
                className="text-black hover:text-primary transition-colors cursor-pointer"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a> */}
              {/* <a
                href="#"
                className="text-black hover:text-primary transition-colors cursor-pointer"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a> */}
              {/* <a
                href="#"
                className="text-black hover:text-primary transition-colors cursor-pointer"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a> */}
              <Link
                href="https://www.linkedin.com/in/chem-stock-b53161186"
                className="text-black hover:text-primary transition-colors cursor-pointer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-black hover:text-primary transition-colors cursor-pointer"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-black hover:text-primary transition-colors cursor-pointer"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-black hover:text-primary transition-colors cursor-pointer"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-black hover:text-primary transition-colors cursor-pointer"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="">
                  <MapPin className="mr-2 text-primary shrink-0 mt-0.5" />
                </div>
                <span className="text-black">
                  59, Gajanand Industrial Hub-2, Behind Benzo Products, Phase -
                  4, Vatva GIDC, Ahmedabad - 382445, Gujarat, India
                </span>
              </li>
              <li className="flex items-center">
                <div className="">
                  <Phone className="mr-2 text-primary" />
                </div>
                <a
                  href="tel:+917359381236"
                  className="text-black hover:text-primary transition-colors cursor-pointer"
                >
                  Vansh Patel +91 7359381236
                </a>
              </li>
              <li className="flex items-center">
                <div className="">
                  <Mail className="mr-2 text-primary" />
                </div>
                <a
                  href="mailto:support@chemstock.com"
                  className="text-black hover:text-primary transition-colors cursor-pointer"
                >
                  chemstock74@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="">
            <h3 className="text-lg font-semibold mb-4">My Currency</h3>
            <div className="">
              <Select
                onValueChange={(e: string) => switchCurrency(e)}
                defaultValue={currency}
                value={currency}              >
                <SelectTrigger>
                  <SelectValue>{ currency }</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ChemStock. All rights reserved.
            </p>
            {/* <div className="flex space-x-6">
              <Link
                href="/terms"
                className="text-gray-600 hover:text-primary text-sm transition-colors cursor-pointer"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-primary text-sm transition-colors cursor-pointer"
              >
                Privacy Policy
              </Link>
              <Link
                href="/faq"
                className="text-gray-600 hover:text-primary text-sm transition-colors cursor-pointer"
              >
                FAQ
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
