import { Link, useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

export default function Attendance() {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeHere, setEmployeeHere] = useState([]);
  const [employeeMissing, setEmployeeMissing] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [attendanceUseEffectTrigger, setAttendanceUseEffectTrigger] = useState(false);
  const location = useLocation();
  const { page: pageParam } = useParams();

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const jsonData = await response.json();
      if (response.ok) {
        setData(jsonData);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchEmployees();
      setLoading(false);
    };
    const timeout = setTimeout(fetchData, 400);
    return () => clearTimeout(timeout);
  }, [attendanceUseEffectTrigger]);
  
  useEffect(() => {
    const handleAttendance = () => {
      if (data) {
        const employeesHere = data.filter(employee => employee.attendance);
        const employeesMissing = data.filter(employee => !employee.attendance);
        setEmployeeHere(employeesHere);
        setEmployeeMissing(employeesMissing);
      }
    };
  
    handleAttendance();
  }, [data]);
  
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {location.pathname !== `/attendance/employees/here/${pageParam}` && location.pathname !== `/attendance/employees/missing/${pageParam}` && (
        <>
          <Link to={`/attendance/employees/here/1`}>
            <button type="button">Here</button>
          </Link>
          <Link to={`/attendance/employees/missing/1`}>
            <button type="button">Missing</button>
          </Link>
        </>
      )}
      <div>
        {location.pathname === `/attendance/employees/here/${pageParam}` && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <>
                <EmployeeTable workers = { employeeHere } setAttendanceTrigger = { setAttendanceUseEffectTrigger }/>
              </>
            )}
          </>
        )}
        {location.pathname === `/attendance/employees/missing/${pageParam}` && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <>
                <EmployeeTable workers = { employeeMissing } setAttendanceTrigger = { setAttendanceUseEffectTrigger }/>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
