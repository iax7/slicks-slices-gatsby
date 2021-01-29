import { useState } from 'react';

// This is to replace a state for each key/value pair:
//
// const [name, setName] = useState('');
// <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />

export default function useForm(defaults) {
  const [values, setValues] = useState(defaults);

  function updateValue(e) {
    // check if its a number and convert
    let { value } = e.target;
    if (e.target.type === 'number') {
      value = parseInt(value);
    }
    setValues({
      // copy the existing values into it
      ...values,
      // update the new value that changed
      [e.target.name]: value,
    });
  }

  return { values, updateValue };
}
