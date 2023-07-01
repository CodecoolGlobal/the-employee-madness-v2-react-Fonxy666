import { Outlet, Link, useLocation } from "react-router-dom";

import "./Layout.css";

const Layout = () => {

    const location = useLocation();

    return (
      <div className="Layout">
        <nav>
          <ul>
            <li className="grow">
              <Link to="/">Employees</Link>
            </li>
            <li>
              {location.pathname !== "/employees/:search" && (
                <Link to="/employees/:search">
                  <button type="button">Search</button>
                </Link>
              )}
              {location.pathname !== "/" && (
                <Link to="/">
                  <button type="button">Home</button>
                </Link>
              )}
              <Link to="/equipment">
                <button type="button">Create Equipment</button>
              </Link>
              <Link to="/create">
                <button type="button">Create Employee</button>
              </Link>
              {location.pathname !== "/attendance" && (
                <Link to="/attendance">
                  <button type="button">Attendance</button>
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    )
}

export default Layout;
