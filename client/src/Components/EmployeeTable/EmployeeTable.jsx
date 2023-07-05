import { Link, useNavigate, useParams } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import Loading from "../Loading";
import "./EmployeeTable.css";

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const handleAttendancePatch = async (id, boolean) => {
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

const EmployeeTable = ({ workers, setTriggerUseEffect }) => {

  const [employees, setEmployees] = useState(workers);
  const [loading, setLoading] = useState(true);
  const [filteredEmployees, setFilteredEmployees] = useState(``);
  const [levelInput, setLevelInput] = useState(``);
  const [positionInput, setPositionInput] = useState(``);
  const [firstNameRearrangeButton, setFirstNameRearrangeButton] = useState(`First name descending`);
  const [middleNameRearrangeButton, setMiddleNameRearrangeButton] = useState(`Middle name descending`);
  const [lastNameRearrangeButton, setLastNameRearrangeButton] = useState(`Last name descending`);
  const [levelRearrangeButton, setLevelRearrangeButton] = useState(`Level descending`);
  const [positionRearrangeButton, setPositionRearrangeButton] = useState(`Position descending`);
  const { search: searchParam, page: pageParam } = useParams();
  const [pageValue, setPageValue] = useState(pageParam);
  const navigate = useNavigate();
  const [paginationSlice, setPaginationSlice] = useState({first: 0, second: 10});
  const [triggerPaginationUseEffect, setTriggerPaginationUseEffect] = useState({state: ``, page: pageParam });
  const pageCount = Math.ceil(workers.length / 10);
  
  useEffect(() => {
    setLoading(false);
    setPageValue(pageParam);
    if (filteredEmployees) {
      setFilteredEmployees((prevEmployees) => {
        if (prevEmployees !== workers) {
          const updatedEmployees = prevEmployees.filter((employee) =>
            workers.some((worker) => worker.id === employee.id)
          );
          const mergedEmployees = [...updatedEmployees, ...workers.filter((worker) =>
            !updatedEmployees.some((employee) => employee.id === worker.id)
          )];
          return mergedEmployees;
        } else {
          return prevEmployees;
        }
      });
    } else {
      setFilteredEmployees(workers);
    }
  }, [workers]);

  useEffect(() => {
    filteredEmployeesFunction({ level: levelInput, position: positionInput });
  }, [levelInput, positionInput]);

  useEffect(() => {
    if (searchParam === `table`) {
      navigate(`/employees/${searchParam}/${pageValue}`);
    } else if (searchParam !== `table`){
      navigate(`/workers/${searchParam}/${pageValue}`);
    }
  }, [pageValue]);

  useEffect(() => {
    if (triggerPaginationUseEffect.state === `ascending`) {
      setPaginationSlice((prevSlice) => ({
        first: Number(prevSlice.first) + 10,
        second: Number(prevSlice.second) + 10
      }));
    } else if (triggerPaginationUseEffect.state === `descending`) {
      setPaginationSlice((prevSlice) => ({
        first: Number(prevSlice.first) - 10,
        second: Number(prevSlice.second) - 10
      }));
    }
  }, [triggerPaginationUseEffect]);

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
    setEmployees(filteredMembers);
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
    setEmployees(sortedEmployees);
    setFilteredEmployees(sortedEmployees);
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
    setEmployees(sortedEmployees);
    setFilteredEmployees(sortedEmployees);
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
    setEmployees(sortedEmployees);
    setFilteredEmployees(sortedEmployees);
  }

  const handleAttendance = async (person) => {
    const id = person._id;
    const updatedEmployees = filteredEmployees.map((employee) => {
      if (employee._id === id) {
        return {
          ...employee,
          attendance: !employee.attendance,
        };
      }
      return employee;
    });
    setFilteredEmployees(updatedEmployees);
  
    if (person.attendance === false) {
      handleAttendancePatch(id, true);
      setTriggerUseEffect(true);
    } else if (person.attendance === true) {
      handleAttendancePatch(id, false);
      setTriggerUseEffect(true);
    }
  };

  const handleEmployeesReset = () => {
    setFilteredEmployees(workers);
    navigate(`/employees/table/1`);
  }

  const pageSetter = (event) => {
    if (event.target.innerText === '<=' && pageParam > 1) {
      setPageValue(prevNumber => Number(prevNumber) - 1);
      setTriggerPaginationUseEffect(prevValue => ({
        ...prevValue,
        state: 'descending',
        page: Number(pageParam) - 1
      }));
    } else if (event.target.innerText === '=>' && pageCount !== Number(pageParam)) {
      setPageValue(prevNumber => Number(prevNumber) + 1);
      setTriggerPaginationUseEffect(prevValue => ({
        ...prevValue,
        state: 'ascending',
        page: Number(pageParam) + 1
      }));
    }
  }
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="EmployeeTable">
      <button onClick = {(event) => pageSetter(event)}>{`<=`}</button><button onClick = {(event) => pageSetter(event)}>{`=>`}</button>
      <table>
        <thead>
          <tr>
            <th>
              Name<br/>
              <button onClick={() => ascendingDescendingSort(firstNameRearrangeButton, `First name descending`, `First name ascending`, `name`, setFirstNameRearrangeButton)}>
                {firstNameRearrangeButton}
              </button> <br/>
              <button onClick={() => middleNameRearrange()}>{middleNameRearrangeButton}</button><br/>
              <button onClick={() => lastNameRearrange()}>{lastNameRearrangeButton}</button><br/>
            </th>
            <th>
              Equipment
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
              <button onClick={() => handleEmployeesReset()}>Reset filtered list / Home</button>
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.slice(paginationSlice.first, paginationSlice.second).map((employee) => (
            <tr key={employee._id}>
              <td><h4>{employee.name}</h4></td>
              <td>{employee.equipment}</td>
              {/* <div></div> */}
              <td>{employee.level}</td>
              <td>{employee.position}</td>
              <td>
                <input type="checkbox" checked={employee.attendance} onChange={() => handleAttendance(employee)} />
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
