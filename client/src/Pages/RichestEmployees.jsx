import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import EmployeeTable from '../Components/EmployeeTable/EmployeeTable';

export default function RichestEmployees() {

  const [data, setData] = useState(``);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/employees");
        const data = await response.json();
        if (response.ok) {
          const sortedData = data.sort((a, b) => b.currentSalary - a.currentSalary).slice(0, 3);
          setData(sortedData);
        } else {
          throw new Error('Failed to fetch employee data');
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Link to={`/employees/table/1`}>
        <button type="button">Back to table</button>
      </Link>
      <EmployeeTable workers = { data }/>
    </div>
  )
}
