"use client";

import React, { useState } from "react";
import Image from "next/image";
import "src/styles/Navbar.css";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobile((prevState) => !prevState);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Image alt="spokes logo" src="/Spokes Brand/spoke_upscaled_no_bg.png" width={500} height={500} />
      </div>

      <ul className={`nav_list ${isMobile ? "show" : ""}`}>
        {" "}
        {/* Toggle class 'show' */}
        <li>
          <Link href="Job_Board">Job Board</Link>
        </li>
        <li>
          <Link href="List_Job">List Job</Link>
        </li>
        <li>
          <Link href="Login">Login</Link>
        </li>
      </ul>

      <div className={`Hamburger ${isMobile ? "active" : ""}`} onClick={toggleMobileMenu}>
        <div className="Bar"></div>
        <div className="Bar"></div>
        <div className="Bar"></div>
      </div>
    </nav>
  );
};

export default Navbar;
