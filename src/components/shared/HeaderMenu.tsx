"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import headerIcon from "@/assets/images/mainLogo.png";
import NavLinks from "./NavLinks";
import { Menu, X, User, LogOut, ChevronDown, UserRound } from "lucide-react";
import ProfileMenu from "@/pages/home/components/ProfileMenu";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const HeaderMenu = () => {
  //  throw new Error("Test error!");
  const [isOpaque, setIsOpaque] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const accessToken = localStorage.getItem("accessToken");

  // Throttle function for performance
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle opacity change based on scroll position
      setIsOpaque(currentScrollY > 50);
      
      // Handle visibility based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsVisible(true);
      }
      
      // If at the top, always show header
      if (currentScrollY === 0) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const throttledScroll = throttle(handleScroll, 100);

    window.addEventListener("scroll", throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [lastScrollY, throttle]);

  // Close mobile menu when header hides
  useEffect(() => {
    if (!isVisible) {
      setMenuOpen(false);
    }
  }, [isVisible]);

  return (
    <>
      {/* HEADER */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.header
            className="fixed left-0 right-0 z-50 h-16 w-[95%] rounded-b-[40px] sm:rounded-b-[100px] mx-auto shadow-md flex justify-between items-center px-4 sm:px-10"
            initial={{ 
              backgroundColor: "rgba(117,117,117,0.5)", 
              top: "5px",
              y: -100,
              opacity: 0
            }}
            animate={{
              backgroundColor: isOpaque
                ? "rgba(50,50,50,0.9)" // solid
                : "rgba(117,117,117,0.5)", // transparent
              top: isOpaque ? "0" : "20px",
              y: 0,
              opacity: 1
            }}
            exit={{
              y: -100,
              opacity: 0,
              transition: { duration: 0.3 }
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Logo */}
            <div className="flex items-center">
              <img
                className="w-12 h-12 sm:w-16 sm:h-16 mr-4 cursor-pointer"
                src={headerIcon}
                alt="Header Icon"
                onClick={() => {navigate("/")}}
              />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex">
              <NavLinks />
            </div>

            {accessToken &&
            (user?.userVerificationLevel === "LevelOneRegistration" ||
              user?.userVerificationLevel === "LevelTwoRegistration") ? (
              <>
                <ProfileMenu
                  userData={{
                    fullName: `${user?.firstName} ${user?.lastName}`,
                    phoneNumber: user?.phoneNumber,
                  }}
                />
              </>
            ) : (
              <>
                {" "}
                <Button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="text-white p gap-3 bg-secondary rounded-full flex items-center space-x-2 p-3 h-auto"
                >
                  <span className="flex">
                    <UserRound />
                  </span>
                  ورود/ثبت نام
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Sidebar Drawer for Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              className="fixed top-0 right-0 h-full w-64 sm:w-80 bg-primary text-white backdrop-blur-md shadow-lg z-50 flex flex-col p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-10">
                <div className="bg-gray-400 rounded-full p-2 shadow-md shadow-secondary">
                  <img
                    className="w-12 h-12 sm:w-16 sm:h-16"
                    src={headerIcon}
                    alt="Header Icon"
                  />
                </div>
                <button
                  className="text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={28} />
                </button>
              </div>

              {/* Nav Items */}
              <NavLinks />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderMenu;