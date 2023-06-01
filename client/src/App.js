import {Routes,Route} from 'react-router-dom'

import SignupForm from './pages/Signup';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import Usercontext from './Helping/Context';
import Writing from './pages/Writing';
import Speaking from './pages/Speaking';
import StoryTelling from './pages/StoryTelling';
import CreateStory from './pages/CreateStory';
import Previousaudios from './pages/Previousaudios';
import Previouswriting from './pages/Previouswriting';

function App() {
  const [permission,setpermission] = useState(false)
  const [Namen,setNamen] = useState('')
  const [Emailn,setEmailn] = useState(null)
  useEffect(()=>{
    const islogeduser =  localStorage.getItem('isloggedin')
    if(islogeduser){
      setpermission(true)
    }
    console.log(permission)
  },)
  return (
    <Usercontext.Provider value={{permission,setpermission,Namen,setNamen,Emailn,setEmailn}}>
    <div>
    <Routes>
      <Route path='/' element={<SignupForm/>} />
      <Route path='/login' element={<Login/>}/>
      {permission && <Route path='/home' element={<Home/>}/>}
      {permission && <Route path='/writing' element={<Writing/>}/>}
      {permission && <Route path='/speaking' element={<Speaking/>}/>}
      {permission && <Route path='/storytelling' element={<StoryTelling/>}/>}
      {permission && <Route path='/createstory' element={<CreateStory/>}/>}
      {permission && <Route path='/previousaudios' element={<Previousaudios/>}/>}
      {permission && <Route path='/previouswritings' element={<Previouswriting/>}/>}
    </Routes>
    <ToastContainer/>
    </div>
    </Usercontext.Provider>

  );
}

export default App;
