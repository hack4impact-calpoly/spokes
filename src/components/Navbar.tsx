"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./styles.css";

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
          <a href="Job_Board">Job Board</a>
        </li>
        <li>
          <a href="List_Job">List Job</a>
        </li>
        <li>
          <a href="Login">Login</a>
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
