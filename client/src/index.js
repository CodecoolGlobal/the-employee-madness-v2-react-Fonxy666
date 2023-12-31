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
import EmployeeDelete from "./Pages/EmployeeDelete";
import RichestEmployees from "./Pages/RichestEmployees";
import Divisions from "./Pages/Divisions";
import DivisionUpdate from "./Pages/DivisionUpdate";
import DivisionDelete from "./Pages/DivisionDelete";
import DivisionEmployees from "./Pages/DivisionEmployees";
import CreateDivision from "./Pages/CreateDivision";

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
          element: <div className="welcome-text">Welcome to the page! Click on the Table button if you want to see the table!</div>,
        },
        {
          path: "/employees/:search/:page",
          element: <EmployeeList  />,
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
          path: "/delete/:id",
          element: <EmployeeDelete />,
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
          path: "/attendance/:attendance/1",
          element: <Attendance />,
        },
        {
          path: "/attendance/:attendance/:here/:page",
          element: <Attendance />,
        },
        {
          path: "/attendance/:attendance/:here/:page",
          element: <Attendance />,
        },
        {
          path: "/:search",
          element: <RichestEmployees />,
        },
        {
          path: "/divisions",
          element: <Divisions />,
        },
        {
          path: "/divisions/update/:division",
          element: <DivisionUpdate />
        },
        {
          path: "/divisions/delete/:id",
          element: <DivisionDelete />
        },
        {
          path: "/divisions/:division/employees/:page",
          element: <DivisionEmployees />
        },
        {
          path: "/division/create",
          element: <CreateDivision />
        }
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
