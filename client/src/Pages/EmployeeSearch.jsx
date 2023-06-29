import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function EmployeeSearch() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [matched, setMatched] = useState('');
  const { search: searchParam } = useParams(); // Access the value of :search parameter
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

  console.log(matched);

  return (
    <div>
      {matched? (
      <div>
        {matched.map((employee) => (
          <div key={employee.name}>{employee.name}</div>
          ))}
      </div>
      ) : (
      <div>
        <input onChange={(event) => setInputValue(event.target.value)} />
        <button onClick={fetchInputData}>Search</button>
      </div>
      )}
    </div>
  );
}