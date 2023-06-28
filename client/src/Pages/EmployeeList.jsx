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

const filterEmployeesByLevel = (member, whichFilter, setter) => {
  const filteredMembers = member.filter(member => {
    return (member.level).toLowerCase().includes(whichFilter.toLowerCase());
  });
  setter(filteredMembers);
}

const filterEmployeesByPosition = (member, whichFilter, setter) => {
  const filteredMembers = member.filter(member => {
    return (member.position).toLowerCase().includes(whichFilter.toLowerCase());
  });
  setter(filteredMembers);
}

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [levelInput, setLevelInput] = useState(``);
  const [positionInput, setPositionInput] = useState(``);

  const handleDelete = (id) => {
    deleteEmployee(id);

    setEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  useEffect(() => {
    (levelInput)? filterEmployeesByLevel(employees, levelInput, setEmployees ) :
      fetchEmployees()
        .then((employees) => {
          setLoading(false);
          setEmployees(employees);
        });
  }, [levelInput]);

  useEffect(() => {
    (positionInput)? filterEmployeesByPosition(employees, positionInput, setEmployees ) :
      fetchEmployees()
        .then((employees) => {
          setLoading(false);
          setEmployees(employees);
        });
  }, [positionInput]);

  if (loading) {
    return <Loading />;
  }

  return <EmployeeTable employees = { employees } onDelete = { handleDelete } setLevelInput = { setLevelInput } setPositionInput = { setPositionInput }/>;
};

export default EmployeeList;
