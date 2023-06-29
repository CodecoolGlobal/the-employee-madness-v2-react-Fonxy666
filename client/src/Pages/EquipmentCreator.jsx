import React, { useState } from 'react';

export default function EquipmentCreator() {

  const [inputObject, setInputObject] = useState({ name: ``, type: ``, amount: `` });

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
  }

  return (
    <div>
        <nav>
            <li>Name : <input placeholder='name' onChange = { event => handleInputs(`name`, event.target.value) }></input></li>
            <li>Type : <input placeholder='type' onChange = { event => handleInputs(`type`, event.target.value) }></input></li>
            <li>Amount : <input placeholder='amount' onChange = { event => handleInputs(`amount`, event.target.value) }></input></li>
        </nav>
        <button type='submit' onClick = { handleSubmit }>Submit</button>
    </div>
  )
}
