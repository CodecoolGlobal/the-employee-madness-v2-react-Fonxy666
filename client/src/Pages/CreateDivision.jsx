import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateDivision() {

  const [employees, setEmployees] = useState(``);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [divisionEmployees, setDivisionEmployees] = useState(``);
  const [newDivId, setNewDivId] = useState(``);
  const [newDivision, setNewDivision] = useState({name:``, budget:0, location:{country:``, city:``}, boss:`` });
  const navigate = useNavigate();
  const [triggerUseEffect, setTriggerUseEffect] = useState(false);

  //simple division post function
  const createDivision = (division) => {
    return fetch("/api/divisions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(division),
    }).then((res) => res.json());
  };

  //getting all the employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try{
        const response = await fetch(`http://127.0.0.1:8080/api/employees`);
        const data = await response.json();
        if (response.ok) {
          setEmployees(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchEmployees();
  }, []);

  //fetching all the divisions after the new division got created
  useEffect(() => {
    const fetchDivisions = async () => {
      try{
        const response = await fetch(`/api/divisions`);
        const data = await response.json();
        if (response.ok) {
          const newDivisionData = data.filter(data => data.name === newDivision.name);
          setNewDivId(newDivisionData[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchDivisions();
  }, [triggerUseEffect]);

  //updating employees which are got added to the new division
  const updateEmployee = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ division: data }),
      });
  
      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }
  
      const updatedEmployee = await response.json();
      console.log(updatedEmployee);
    } catch (err) {
      console.error(err);
    }
  };

  //removing the added employees before the post method
  const divElementsElementRemove = (id) => {
    const dividedEmployees = divisionEmployees.filter((divEmployee) => divEmployee._id !== id);
    setDivisionEmployees(dividedEmployees);
  }

  //patching employees to the MongoDB
  useEffect(() => {
    const patchEmployees = async () => {
      if (newDivId) {
        const id = newDivId._id;
        divisionEmployees.forEach(async (employee) => {
          await updateEmployee(`/api/division/employees/${employee._id}`, id);
        });
      }
    };
    patchEmployees();
  }, [newDivId]);

  //end function to navigate back to the divisions
  const handleCreateDivision = () => {
    setTriggerUseEffect(prevState => !prevState);
    createDivision(newDivision);
    alert(`New Division succesfully added!`);
    setTimeout(() => {
      navigate(`/divisions`);
    }, 500);
  }

  return (
    <div className='EmployeeForm'>

      <div className='control'>
        Name: 
        <input onChange={(e) => setNewDivision(prevState => ({...prevState, name: e.target.value}))} />
      </div>

      <div className='control'>
        Budget: 
        <input onChange={(e) => setNewDivision(prevState => ({...prevState, budget: Number(e.target.value)}))} />
      </div>

      <div className='control'>
        Country: 
        <input onChange={(e) => setNewDivision((prevState) => ({...prevState, location: { ...prevState.location, country: e.target.value }}))} />
      </div>

      <div className='control'>
        City: 
        <input onChange={(e) => setNewDivision((prevState) => ({...prevState, location: { ...prevState.location, city: e.target.value }}))} />
      </div>

      <div className='control'>
        Boss:
        <select onChange={(e) => setNewDivision(prevState => ({...prevState, boss: e.target.value}))} >
          <option>None</option>
          {divisionEmployees? (
              divisionEmployees.map(divisionEmployee => {
                return <option key = { divisionEmployee._id } value={divisionEmployee._id} >{divisionEmployee.name}</option>
              })
          ) : (
            <option>None</option>
          )}
        </select>
      </div>

      <div className='control'>
        Employees:
        <select onChange={(e) => setSelectedEmployee(employees.find(employee => employee._id === e.target.value))}>
          <option>None</option>
          {employees? (employees.map(employee => {
            return <option key = {employee._id} value = { employee._id }>{employee.name}</option>
          })) : void 0}
        </select>
        <button style={{maxWidth:"100px"}} onClick={() => setDivisionEmployees(prevState => [...prevState, selectedEmployee])}>Add</button>
      </div>

      <div className='control'>
        {divisionEmployees && divisionEmployees.map(divEmployee => (
          <div key={divEmployee._id}>
            <div className='parent'>
              <div className='divisionName'>{divEmployee.name}</div>
              <button className='divisionButton' onClick={() => {divElementsElementRemove(divEmployee._id)}}>-</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button onClick = { () => handleCreateDivision() }>Create division</button>
      </div>

    </div>
  )
}
