import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const EmployeeList = () => {
  
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [triggerUseEffect, setTriggerUseEffect] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/employees");
      const data = await response.json();
      if (response.ok) {
        setEmployees(data);
      } else {
        throw new Error('Failed to fetch employee data');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    if (employees) {
      const setFilteredData = () => {
        fetchData();
        setLoading(false);
      };
      const timeout = setTimeout(setFilteredData, 50);
      return () => clearTimeout(timeout);
    } else if (!employees) {
      const setFilteredData = () => {
        fetchData();
        setLoading(false);
      };
      const timeout = setTimeout(setFilteredData, 50);
      return () => clearTimeout(timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerUseEffect]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <EmployeeTable
          workers = { employees }
          setTriggerUseEffect = { setTriggerUseEffect }
        />
      )}
    </div>
  );
};

export default EmployeeList;