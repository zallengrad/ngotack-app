"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

export default function Header({ rightContent, containerClassName = "max-w-6xl", className = "", profileMenu }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems =
    profileMenu &&
    (profileMenu.menuItems ||
      [
        {
          label: "Logout",
          icon: <FiLogOut className="text-sm" />,
          href: profileMenu.logoutHref || "/auth/login",
          onClick: profileMenu.onLogout,
        },
      ]);

  // Logo redirects to dashboard if logged in, otherwise to landing page
  const logoHref = user ? "/dashboard" : "/";

  return (
    <header className={`border-b border-gray-200 bg-white ${className}`}>
      <div className={`${containerClassName} mx-auto px-6 lg:px-10 py-4 flex justify-between items-center`}>
        <Link href={logoHref} className="flex items-center space-x-2">
          <Image src="/assets/logo.png" alt="NGOTACK Logo" width={120} height={40} className="h-12 w-auto object-contain" priority />
        </Link>
        <div className="flex items-center gap-4">
          {rightContent}
          {profileMenu ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:shadow-md transition duration-150 ease-in-out"
                aria-label="Profile menu"
              >
                {profileMenu.icon || <FiUser className="text-lg" />}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  {menuItems?.map((item, idx) => {
                    const content = (
                      <div className="flex items-center gap-2 text-sm text-gray-800">
                        {item.icon || <FiLogOut className="text-sm" />}
                        <span>{item.label}</span>
                      </div>
                    );
                    const handleClick = (e) => {
                      if (item.onClick) item.onClick(e);
                      setOpen(false);
                    };
                    return item.href ? (
                      <Link key={`${item.label}-${idx}`} href={item.href} legacyBehavior>
                        <a
                          className="block px-3 py-2 hover:bg-gray-50 transition duration-100"
                          onClick={handleClick}
                        >
                          {content}
                        </a>
                      </Link>
                    ) : (
                      <button
                        key={`${item.label}-${idx}`}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 transition duration-100"
                        onClick={handleClick}
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
