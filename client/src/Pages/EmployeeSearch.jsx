import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import EmployeeTable from '../Components/EmployeeTable';
import Loading from "../Components/Loading";


export default function EmployeeSearch() {

  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [matched, setMatched] = useState([]);
  const { search: searchParam } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trigUseEffect, setTrigUseEffect] = useState(false);

  useEffect (() => {
    const fetchData = async () => {
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
    const timeout = setTimeout(fetchData, 25);
      return () => clearTimeout(timeout);
  }, [trigUseEffect])

  useEffect(() => {
    setInputValue(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const newMatch = async() => {
      setMatched([]);
      const match = data.filter((element) =>
        element.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setMatched(match);
    }
    newMatch();
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, trigUseEffect]);

  const fetchInputData = async () => {
    setTrigUseEffect(prev => !prev);
    navigate(`/workers/${inputValue}/1`);
    window.location.reload();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div>
        <input onChange={(event) => setInputValue(event.target.value)} />
        <button onClick={fetchInputData}>Search</button>
        <Link to={`/employees/table/1`}>
          <button type="button">Cancel</button>
        </Link>
      </div>
      {matched.length >= 1 && matched? (
        <EmployeeTable workers = { matched }
        setTrigUseEffect = { setTrigUseEffect }
        />
      ) : (
        trigUseEffect && <p>No matching employees found.</p>
      )}
    </div>
  );
}