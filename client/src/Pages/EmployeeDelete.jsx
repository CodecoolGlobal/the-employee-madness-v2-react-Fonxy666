import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../Components/Loading";

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const EmployeeDelete = () => {

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(``);
  const [delEmployee, setDelEmployee] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/employees");
      const data = await response.json();
      if (response.ok) {
        data.forEach(worker => {
          if (worker._id === id) {
            setEmployee(worker);
          }
        })
      } else {
        throw new Error('Failed to fetch employee data');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    if (delEmployee) {
      setLoading(true);
      deleteEmployee(id)
      setLoading(false);
      navigate(`/employees/table/1`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, delEmployee]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Are you sure that you want to delete {employee.name} ?</h1>
      <button onClick = { () => setDelEmployee(true) }>Yes</button>
      <Link to={`/employees/table/1`}>
        <button type="button">No</button>
      </Link>
    </div>
  );
};

export default EmployeeDelete;