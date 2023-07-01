import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

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

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState(``);
  const [levelInput, setLevelInput] = useState(``);
  const [positionInput, setPositionInput] = useState(``);
  const [firstNameRearrangeButton, setFirstNameRearrangeButton] = useState(`First name descending`);
  const [middleNameRearrangeButton, setMiddleNameRearrangeButton] = useState(`Middle name descending`);
  const [lastNameRearrangeButton, setLastNameRearrangeButton] = useState(`Last name descending`);
  const [levelRearrangeButton, setLevelRearrangeButton] = useState(`Level descending`);
  const [positionRearrangeButton, setPositionRearrangeButton] = useState(`Position descending`);
  const [triggerUseEffect, setTriggerUseEffect] = useState(false);

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

  useEffect(() => {
    fetchEmployees().then((employees) => {
      setLoading(false);
      setEmployees(employees);
      setFilteredEmployees(employees);
    });
  }, []);

  useEffect(() => {
    filteredEmployeesFunction({ level: levelInput, position: positionInput });
  }, [levelInput, positionInput]);

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

  const handleResetFilteredList = () => {
    setLoading(false);
    setFilteredEmployees(employees);
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

  return <EmployeeTable 
    filteredEmployees = { filteredEmployees } 
    onDelete = { handleDelete } 
    setLevelInput = { setLevelInput } 
    setPositionInput = { setPositionInput } 
    ascendingDescendingSort = { ascendingDescendingSort }
    firstNameRearrangeButton = { firstNameRearrangeButton }
    setFirstNameRearrangeButton = { setFirstNameRearrangeButton }
    middleNameRearrangeButton = { middleNameRearrangeButton }
    middleNameRearrange = { middleNameRearrange }
    lastNameRearrangeButton = { lastNameRearrangeButton }
    lastNameRearrange = { lastNameRearrange }
    levelRearrangeButton = { levelRearrangeButton }
    setLevelRearrangeButton = { setLevelRearrangeButton }
    positionRearrangeButton = { positionRearrangeButton }
    setPositionRearrangeButton = { setPositionRearrangeButton }
    handleResetFilteredList = { handleResetFilteredList }
    handleAttendace = { handleAttendace }
    />;
};

export default EmployeeList;
