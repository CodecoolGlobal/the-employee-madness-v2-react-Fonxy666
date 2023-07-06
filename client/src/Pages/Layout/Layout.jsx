import { Outlet, Link, useLocation } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="Layout">
      <nav>
        <ul>
          <li className="grow">
            Employees
          </li>
          <li>
            {location.pathname !== "/workers/search/1" && (
              <Link to="/workers/search/1">
                <button type="button">Search</button>
              </Link>
            )}
            <Link to="/employees/table/1">
              <button type="button">Table</button>
            </Link>
            <Link to="/equipment">
              <button type="button">Create Equipment</button>
            </Link>
            <Link to="/create">
              <button type="button">Create Employee</button>
            </Link>
            {location.pathname !== "/attendance" && location.pathname !== "/attendance/here" && location.pathname !== "/attendance/missing" && (
              <Link to="/attendance/employees/1">
                <button type="button">Attendance</button>
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;