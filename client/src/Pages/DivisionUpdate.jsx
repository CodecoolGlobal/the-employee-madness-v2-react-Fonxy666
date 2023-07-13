import React, { useState, useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';

export default function DivisionUpdate() {

  const [division, setDivision] = useState({name:``, location:{country:``, city:``}, boss:``, _id:``, budget:``});
  const [employees, setEmployees] = useState(``);
  const { division: divisionParam } = useParams();
  const navigate = useNavigate();

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
    };
    fetchData(`http://127.0.0.1:8080/api/divisions/${divisionParam}`, setDivision);
    fetchData(`http://127.0.0.1:8080/api/divisions/${divisionParam}/employees`, setEmployees);
  }, []);

  const updateEmployee = () => {
    return fetch(`/api/divisions/${divisionParam}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(division),
    }).then((res) => res.json());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateEmployee();
    navigate(`/divisions`);
  }

  const onCancel = () => {
    navigate(`/divisions`);
  }

  return (
    <form className="EmployeeForm">
      
      <div className="control">
        <label htmlFor="name">Name:</label>
        <input
          value={division.name}
          onChange={(e) => setDivision({ ...division, name: e.target.value })}
          name="name"
          id="name"
        />
      </div>

      <div className="control">
        <label htmlFor="budget">Budget:</label>
        <input
          value={division.budget}
          onChange={(e) => setDivision({ ...division, budget: e.target.value })}
          name="budget"
          id="budget"
        />
      </div>

      <div className="control">
        <label htmlFor="boss">Boss:</label>
        <select
          value={division.boss ? division.boss : "None"}
          onChange={(e) =>
            setDivision({ ...division, boss: e.target.value })
          }
          name="boss"
          id="boss"
        >
          <option value="None">None</option>
          {employees
            ? employees.map((employee) => (
                <option key={employee._id} value={employee._id}>{employee.name}</option>
              ))
            : null}
        </select>
      </div>

      <div className="control">
        <label htmlFor="location">Location:</label>
        <input
          value={division.location.country}
          onChange={(e) => setDivision({ ...division, location: { ...division.location, country: e.target.value } })}
          name="boss"
          id="boss"
        />
        <input
          value={division.location.city}
          onChange={(e) => setDivision({ ...division, location: { ...division.location, city: e.target.value } })}
          name="boss"
          id="boss"
        />
      </div>
      
      <div className="buttons">
        <button onClick={(event) => handleSubmit(event)}>
          Update Division
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>

    </form>
  )
}
