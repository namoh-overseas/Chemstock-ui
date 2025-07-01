import {
  Noto_Serif_Georgian,
  Kanit,
  Montserrat,
  Roboto,
} from "next/font/google";


export const georgia = Noto_Serif_Georgian({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-georgia",
  weight: "400",
  style: "normal",
  preload: true,
  fallback: ["sans-serif"],
  adjustFontFallback: false,
});

export const kanit = Kanit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kanit",
  weight: "400",
  style: "normal",
  preload: true,
  fallback: ["sans-serif"],
  adjustFontFallback: false,
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: "400",
  style: "normal",
  preload: true,
  fallback: ["sans-serif"],
  adjustFontFallback: false,
});

export const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: "400",
  style: "normal",
  preload: true,
  fallback: ["sans-serif"],
  adjustFontFallback: false,
});
