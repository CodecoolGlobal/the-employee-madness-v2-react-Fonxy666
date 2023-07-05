import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

export default function Attendance() {
  
  const [data, setData] = useState(``);
  const [loading, setLoading] = useState(true);
  const [employeeHere, setEmployeeHere] = useState(``);
  const [employeeMissing, setEmployeeMissing] = useState(``);
  const [triggerUseEffect, setTriggerUseEffect] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        const jsonData = await response.json();
        setLoading(false);
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAttendance = () => {
    data? data.map(employee => {
      return employee.attendance? setEmployeeHere(prevEmployee => [...prevEmployee, employee]) : setEmployeeMissing(prevEmployee => [...prevEmployee, employee]);
    }) : setLoading(true);
  }
  
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {location.pathname !== "/attendance/here" && location.pathname !== "/attendance/missing" && (
        <>
          <Link to={`/attendance/here`}>
            <button onClick = { () => handleAttendance() } type="button">Here</button>
          </Link>
          <Link to={`/attendance/missing`}>
            <button onClick = { () => handleAttendance() } type="button">Missing</button>
          </Link>
        </>
      )}
      <div>
        {location.pathname === "/attendance/here" && (
          <>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <EmployeeTable workers = { employeeHere } setTriggerUseEffect = { setTriggerUseEffect }/>
              </>
            )}
          </>
        )}
        {location.pathname === "/attendance/missing" && (
          <>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <EmployeeTable workers = { employeeMissing } setTriggerUseEffect = { setTriggerUseEffect }/>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
