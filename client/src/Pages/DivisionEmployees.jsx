import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import EmployeeTable from '../Components/EmployeeTable';
import Loading from "../Components/Loading";

export default function DivisionEmployees() {

  const { division } = useParams();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(``);
  const [divisionUseEffectTrigger, setDivisionUseEffectTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setter(data);
        } else {
          throw new Error('Failed to fetch employee data');
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
  
    const timeout = setTimeout(() => fetchData(`http://127.0.0.1:8080/api/divisions/${division}/employees`, setEmployees), 50);
    return () => clearTimeout(timeout);
  }, [divisionUseEffectTrigger]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Link to={`/divisions`}>
        <button type="button">Back</button>
      </Link>
      <EmployeeTable workers = { employees } setDivisionUseEffectTrigger = { setDivisionUseEffectTrigger } />
    </div>
  )
}
