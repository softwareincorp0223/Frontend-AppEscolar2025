import React, { useEffect, useState } from "react";
import logo from "../../src/assets/logo_app_escolar.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { menuItems } from "./getCurrentPage";

type MenuItem = {
  label: string;
  icon: string;
  link?: string;
  children?: { label: string; link: string }[];
};

export default function Aside(): JSX.Element {
  const currentPath = window.location.pathname; // ruta actual

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  

  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => child.link === currentPath
        );

        if (hasActiveChild) {
          setOpenSubmenu(index);
        }
      }
    });
  }, [currentPath]);

  const isActive = (link?: string) => (link ? currentPath === link : false);

  return (
    <aside className="sidebar p-3 d-flex flex-column shadow fixed-top">
      <div className="px-3 py-2 mb-4">
        <h6 className="fw-bold text-center">
          <img src={logo} alt="logo" width={50} />
          <span style={{ position: "relative", top: "3px", paddingLeft: "10px" }}>
            App Escolar
          </span>
        </h6>
      </div>

      <nav className="nav flex-column flex-grow-1">
        {menuItems.map((item, index) =>
          item.children ? (
            <React.Fragment key={index}>
              <button
                type="button"
                className="nav-link fontSize d-flex align-items-center w-100 text-start border-0 bg-transparent"
                onClick={() => setOpenSubmenu(openSubmenu === index ? null : index)}
              >
                <span className="d-flex align-items-center">
                  <span className="material-icons me-2">{item.icon}</span>
                  {item.label}
                </span>
                <span
                  className={`material-icons expand-icon ms-auto ${openSubmenu === index ? "rotate-180" : ""
                    }`}
                >
                  expand_more
                </span>
              </button>

              <div
                className={`submenu ps-4 overflow-hidden ${openSubmenu === index ? "submenu-show" : "submenu-hide"
                  }`}
              >
                <ul className="nav flex-column">
                  {item.children.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href={subItem.link}
                        className={`nav-link fontSizeSubMenu ${isActive(subItem.link) ? "active" : ""
                          }`}
                      >
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          ) : (
            <a
              key={index}
              href={item.link}
              className={`nav-link fontSize d-flex align-items-center ${isActive(item.link) ? "active" : ""
                }`}
            >
              <span className="d-flex align-items-center">
                <span className="material-icons me-2">{item.icon}</span>
                {item.label}
              </span>
            </a>
          )
        )}
      </nav>
    </aside>
  );
}
