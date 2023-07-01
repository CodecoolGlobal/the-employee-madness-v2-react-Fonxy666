import { Link } from "react-router-dom";
import React from 'react'

export default function Attendance() {
  return (
    <div>
      <Link to={`/update/here`}>
        <button type="button">Here</button>
      </Link>
      <Link to={`/update/missing`}>
        <button type="button">Missing</button>
      </Link>
    </div>
  )
}
