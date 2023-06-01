import React, { useContext, useEffect, useState } from "react";
import  "./Signup.css";
import { Link,Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Usercontext from "../Helping/Context";

const SignupForm = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const{Namen,setNamen} = useContext(Usercontext)
  const {Emailn,setEmailn} = useContext(Usercontext)
  const navigate = useNavigate()
  useEffect(()=>{
    const isloggedin = localStorage.getItem('isloggedin')
    if(isloggedin){
      const email = localStorage.getItem('email')
      const username = localStorage.getItem('user')
      setEmailn(email)
      setNamen(username)
      navigate("/home")
    }
  },[])
  const HandleSubmit = async(e) => {
    e.preventDefault();
      try{
        const response = await axios.post(`${process.env.REACT_APP_URL}/register`,{
          Email:Email,
          password:password,
          Name:Name
        })
        toast.success('Successfully registerd', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: false
        });
      navigate("/login")
       
      }catch(error){
        console.log(error)
        toast.error("something went wrong", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: false,
        });
      }
      
      
  
    
  
  };
  return (
    <div className="container">
      <form className="form">
        <div className="title">
          Welcome,
          <br />
          <span>sign up to continue</span>
        </div>
        <input
          placeholder="username"
          value={Name}
          className="input"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button className="button-confirm" onClick={HandleSubmit}>
          Let's go →
        </button>
        <Link to='/login'>Login</Link>
      </form>
      
    </div>
  );
};

export default SignupForm;
