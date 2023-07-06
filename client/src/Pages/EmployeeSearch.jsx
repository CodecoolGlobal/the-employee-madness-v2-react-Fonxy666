import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeTable from '../Components/EmployeeTable';

export default function EmployeeSearch() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [matched, setMatched] = useState([]);
  const { search: searchParam } = useParams();
  const [triggerUseEffect, setTriggerUseEffect] = useState(false);
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
  }, [triggerUseEffect]);

  useEffect(() => {
    setInputValue(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setMatched([]);
    const match = data.filter((element) =>
      element.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setMatched(match);
  }, [data]);

  const fetchInputData = async () => {
    setTriggerUseEffect(prev => !prev);
    navigate(`/workers/${inputValue}/1`);
    window.location.reload();
  };

  return (
    <div>
      <div>
        <input onChange={(event) => setInputValue(event.target.value)} />
        <button onClick={fetchInputData}>Search</button>
      </div>
      {matched.length > 0 && matched? (
        <EmployeeTable workers = { matched } searchParam = { searchParam } />
      ) : (
        triggerUseEffect && <p>No matching employees found.</p>
      )}
    </div>
  );
}