import { Link } from "react-router-dom";
import "./EmployeeTable.css";

const EmployeeTable = ({ 
  filteredEmployees, 
  onDelete, 
  setLevelInput, 
  setPositionInput, 
  ascendingDescendingSort,
  firstNameRearrangeButton,
  setFirstNameRearrangeButton,
  middleNameRearrangeButton, 
  middleNameRearrange,
  lastNameRearrangeButton, 
  lastNameRearrange,
  levelRearrangeButton,
  setLevelRearrangeButton,
  positionRearrangeButton,
  setPositionRearrangeButton,
  handleResetFilteredList,
  handleAttendace
}) => (
  <div className="EmployeeTable">
    <table>
      <thead>
        <tr>
          <th>Name 
          <button onClick = { () => ascendingDescendingSort(firstNameRearrangeButton, `First name descending`, `First name ascending`, `name`, setFirstNameRearrangeButton) }>{ firstNameRearrangeButton }</button>
          <button onClick = { () => middleNameRearrange() }>{ middleNameRearrangeButton }</button>
          <button onClick = { () => lastNameRearrange() }>{ lastNameRearrangeButton }</button>
          </th>
          <th>Level <input onChange = { (event) => {setLevelInput(event.target.value)} }/>
          <button onClick = { () => ascendingDescendingSort(levelRearrangeButton, `Level descending`, `Level ascending`, `level`, setLevelRearrangeButton) }>{ levelRearrangeButton }</button></th>
          <th>Position <input onChange = { (event) => {setPositionInput(event.target.value)} }/>
          <button onClick = { () => ascendingDescendingSort(positionRearrangeButton, `Position descending`, `Position ascending`, `position`, setPositionRearrangeButton) }>{ positionRearrangeButton }</button>
          </th>
          <td><button onClick = { () => handleResetFilteredList() }>Reset filtered list</button></td>
        </tr>
      </thead>
      <tbody>
        {filteredEmployees.map((employee) => (
          <tr key={employee._id}>
            <td>{employee.name}</td>
            <td>{employee.level}</td>
            <td>{employee.position}</td>
            <td>
              <input type="checkbox" checked = { employee.attendance } onChange = { () => handleAttendace(employee)}></input>
              <Link to={`/update/${employee._id}`}>
                <button type="button">Update</button>
              </Link>
              <button type="button" onClick={() => onDelete(employee._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EmployeeTable;
