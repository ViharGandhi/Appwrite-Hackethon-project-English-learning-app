import axios from 'axios';
import {React,useContext,useEffect,useState} from 'react'
import { Link,Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Usercontext from '../Helping/Context';
function Login() {
  const {permission,setpermission} = useContext(Usercontext)
   const{Namen,setNamen} = useContext(Usercontext)
   const {Emailn,setEmailn} = useContext(Usercontext)
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const HandleSubmit = async (e)=>{
    e.preventDefault()
    try{
      const response = await axios.post(`${process.env.REACT_APP_URL}/login`,{
        Email:Email,
        password:password
      })
      toast.success('Successfully LoggedIn', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: false
      });
      //setpermission(true)
      setEmailn(response.data.message.Email)
      setNamen(response.data.message.Username)
      localStorage.setItem('user',response.data.message.Username)
      localStorage.setItem('email',response.data.message.Email)
      localStorage.setItem('isloggedin',true)
      setpermission(true)
      navigate("/home")

      //navigate("/home")
      // console.log(response.data.message.Username)
    }catch(error){
      console.log(error)
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: false,
      });
     
    }
  }
  return (
    <div className="container">
      <form className="form">
        <div className="title">
          Welcome,
          <br />
          <span>sign in to continue</span>
        </div>
        
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
        <Link to='/'>SignUp</Link>
      </form>
      
    </div>
  )
}

export default Login