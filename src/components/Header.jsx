import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import { Link, useNavigate } from "react-router-dom";
import { fetchUsers } from "../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import getUserRoleFromToken from "./Role";
import { fetchOrganizationById } from "../redux/slice/oraganizationSlice";
import { viewAllEmployees } from "../redux/slice/employeeSlice";

const Header = () => {
  const [showPreloader, setShowPreloader] = useState(true); 
  const [showBackToTop, setShowBackToTop] = useState(false); 
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const headerRef = useRef(null);
  const navbarLinksRef = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [role, setRole] = useState(null);
  const userId = localStorage.getItem("userId");

  const { employees } = useSelector((state) => state.employee);
  console.log(employees);
  
  const empOrgId = employees.find((emp) => emp?.user?._id === userId)?.user?.organizationId;
  localStorage.setItem("orgId", empOrgId)

  console.log('empOrgId',empOrgId);
  

  const orgId = empOrgId || localStorage.getItem("orgId");
  const { org } = useSelector((state) => state.organization);
  const orgEmployee = org?.info?._id === orgId ? org : null;

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers());
      if (orgId) {
        dispatch(viewAllEmployees());
        dispatch(fetchOrganizationById(orgId));
      }
      const userRole = getUserRoleFromToken(token);
      setRole(userRole);
    }
  }, [dispatch, token, orgId]);

  const handleNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  useEffect(() => {
    const handleLoad = () => {
      setShowPreloader(false);
    };
    window.addEventListener("load", handleLoad);

    const handleScroll = () => {
      const position = window.scrollY + 200;
      navbarLinksRef.current.forEach((navbarLink) => {
        const section = document.querySelector(navbarLink.getAttribute("href"));
        if (section && position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
          navbarLink.classList.add("active");
        } else {
          navbarLink.classList.remove("active");
        }
      });

      setShowBackToTop(window.scrollY > 100);

      if (headerRef.current) {
        if (window.scrollY > 100) {
          headerRef.current.classList.add("header-scrolled");
        } else {
          headerRef.current.classList.remove("header-scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("load", handleScroll);

    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <header id="header" className="fixed-top" ref={headerRef}>
      <div className="container d-flex align-items-center">
        <h1 className="logo me-auto">
          <Link to="/">
            {orgEmployee?.info?.name ? orgEmployee.info.name : "TeamgridMatch"}
          </Link>
        </h1>

        <nav id="navbar" className={`navbar ${isMobileNavOpen ? "navbar-mobile" : ""}`}>
          <i
            className={`bi ${isMobileNavOpen ? "bi-x" : "bi-list"} mobile-nav-toggle`}
            onClick={handleNavToggle}
          ></i>

          <ul className={`navbar-menu ${isMobileNavOpen ? "show" : ""}`}>
            <li>
              <Link className="nav-link scrollto" to="/home">Home</Link>
            </li>
            <li>
              <Link className="nav-link scrollto" to="/about">About</Link>
            </li>
            <li>
              <Link className="nav-link scrollto" to="/services">Services</Link>
            </li>
            <li>
              <Link className="nav-link scrollto" to="/team">Team</Link>
            </li>
            <li className="dropdown">
            <Link className="nav-link scrollto" to="/job">Job</Link>
              <ul>
                <li>
                  <a onClick={() => navigate("/wantjob")}>Want A Job</a>
                </li>
                {role === "admin" || role === "super_admin" ? (
                  <li>
                    <a onClick={() => navigate("/postjob")}>Post A Job</a>
                  </li>
                ) : null}
              </ul>
            </li>
            <li>
              {token ? (
                <Link
                  className="getstarted scrollto"
                  to="/logout"
                  onClick={() => {
                    localStorage.clear(); // Clear all localStorage items
                    navigate("/home"); // Navigate to home after logout
                  }}
                >
                  LogOut
                </Link>
              ) : (
                <Link className="getstarted scrollto" to="/login">LogIn</Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
