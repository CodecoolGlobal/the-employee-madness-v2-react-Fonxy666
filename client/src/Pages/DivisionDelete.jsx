import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../Components/Loading";

const deleteDivision = (id) => {
  return fetch(`/api/divisions/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const EmployeeDelete = () => {

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [division, setDivision] = useState(``);
  const [delDivision, setDelDivision] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/divisions");
      const data = await response.json();
      if (response.ok) {
        data.forEach(div => {
          if (div._id === id) {
            setDivision(div);
          }
        })
      } else {
        throw new Error('Failed to fetch division data');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    if (delDivision) {
      setLoading(true);
      deleteDivision(id)
      setLoading(false);
      navigate(`/divisions`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, delDivision]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Are you sure that you want to delete {division.name} ?</h1>
      <button onClick = { () => setDelDivision(true) }>Yes</button>
      <Link to={`/divisions`}>
        <button type="button">No</button>
      </Link>
    </div>
  );
};

export default EmployeeDelete;