import { Link, useLocation, useParams } from "react-router-dom";
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
  const { page: pageParam } = useParams();
  
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
      {location.pathname !== "/attendance/employees/here" && location.pathname !== "/attendance/employees/missing" && (
        <>
          <Link to={`/attendance/employees/here/1`}>
            <button onClick = { () => handleAttendance() } type="button">Here</button>
          </Link>
          <Link to={`/attendance/employees/missing/1`}>
            <button onClick = { () => handleAttendance() } type="button">Missing</button>
          </Link>
        </>
      )}
      <div>
        {location.pathname === `/attendance/employees/here/${pageParam}` && (
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
        {location.pathname === `/attendance/employees/missing/${pageParam}` && (
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
