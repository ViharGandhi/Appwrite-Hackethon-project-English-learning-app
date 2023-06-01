import React, { useContext, useEffect, useState } from 'react'
import Usercontext from '../Helping/Context'
import Homeonecss from './Homeone.module.css'
import { Navigate, useNavigate } from 'react-router-dom'

const Home = () => {
  const[Name,setName] = useState('')
  const[Email,setEmail] = useState('')
  const  user = useContext(Usercontext)
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(()=>{
    const isloggedin = localStorage.getItem('isloggedin')
    if(isloggedin){
      const email = localStorage.getItem('email')
      const username = localStorage.getItem('user')
      setEmail(email)
      setName(username)
    }else{
      setName(user.Namen)
      setEmail(user.Emailn)
    }
    
  })
  const Handleliclick1 =()=>{
    navigate("/previousaudios")
  }
  const Handleliclick2 = ()=>{
    navigate("/previouswritings")
  }
  const Handleliclick3 = ()=>{
    localStorage.removeItem('email')
    localStorage.removeItem('user')
    localStorage.removeItem('isloggedin')
    navigate("/login")
  } 
  const Handlewritingclick = (e)=>{
    e.preventDefault()
    navigate("/writing")
  }
  const HanldeSpeakingclick = (e)=>{
    e.preventDefault()
    navigate("/speaking")
  }
  const HandleStoryclick = (e)=>{
    navigate("/storytelling")
  }
  return (
    <div className={Homeonecss.container}>
      <div className={Homeonecss.circleProfileIcon}>
      <div className={Homeonecss.iconWrapper} onClick={toggleDropdown}>
        <i className="fas fa-user"></i>
        <i className={`fas fa-angle-down ${Homeonecss.dropdownIcon}`}></i>
      </div>
      {isOpen && (
        <ul className={Homeonecss.dropdownMenu}>
          <li onClick={Handleliclick1}>Previous Audios</li>
          <li onClick={Handleliclick2}>Previous Writings</li>
          <li onClick={Handleliclick3}>Log Out</li>
        </ul>
      )}
    </div>
      
    <div className={Homeonecss.name}>
      <h1>Welcome {Name}</h1>
      <h3 className={Homeonecss.title}>English Made Easy: Learn, Communicate, and Conquer</h3>
    </div>
    <div className={Homeonecss["card-container"]}>
      <div className={Homeonecss.card} onClick={Handlewritingclick}>
        <h2 className={Homeonecss["practice-title"]}>Practice Writing</h2>
        <p className={Homeonecss.subheading}>Improve your writing skills</p>
        <button className={Homeonecss["practice-button"]}>Practice</button>
      </div>
      <div className={Homeonecss.card} onClick={HanldeSpeakingclick}>
        <h2 className={Homeonecss["practice-title"]}>Practice Speaking</h2>
        <p className={Homeonecss.subheading}>Enhance your speaking abilities</p>
        <button className={Homeonecss["practice-button"]}>Practice</button>
      </div>
      <div className={Homeonecss.card} onClick={HandleStoryclick}>
        <h2 className={Homeonecss["practice-title"]}>Explore Creativity</h2>
        <p className={Homeonecss.subheading}>Unleash your Creativity</p>
        <button className={Homeonecss["practice-button"]}>Practice</button>
      </div>
    </div>
  </div>
  )
}

export default Home