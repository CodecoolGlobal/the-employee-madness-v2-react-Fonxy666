import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function EquipmentCreator() {

  const [inputObject, setInputObject] = useState({ name: ``, type: ``, amount: ``, equipment: `Nothing` });
  const [submitSuccessful, setSubmitSuccesful] = useState(false);
  const navigate = useNavigate();

  const handleInputs = (prop, value) => {
    setInputObject(prevState => ({
      ...prevState,
      [prop]: value
    }));
  }

  const handleSubmit = async (element) => {
    try {
      element.preventDefault();
      await fetch(`/api/equipments`, {
        method: `POST`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputObject)
      });
    } catch (err) {
      console.log(err);
    }
    handleInputs('name', '');
    handleInputs('type', '');
    handleInputs('amount', '');
    setSubmitSuccesful(true);
    setInputObject({ name: ``, type: ``, amount: `` });
    alert(`New Equipment succesfully added!`);
    setTimeout(() => {
      navigate(`/employees/table/1`);
    }, 500);
  }

  return (
    <div>
      <div className='control'>
        <div></div>
        Name: <input placeholder='name' value = { inputObject.name } onChange={event => handleInputs('name', event.target.value)}></input>
        Type: <input placeholder='type' value = { inputObject.type } onChange={event => handleInputs('type', event.target.value)}></input>
        Amount: <input placeholder='amount' value={ inputObject.amount } onChange={event => handleInputs('amount', event.target.value)}></input>
      </div>
      {submitSuccessful ? <div>Submit successful!</div> : null}
      <button type='submit' onClick={handleSubmit}>Submit</button>
      <Link to={`/employees/table/1`}>
        <button type="button">Cancel</button>
      </Link>
    </div>
  );
}
