
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumb.css";

function Breadcrumb() {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter(Boolean);

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>

      {pathnames.map((name, index) => {
        const path =
          "/" + pathnames.slice(0, index + 1).join("/");

        const isLast = index === pathnames.length - 1;

        const labelMap = {
          about: "About",
          legacy: "Legacy",
          pulse: "Pulse & Page",
          admin: "Admin",
          profile: "My Profile",
          login: "Login",
          showtime: "Showtime",
        };

        const label =
          labelMap[name] ||
          name.replace(/-/g, " ").replace(/\b\w/g, char =>
            char.toUpperCase()
          );

        return (
          <span className="breadcrumb-item" key={path}>
            <span className="separator">›</span>

            {isLast ? (
              <span aria-current="page">{label}</span>
            ) : (
              <Link to={path}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
