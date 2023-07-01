import React from 'react'

export default function AttendanceHere() {
  return (
    <div>
      <div>
        <input onChange={(event) => setInputValue(event.target.value)} />
        <button onClick={fetchInputData}>Search</button>
      </div>
      {matched? (
        <div>
          <table>
            <tbody>
            {matched.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.level}</td>
                <td>{employee.position}</td>
                <td>
                  <Link to={`/update/${employee._id}`}>
                    <button type="button">Update</button>
                  </Link>
                  <button type="button" onClick={() => handleDelete(employee._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      ) : (
        void 0
      )}
    </div>
  )
}
