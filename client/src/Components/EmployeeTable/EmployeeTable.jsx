import { Link } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import Loading from "../Loading";
import "./EmployeeTable.css";

const fetchEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
};

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const handleAttendanceFetch = async (id, boolean) => {
  try {
    const response = await fetch(`http://127.0.0.1:8080/api/attendance/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attendance: boolean })
    });
    if (response.ok) {
      console.log('Response okay!');
    }
  } catch (err) {
    console.error('Attendance update failed');
  }
};

const EmployeeTable = ({ persons }) => {

  const [loading, setLoading] = useState(true);
  const [filteredEmployees, setFilteredEmployees] = useState(``);
  const [levelInput, setLevelInput] = useState(``);
  const [positionInput, setPositionInput] = useState(``);
  const [firstNameRearrangeButton, setFirstNameRearrangeButton] = useState(`First name descending`);
  const [middleNameRearrangeButton, setMiddleNameRearrangeButton] = useState(`Middle name descending`);
  const [lastNameRearrangeButton, setLastNameRearrangeButton] = useState(`Last name descending`);
  const [levelRearrangeButton, setLevelRearrangeButton] = useState(`Level descending`);
  const [positionRearrangeButton, setPositionRearrangeButton] = useState(`Position descending`);
  const [triggerUseEffect, setTriggerUseEffect] = useState(false);
  const [employees, setEmployees] = useState(persons);
  

  useEffect(() => {
    fetchEmployees().then((employees) => {
      setFilteredEmployees(employees);
    });
  }, []);

  useEffect(() => {
    filteredEmployeesFunction({ level: levelInput, position: positionInput });
  }, [levelInput, positionInput]);

  const filteredEmployeesFunction = (filters) => {
    let filteredMembers;
    if (filters.level && !filters.position) {
      filteredMembers = employees.filter(member => {
        return member.level.toLowerCase().includes(filters.level.toLowerCase());
      });
    } else if (filters.position && !filters.level) {
      filteredMembers = employees.filter(member => {
        return member.position.toLowerCase().includes(filters.position.toLowerCase());
      });
    } else if (filters.position && filters.level) {
      let tempMembers = employees.filter(member => {
        return member.level.toLowerCase().includes(filters.level.toLowerCase());
      });
      filteredMembers = tempMembers.filter(member => {
        return member.position.toLowerCase().includes(filters.position.toLowerCase());
      })
    } else {
      filteredMembers = employees;
    }
    setFilteredEmployees(filteredMembers);
  };

  const handleDelete = (id) => {
    deleteEmployee(id);

    setFilteredEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  const ascendingDescendingSort = (button, descendingString, ascendingString,  key , nameSetter) => {
    const sortedEmployees = [...filteredEmployees];
    sortedEmployees.sort((a, b) => {
      const keyA = a[key].toLowerCase();
      const keyB = b[key].toLowerCase();
      if (button === descendingString) {
        nameSetter(ascendingString);
        if (keyA < keyB) {
          return 1;
        }
        if (keyA > keyB) {
          return -1;
        }
        return 0;
      } else if (button === ascendingString) {
        nameSetter(descendingString);
        if (keyA > keyB) {
          return 1;
        }
        if (keyA < keyB) {
          return -1;
        }
        return 0;
      }
    });
    setFilteredEmployees(sortedEmployees);
    setEmployees(sortedEmployees);
  }

  const middleNameRearrange = () => {
    let sortedEmployees = [];
    filteredEmployees.map(element => {
      if (element.name.split(` `).length === 3) {
        sortedEmployees.push(element);
      }
    })
    sortedEmployees.sort((a, b) => {
      const nameA = a.name.toLowerCase().split(` `)[a.name.split(' ').length - 2];
      const nameB = b.name.toLowerCase().split(` `)[b.name.split(' ').length - 2];
      if (middleNameRearrangeButton === 'Middle name descending') {
        setMiddleNameRearrangeButton(`Middle name ascending`);
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      } else if (middleNameRearrangeButton === 'Middle name ascending') {
        setMiddleNameRearrangeButton(`Middle name descending`);
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        return 0;
      }
    });
    setFilteredEmployees(sortedEmployees);
    setEmployees(sortedEmployees);
  }

  const lastNameRearrange = () => {
    const sortedEmployees = [...filteredEmployees];
    sortedEmployees.sort((a, b) => {
      const nameA = a.name.toLowerCase().split(` `)[a.name.split(' ').length - 1];
      const nameB = b.name.toLowerCase().split(` `)[b.name.split(' ').length - 1];
      if (lastNameRearrangeButton === 'Last name descending') {
        setLastNameRearrangeButton(`Last name ascending`);
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      } else if (lastNameRearrangeButton === 'Last name ascending') {
        setLastNameRearrangeButton(`Last name descending`);
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        return 0;
      }
    });
      setFilteredEmployees(sortedEmployees);
      setEmployees(sortedEmployees);
  }

  const handleAttendace = (person) => {
    const id = person._id;
    setTriggerUseEffect((prevTrigger) => !prevTrigger);
    if (person.attendance === false) {
      handleAttendanceFetch(id, true);
      console.log(person.attendance);
    } else if (person.attendance === true) {
      handleAttendanceFetch(id, false);
      console.log(person.attendance);
    }
  }

  useEffect(() => {
    fetchEmployees().then((employees) => {
      setLoading(false);
      if (filteredEmployees) {
        const updatedEmployees = filteredEmployees.map((filteredEmployee) => {
          employees.map(employee => {
            if (filteredEmployee.name === employee.name) {
              return { ...filteredEmployee, attendance: employees.attendance };
            }
          })
        });
        setFilteredEmployees(updatedEmployees);
      }
    });
  }, [triggerUseEffect]);

  if (loading) {
    return <Loading />;
  }

  return (
  <div className="EmployeeTable">
    <table>
      <thead>
        <tr>
          <th>
            Name
            <button onClick={() => ascendingDescendingSort(firstNameRearrangeButton, `First name descending`, `First name ascending`, `name`, setFirstNameRearrangeButton)}>
              {firstNameRearrangeButton}
            </button>
            <button onClick={() => middleNameRearrange()}>{middleNameRearrangeButton}</button>
            <button onClick={() => lastNameRearrange()}>{lastNameRearrangeButton}</button>
          </th>
          <th>
            Level <input onChange={(event) => { setLevelInput(event.target.value) }} />
            <button onClick={() => ascendingDescendingSort(levelRearrangeButton, `Level descending`, `Level ascending`, `level`, setLevelRearrangeButton)}>
              {levelRearrangeButton}
            </button>
          </th>
          <th>
            Position <input onChange={(event) => { setPositionInput(event.target.value) }} />
            <button onClick={() => ascendingDescendingSort(positionRearrangeButton, `Position descending`, `Position ascending`, `position`, setPositionRearrangeButton)}>
              {positionRearrangeButton}
            </button>
          </th>
          <td>
            <button onClick={() => setFilteredEmployees(persons)}>Reset filtered list</button>
          </td>
        </tr>
      </thead>
      <tbody>
        {filteredEmployees && filteredEmployees.map((employee) => (
          <tr key={employee._id}>
            <td>{employee.name}</td>
            <td>{employee.level}</td>
            <td>{employee.position}</td>
            <td>
              <input type="checkbox" checked={employee.attendance} onChange={() => handleAttendace(employee)} />
              <Link to={`/update/${employee._id}`}>
                <button type="button">Update</button>
              </Link>
              <button type="button" onClick={() => handleDelete(employee._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default EmployeeTable;
