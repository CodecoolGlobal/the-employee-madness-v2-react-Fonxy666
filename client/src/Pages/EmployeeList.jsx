import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [triggerUseEffect, setTriggerUseEffect] = useState(false);

  useEffect(() => {
    fetchEmployees().then((employees) => {
      setLoading(false);
      setEmployees(employees);
    });
  }, [triggerUseEffect]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <EmployeeTable workers = { employees } setTriggerUseEffect = { setTriggerUseEffect } />;
    </div>
  )
};

export default EmployeeList;
