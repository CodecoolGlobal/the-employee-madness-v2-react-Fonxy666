import { Link } from 'react-router-dom';
import React, {useState, useEffect} from 'react';

export default function Divisions() {

  const [divisions, setDivisions] = useState(``);
  const [employees, setEmployees] = useState(``);
  const [boss, setBoss] = useState(``);

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
    fetchData("http://127.0.0.1:8080/api/divisions", setDivisions);
    fetchData(`http://127.0.0.1:8080/api/employees/`, setEmployees);
  }, []);

  const getBoss = (brandID) => {
    const boss = employees.find(boss => boss._id === brandID);
    return boss.name;
  }

  return (
    <div className='EmployeeTable'>
      <table>
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Budget
            </th>
            <th>
              Boss
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {divisions? divisions.map(division => (
            <tr key={division.name}>
              <td>{division.name}</td>
              <td>{division.budget}</td>
              <td>{division.boss && employees? getBoss(division.boss) : `None`} </td>
              <td style ={{float: `right`}}>
                <Link to={`/divisions/update/${division._id}`}>
                  <button type="button">Update</button>
                </Link>
                <Link to={`/divisions/delete/${division._id}`}>
                  <button type="button">Delete</button>
                </Link>
              </td>
            </tr>
          )) : void 0}
        </tbody>
      </table>
    </div>
  )
}
