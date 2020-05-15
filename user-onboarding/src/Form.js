import React, {useState, useEffect} from "react";
import * as yup from "yup";
import axios from "axios";

const formSchema = yup.object().shape({
  name: yup.string().required("Name is a required field"),
  email: yup.string().email("Must be a valid email address").required("Must include email address"),
  password: yup.string().required("Password is a required field"),
  terms: yup.boolean().oneOf([true], "Please agree to terms of use")
})

export default function Form() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: false
  })

  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
  const [post, setPost] = useState([]);

  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setIsButtonDisabled(!valid)
    })
  }, [formState])

  const [errorState, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""   
  })

  const validate = e => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({
          ...errorState,
          [e.target.name]: ""
        })
      })
      .catch(err => {
        console.log(err.errors)
        setErrors({
          ...errorState,
          [e.target.name]: err.errors[0]
        })
      })
  }

  const inputChange = e => {
    e.persist();
    validate(e);
    let value = 
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormState({...formState, [e.target.name]: value});
  }

  const formSubmit = e => {
    e.preventDefault()
    console.log('form submitted!')
    axios
      .post("https://reqres.in/api/users", formState)
      .then(response => {
        setPost([...post, response.data])
      }).catch(err => console.log(err))
  }


  return (
    <form onSubmit={formSubmit}>
      <label htmlFor="name">
        Name
        <input 
          type="text" 
          name="name" 
          id="name" 
          value={formState.name} 
          onChange={inputChange} 
        />
        {errorState.name.length > 0 ? (
          <p className="error">{errorState.name}</p>
        ) : null}
      </label>
      <label htmlFor="email">
        Email
        <input 
          type="text"
          name="email"
          id="email"
          value={formState.email}
          onChange={inputChange}
        />
        {errorState.email.length > 0 ? (
          <p className="error">{errorState.email}</p>
        ) : null}
      </label>
      <label htmlFor="password">
        Password
        <input 
          type="password"
          name="password"
          id="password"
          value={formState.password}
          onChange={inputChange}
        />
        {errorState.password.length > 0 ? (
          <p className="error">{errorState.password}</p>
        ) : null}
      </label>
      <label htmlFor="terms" className="terms">
        <input 
          type="checkbox"
          id="terms"
          name="terms"
          checked={formState.terms}
          onChange={inputChange}
        />
        Terms and Conditions
        {errorState.terms.length > 0 ? (
          <p className="error">{errorState.terms}</p>
        ) : null}
      </label>
      <pre>{JSON.stringify(post,null,2)}</pre>
      <button type="submit" disabled={isButtonDisabled}>Submit</button>
      
    </form>
  )
}