"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { Link, Outlet } from "react-router-dom";

import { useLocation } from "react-router-dom";

// This gives you the current URL path

const MasterLayout = () => {
  // inside your component
  const location = useLocation();
  let pathname = location.pathname;

  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("to") === location ||
            link.getAttribute("to") === location
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div>
          <Link to="/" className="sidebar-logo">
            <img
              src="../assets/images/logo/Logo BLACK.png"
              alt="site logo"
              className="light-logo"
            />
            <img
              src="../assets/images/logo/Bright_Canvas_logo.webp"
              alt="site logo"
              className="dark-logo"
            />
            <img
              src="../assets/images/logo/Bright_Canvas_logo.webp"
              alt="site logo"
              className="logo-icon"
            />
         
          </Link>
        </div>
        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            <li className="sidebar-menu-group-title">Dashboard</li>

            {/* Blog */}
            <li className="dropdown">
              <Link to="#">
                <Icon
                  icon="flowbite:users-group-outline"
                  className="menu-icon"
                />
                <span>Blog</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    to="/blog"
                    className={pathname === "/blog" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                    Blog
                  </Link>
                </li>

                <li>
                  <Link
                    to="/blog/add-blog"
                    className={
                      pathname === "/blog/add-blog" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Add Blog
                  </Link>
                </li>
              </ul>
            </li>

            {/* Work */}
            <li className="dropdown">
              <Link to="#">
                <Icon
                  icon="flowbite:users-group-outline"
                  className="menu-icon"
                />
                <span>Work</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    to="/work"
                    className={pathname === "/work" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                    Work
                  </Link>
                </li>

                <li>
                  <Link
                    to="/work/add-work"
                    className={
                      pathname === "/work/add-work" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Add Work
                  </Link>
                </li>
              </ul>
            </li>

            {/* Invoice Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="hugeicons:invoice-03" className="menu-icon" />
                <span>Invoice</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    to="/invoice"
                    className={pathname === "/invoice" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                    List
                  </Link>
                </li>

                <li>
                  <Link
                    to="/invoice/invoice-add"
                    className={
                      pathname === "/invoice/invoice-add" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Add new
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="invoice/invoice-edit"
                    className={
                      pathname === "/invoice-edit" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    Edit
                  </Link>
                </li> */}
              </ul>
            </li>

            {/* Authentication Dropdown */}
            {/* <li className="dropdown">
              <Link to="#">
                <Icon icon="simple-line-icons:vector" className="menu-icon" />
                <span>Authentication</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    to="/sign-in"
                    className={pathname === "/sign-in" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sign-up"
                    className={pathname === "/sign-up" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/forgot-password"
                    className={
                      pathname === "/forgot-password" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Forgot Password
                  </Link>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon="iconoir:arrow-right"
                      className="icon text-2xl non-active"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:bars-3-solid"
                      className="icon text-2xl non-active "
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
                <form className="navbar-search">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Icon icon="ion:search-outline" className="icon" />
                </form>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                {/* ThemeToggleButton */}
                <ThemeToggleButton />

                {/* Notification dropdown end */}
                <div className="dropdown">
                  <button
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src="../assets/images/logo/bulb.png"
                      alt="bulb_image"
                      className="w-40-px h-40-px object-fit-cover rounded-circle dark-logo"
                    />
              
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm">
                    <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-2">
                          Shaidul Islam
                        </h6>
                        <span className="text-secondary-light fw-medium text-sm">
                          Admin
                        </span>
                      </div>
                      <button type="button" className="hover-text-danger">
                        <Icon
                          icon="radix-icons:cross-1"
                          className="icon text-xl"
                        />
                      </button>
                    </div>
                    <ul className="to-top-list">
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          to="/view-profile"
                        >
                          <Icon
                            icon="solar:user-linear"
                            className="icon text-xl"
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          to="/email"
                        >
                          <Icon
                            icon="tabler:message-check"
                            className="icon text-xl"
                          />{" "}
                          Inbox
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          to="/company"
                        >
                          <Icon
                            icon="icon-park-outline:setting-two"
                            className="icon text-xl"
                          />
                          Setting
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
                          to="#"
                        >
                          <Icon icon="lucide:power" className="icon text-xl" />{" "}
                          Log Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className="dashboard-main-body">
          <Outlet context={{ search, setSearch }} />
        </div>

        {/* Footer section */}
        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0">© 2025 Bright Canvas. All Rights Reserved.</p>
            </div>
            <div className="col-auto">
              <p className="mb-0">Bright Canvas Admin</p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
