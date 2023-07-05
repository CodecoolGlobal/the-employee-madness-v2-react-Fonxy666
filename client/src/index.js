import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import Layout from "./Pages/Layout";
import ErrorPage from "./Pages/ErrorPage";
import EmployeeList from "./Pages/EmployeeList";
import EmployeeCreator from "./Pages/EmployeeCreator";
import EmployeeUpdater from "./Pages/EmployeeUpdater";
import EquipmentCreator from "./Pages/EquipmentCreator";
import EmployeeSearch from "./Pages/EmployeeSearch";
import Attendance from "./Pages/Attendance";

import "./index.css";
import TableTest from "./Pages/TableTest";
import FormTest from "./Pages/FormTest";

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <div className="welcome-text">Welcome to the page! Click on the Employees if you want to see the table!</div>,
        },
        {
          path: "/employees/:search/:page",
          element: <EmployeeList />,
        },
        {
          path: "/create",
          element: <EmployeeCreator />,
        },
        {
          path: "/update/:id",
          element: <EmployeeUpdater />,
        },
        {
          path: "/table-test",
          element: <TableTest />,
        },
        {
          path: "/form-test",
          element: <FormTest />,
        },
        {
          path: "/equipment",
          element: <EquipmentCreator />,
        },
        {
          path: "/workers/:search/:page",
          element: <EmployeeSearch />,
        },
        {
          path: "/attendance",
          element: <Attendance />,
        },
        {
          path: "/attendance/here",
          element: <Attendance />,
        },
        {
          path: "/attendance/missing",
          element: <Attendance />,
        },
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router}>
        <Layout />
      </RouterProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
