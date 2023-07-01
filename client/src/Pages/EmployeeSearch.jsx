import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function EmployeeSearch() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [matched, setMatched] = useState('');
  const { search: searchParam } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await fetch('http://127.0.0.1:8080/api/employees');
        if (!fetchedData.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await fetchedData.json();
        setData(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setInputValue(searchParam);
  }, [searchParam]);

  const fetchInputData = () => {
    const match = data.filter((element) =>
      element.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setMatched(match);
    navigate(`/employees/${inputValue}`);
  };

  const handleDelete = (id) => {
    deleteEmployee(id);

    setMatched((data) => {
      return data.filter((employee) => employee._id !== id);
    });
  };

  const deleteEmployee = (id) => {
    return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
      res.json()
    );
  };

  return (
    <div>
      <div>
        <input onChange={(event) => setInputValue(event.target.value)} />
        <button onClick={fetchInputData}>Search</button>
      </div>
      {matched? (
        <div>
          <table>
            <tbody>
            {matched.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.level}</td>
                <td>{employee.position}</td>
                <td>
                  <Link to={`/update/${employee._id}`}>
                    <button type="button">Update</button>
                  </Link>
                  <button type="button" onClick={() => handleDelete(employee._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      ) : (
        void 0
      )}
    </div>
  );
}