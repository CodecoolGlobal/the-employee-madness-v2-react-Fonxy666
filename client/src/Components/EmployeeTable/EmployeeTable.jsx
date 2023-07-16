import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Loading from "../Loading";
import "./EmployeeTable.css";

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
      console.log('Patch completed!');
    }
  } catch (err) {
    console.error('Attendance update failed');
  }
};

const EmployeeTable = ({ workers, setTriggerUseEffect, setTrigUseEffect, setAttendanceTrigger, setDivisionUseEffectTrigger }) => {

  const recordPerPage = [10, 25, 50, 100];
  const [recordPerPageState, setRecordPerPageState] = useState(10);
  const { search: searchParam, page: pageParam, attendance: attendanceParam, here: hereParam, division: divisionParam } = useParams();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(workers);
  const [filteredEmployees, setFilteredEmployees] = useState(``);
  const [isFilteredEmployeesReady, setIsFilteredEmployeesReady] = useState(false);
  const [name, setName] = useState(``);
  const [brands, setBrands] = useState(``);
  const [divisions, setDivisions] = useState(``);
  const [levelInput, setLevelInput] = useState(``);
  const [positionInput, setPositionInput] = useState(``);
  const [inputCheck, setInputCheck] = useState(false);
  const [lastNameRearrangeButton, setLastNameRearrangeButton] = useState(`Last name descending`);
  const [pageValue, setPageValue] = useState(pageParam);
  const [triggerPaginationUseEffect, setTriggerPaginationUseEffect] = useState({state: ``, page: pageParam });
  const [paginationSlice, setPaginationSlice] = useState({first: 0, second: recordPerPageState});
  const pageCount = Math.ceil(filteredEmployees.length / recordPerPageState);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const navigate = useNavigate();

  const fetchBrand = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/brands`);
      const data = await response.json();
      if (response.ok) {
        setBrands(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const fetchDivision = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/divisions`);
      const data = await response.json();
      if (response.ok) {
        setDivisions(data);
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    setPageValue(pageParam);
    fetchBrand();
    fetchDivision();
    if (filteredEmployees) {
      setFilteredEmployees((prevEmployees) => {
        if (prevEmployees !== workers) {
          const updatedEmployees = prevEmployees.filter((employee) =>
            workers.some((worker) => worker.id === employee.id)
          );
          const mergedEmployees = [
            ...updatedEmployees,
            ...workers.filter(
              (worker) => !updatedEmployees.some((employee) => employee.id === worker.id)
            )
          ];
          return mergedEmployees;
        } else {
          return prevEmployees;
        }
      });
    } else {
      setTimeout(() => {
        setIsFilteredEmployeesReady(true);
        setLoading(false);
      }, 400);
      setFilteredEmployees(workers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers]);

  useEffect(() => {
    setLoading(true);
    if (filteredEmployees) {
      const setFilteredData = () => {
        setFilteredEmployees(workers);
        setLoading(false);
      };
      const timeout = setTimeout(setFilteredData, 400);
      return () => clearTimeout(timeout);
    } else if (!filteredEmployees) {
      setFilteredEmployees(workers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers, setTriggerUseEffect, setTrigUseEffect, setAttendanceTrigger, setDivisionUseEffectTrigger]);
  
  useEffect(() => {
    const checkBoxCheck = async () => {
      if (!isFilteredEmployeesReady) {
        return;
      } else {
        const pageArray = filteredEmployees.slice(paginationSlice.first, paginationSlice.second);
        const allChecked = pageArray.every(obj => obj.attendance);
        setInputCheck(allChecked);
      }
    };
    checkBoxCheck();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, pageParam, filteredEmployees, isFilteredEmployeesReady]);
  
  useEffect(() => {
    filteredEmployeesFunction({ level: levelInput, position: positionInput });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelInput, positionInput]);

  useEffect(() => {
    if (searchParam === `table`) {
      navigate(`/employees/${searchParam}/${pageValue}`);
    } else if (attendanceParam === `employees`) {
      navigate(`/attendance/${attendanceParam}/${hereParam}/${pageValue}`);
    } else if (searchParam === `richest`) {
      navigate(`/richest`);
    } else if (divisionParam) {
      navigate(`/divisions/${divisionParam}/employees/${pageValue}`);
    } else if (searchParam !== `table` && searchParam !== `employees` && attendanceParam !== `employees`) {
      navigate(`/workers/${searchParam}/${pageValue}`);
    }
    setInputCheck(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageValue]);

  useEffect(() => {
    if (triggerPaginationUseEffect.state === `ascending`) {
      setPaginationSlice((prevSlice) => ({
        first: Number(prevSlice.first) + recordPerPageState,
        second: Number(prevSlice.second) + recordPerPageState
      }));
    } else if (triggerPaginationUseEffect.state === `descending`) {
      setPaginationSlice((prevSlice) => ({
        first: Number(prevSlice.first) - recordPerPageState,
        second: Number(prevSlice.second) - recordPerPageState
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setFilteredEmployees(filteredMembers);
  };

  const ascendingDescendingSort = (button, key) => {
    const sortedEmployees = [...filteredEmployees];
    sortedEmployees.sort((a, b) => {
      const keyA = a[key].toLowerCase();
      const keyB = b[key].toLowerCase();
      if (button === `up`) {
        if (keyA < keyB) {
          return 1;
        }
        if (keyA > keyB) {
          return -1;
        }
      } else if (button === `down`) {
        if (keyA > keyB) {
          return 1;
        }
        if (keyA < keyB) {
          return -1;
        }
      }
      return 0;
    });
    setEmployees(sortedEmployees);
    setFilteredEmployees(sortedEmployees);
  }

  const middleNameRearrange = (id) => {
    let sortedEmployees = [];
    filteredEmployees.forEach(element => {
      if (element.name.split(' ').length === 3) {
        sortedEmployees.push(element);
      }
    });
    sortedEmployees.sort((a, b) => {
      const nameA = a.name.toLowerCase().split(` `)[a.name.split(' ').length - 2];
      const nameB = b.name.toLowerCase().split(` `)[b.name.split(' ').length - 2];
      if (id === 'down') {
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
      } else if (id === 'up') {
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
      }
      return 0;
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
      } else if (lastNameRearrangeButton === 'Last name ascending') {
        setLastNameRearrangeButton(`Last name descending`);
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
      }
      return 0;
    });
    setEmployees(sortedEmployees);
    setFilteredEmployees(sortedEmployees);
  }

  const handleAttendance = (person) => {
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
      if (searchParam === `table` && attendanceParam !== `employees`) {
        setTriggerUseEffect(prevState => !prevState);
      }
       else if (searchParam !== `table` && attendanceParam !== `employees`) {
        setTrigUseEffect(prevState => !prevState);
      } else if (divisionParam) {
        setDivisionUseEffectTrigger(prevState => !prevState);
      } else if (attendanceParam === `employees`) {
        setAttendanceTrigger(prevState => !prevState);
      }
    } else if (person.attendance === true) {
      handleAttendancePatch(id, false);
      if (searchParam === `table` && attendanceParam !== `employees`) {
        setTriggerUseEffect(prevState => !prevState);
      } else if (searchParam !== `table` && attendanceParam !== `employees`) {
        setTrigUseEffect(prevState => !prevState);
      } else if (divisionParam) {
        setDivisionUseEffectTrigger(prevState => !prevState);
      } else if (attendanceParam === `employees`) {
        setAttendanceTrigger(prevState => !prevState);
      }
    }
  };

  const handleEmployeesReset = () => {
    const elements = document.querySelectorAll('.arrow');
    elements.forEach(button => {
      button.classList.remove('clicked');
    });
    setLevelInput(``);
    setPositionInput(``);
    setFilteredEmployees(workers);
    setPaginationSlice({first: 0, second: Number(recordPerPageState)});
    setPageValue(1);
    navigate(`/employees/table/1`);
    setPlaceholderVisible(true);
  }

  const pageSetter = (event) => {
    if (event.target.innerText === '<=' && pageParam > 1) {
      setPageValue(prevNumber => Number(prevNumber) - 1);
      console.log(pageParam);
      setTriggerPaginationUseEffect(prevValue => ({
        ...prevValue,
        state: 'descending',
        page: Number(pageParam) - 1
      }));
    } else if (event.target.innerText === '=>' && pageCount !== Number(pageParam)) {
      console.log(pageParam);
      setPageValue(prevNumber => Number(prevNumber) + 1);
      setTriggerPaginationUseEffect(prevValue => ({
        ...prevValue,
        state: 'ascending',
        page: Number(pageParam) + 1
      }));
    }
  }

  const handleNameSetter = (value) => {
    setPlaceholderVisible(false);
    setName(value)
  };

  const handleRearrange = (id) => {
    const elements = document.querySelectorAll('.arrow');
    elements.forEach(button => {
      button.classList.remove('clicked');
    });
    const element = document.getElementById(id);
    element.classList.add('clicked');
    const splittedId1 = id.split('-')[0];
    const splittedId2 = id.split('-')[1];
    if ((splittedId1 === 'name' && name === 'First name') || splittedId1 === 'position' || splittedId1 === 'level') {
      ascendingDescendingSort(splittedId2, splittedId1);
    } else if (splittedId1 === 'name' && name === 'Middle name') {
      middleNameRearrange(splittedId2);
    } else if (splittedId1 === 'name' && name === 'Last name') {
      lastNameRearrange(splittedId2);
    }
  }

  const handleCheckBox = () => {
    if (searchParam === `table` && attendanceParam !== `employees`) {
      setTriggerUseEffect(prevState => !prevState);
    } else if (searchParam !== `table` && attendanceParam !== `employees` && !divisionParam) {
      setTrigUseEffect(prevState => !prevState);
    } else if (attendanceParam === `employees`) {
      setAttendanceTrigger(prevState => !prevState);
    } else if (divisionParam) {
      setDivisionUseEffectTrigger(prevState => !prevState);
    }
    filteredEmployees
      .slice(paginationSlice.first, paginationSlice.second)
      .forEach((employee) => {
        if (employee.attendance === false || inputCheck === false) {
          handleAttendancePatch(employee._id, true);
          if (searchParam === `table`) {
            setTriggerUseEffect(prevState => !prevState);
          }
        } else if (inputCheck === true) {
          setInputCheck(false);
          handleAttendancePatch(employee._id, false);
          if (searchParam === `table`) {
            setTriggerUseEffect(prevState => !prevState);
          }
        }
      });
      setFilteredEmployees(filteredEmployees);
  };

  const getBrand = (brandID) => {
    const brand = brands.find(brand => brand._id === brandID);
    return brand.name;
  }

  const getDivision = (divisionID) => {
    const division = divisions.find(division => division._id === divisionID);
    if (division) {
      return division.name;
    } else {
      return `Nothing`;
    }
  }

  const showMore = () => {
    if (pageParam !== 1) {
      setPaginationSlice((prevSlice) => ({
        first: prevSlice.first,
        second: Number(prevSlice.second) + Number(recordPerPageState)
      }));
    } else if (pageParam === 1) {
      setPaginationSlice((prevSlice) => ({
        first: prevSlice.first,
        second: Number(prevSlice.second) + Number(recordPerPageState)
      }));
    }
  }

  const showLess = () => {
    setPaginationSlice((prevSlice) => {
      if (prevSlice.second > recordPerPageState) {
        return {
          ...prevSlice,
          second: prevSlice.second - Number(recordPerPageState)
        };
      } else {
        return prevSlice;
      }
    });
  };

  const recordPerPageFunction = (number) => {
    setRecordPerPageState(Number(number));
    setPaginationSlice((prevSlice) => {
      return {
        ...prevSlice,
        second: Number(number)
      };
    })
    navigate(`/employees/table/1`);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="EmployeeTable">
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked = { inputCheck } onChange = { () => handleCheckBox() } />
            </th>
            <th>
              <div className="header">
                  <div className="input-container">
                    Name<br/>
                    <select placeholder="Please select!" 
                      onChange = { (event) => handleNameSetter(event.target.value) }
                      >Filter by:
                        {placeholderVisible? (
                          <option>Please select !</option>
                          ) : void 0}
                        <option>First name</option>
                        <option>Middle name</option>
                        <option>Last name</option>
                    </select>
                  </div> 
                  <div className="arrow-container">
                    <div className="up-container">
                      <button className="arrow up" id="name-up" onClick ={(event) => handleRearrange(event.target.id)}></button>
                    </div>
                    <div className="down-container">
                      <button className="arrow down" id="name-down" onClick ={(event) => handleRearrange(event.target.id) }></button>
                    </div>
                  </div>
                </div>
              </th>
            <th>
              Favourite Brand
            </th>
            <th>
              Salary / year
            </th>
            <th>
              Equipment
            </th>
            <th>
              Division
            </th>
            <th>
              <div className="header">
                <div className="input-container">
                  Level
                  <input onChange={(event) => { setLevelInput(event.target.value) }} />
                </div> 
                <div className="arrow-container">
                  <div className="up-container">
                    <button className="arrow up" id="level-up" onClick ={(event) => handleRearrange(event.target.id)}></button>
                  </div>
                  <div className="down-container">
                    <button className="arrow down" id="level-down" onClick ={(event) => handleRearrange(event.target.id)}></button>
                  </div>
                </div>
              </div>
            </th>
            <th>
            <div className="header">
                <div className="input-container">
                  Position
                  <input onChange={(event) => { setPositionInput(event.target.value) }} />
                </div> 
                <div className="arrow-container">
                  <div className="up-container">
                    <button className="arrow up" id="position-up" onClick ={(event) => handleRearrange(event.target.id)}></button>
                  </div>
                  <div className="down-container">
                    <button className="arrow down" id="position-down" onClick ={(event) => handleRearrange(event.target.id)}></button>
                  </div>
                </div>
              </div>
            </th>
            <th>
              Started in
            </th>
            <th>
              <button onClick={() => handleEmployeesReset()}>Reset filtered list / Home</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees && filteredEmployees.slice(paginationSlice.first, paginationSlice.second).map((employee) => (
            <tr key={employee._id}>
              <td><input type="checkbox" checked={employee.attendance} onChange={() => handleAttendance(employee)} /></td>
              <td style={{color: employee.favouriteColor}}>{employee.name}</td>
              <td style={{color: employee.favouriteColor}}>{getBrand(employee.favouriteBrand)}</td>
              <td style={{color: employee.favouriteColor}}>{employee.currentSalary +` $`}</td>
              <td style={{color: employee.favouriteColor}}>{employee.equipment}</td>
              <td style={{color: employee.favouriteColor}}>{getDivision(employee.division)}</td>
              <td style={{color: employee.favouriteColor}}>{employee.level}</td>
              <td style={{color: employee.favouriteColor}}>{employee.position}</td>
              <td style={{color: employee.favouriteColor}}>{employee.startingDate.split(`T`)[0]}</td>
              <td>
                <Link to={`/update/${employee._id}`}>
                  <button type="button">Update</button>
                </Link>
                <Link to={`/delete/${employee._id}`}>
                  <button type="button">Delete</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {Number(pageParam) === 1? (
        <div className="records">
          <div className="record-text">Records / page:</div>
          <select className="records-select" value = { recordPerPageState } style={{float: `right`}} onChange = { (event) => recordPerPageFunction(event.target.value) }>
            {recordPerPage.map(number => {
              return <option key = { number }>{ Number(number) }</option>
              })
            }
          </select>
        </div>
      ) : (
        void 0)}
      {Number(pageParam) !== pageCount && searchParam !== `richest`? (
        <button className="show-more" onClick = { showMore }>...show more</button>
      ) : (
        void 0
      )}
      {(paginationSlice.second - paginationSlice.first) > recordPerPageState? (
        <button className="show-more" onClick = { showLess }>...show less</button>
      ) : (
        void 0
      )}
      {filteredEmployees.length > recordPerPage[0]? (
        <div>
          <button onClick = {(event) => pageSetter(event)}>{`<=`}</button><button onClick = {(event) => pageSetter(event)}>{`=>`}</button>
        </div>
      ) : (
        void 0
      )}
    </div>
  );
};

export default EmployeeTable;
