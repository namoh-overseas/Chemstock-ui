"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the screen is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export function useSize() {
  const [size, setSize] = useState("lg")

  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth < 648) {
        setSize("xs")
      } else if (window.innerWidth < 768) {
        setSize("sm")
      } else if (window.innerWidth < 1024) {
        setSize("md")
      } else if (window.innerWidth < 1280) {
        setSize("lg")
      } else {
        setSize("xl")
      }
    }

    checkSize()

    window.addEventListener("resize", checkSize)

    return () => window.removeEventListener("resize", checkSize)
  }, [])

  return size
}
