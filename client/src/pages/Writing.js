import React, { useContext, useEffect, useRef, useState } from 'react'
import writingcss from './Writing.module.css'
import axios from 'axios'
import jsPDF from 'jspdf'
import Usercontext from '../Helping/Context'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Writing = () => {
    const [content,setcontent] = useState('')
    const [showCard,setshowcontet] = useState(false)
    const [Generatedidea,setgeneratedidea] = useState("")
    const [evaluatedText,setevaluatedtext] = useState(false)
    const [airesponse,setairesponse] = useState('')
    const [Loader,setLoader] = useState(false)
    const [loader1,setLoader1] = useState(false)
    const [Email,setEmail] = useState("")
    const user = useContext(Usercontext)

   
    const generateTopic = async(e)=>{
      try{
        setLoader1(true)
        const response = await axios.get(`${process.env.REACT_APP_URL}/generatetopic`)
        setLoader1(false)
        setgeneratedidea(response.data.message)
        setshowcontet(true)
      }catch(error){
        toast.error(
          "something went wrong", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: false,
        });
      }
      
    }
    useEffect(()=>{
      const isloggedin = localStorage.getItem('isloggedin')
      if(isloggedin){
        const email = localStorage.getItem('email')
       
        setEmail(email)
       
      }else{
        
        setEmail(user.Emailn)
      }
      
    },[Generatedidea])

    
   
    const Hanldeclick = async(e)=>{
        e.preventDefault();
      
          
        
        try{
          setLoader(true)
            const response = await axios.post(`${process.env.REACT_APP_URL}/ai`,{
                content:content,
                Email:Email
            })
            setLoader(false)
            setairesponse(response.data.message)
            setevaluatedtext(true)
            
        }catch(error){
            
            toast.error(
              "something went wrong", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
              hideProgressBar: true,
              pauseOnHover: false,
            });
        }
    }
    const handleDownload = async(e)=>{
     const doc = new jsPDF('landscape','px','a4','false')
     doc.text(20,50,`Generated topic was: ${Generatedidea}`)
     
     
  
     doc.text(20,70,`Your response: ${content}`,{ maxWidth: 500 })
     doc.addPage()
     doc.text(20,90,`Ai response: ${airesponse}`,{ maxWidth: 500 })
     doc.save("writtenresponse.pdf")
      
    }
    
  return (
<div className={writingcss.container}>
  <div className={writingcss.header}>
    <h1>
      Welcome to the writing part{" "}
      <span className={writingcss.greenText}>Upskill</span> your writing
    </h1>
  </div>
  <div className={writingcss["topic-generator"]}>
    <div className={writingcss["topic-card"]}>
      <h2>Generate a Topic</h2>
      <button onClick={generateTopic}>Generate</button>
    </div>
  { loader1 && <svg viewBox="25 25 50 50">
  <circle r="20" cy="50" cx="50"></circle>
</svg>}
  </div>
  {showCard && (
    <div className={writingcss.card}>
      <p>{Generatedidea}</p>
    </div>
  )}
  <div className={writingcss.content}>
    <textarea
      value={content}
      onChange={(e) => setcontent(e.target.value)}
      placeholder="Write your essay/article/blog here... after your writing you can also add your prompt on what criteria do you want to evaluate (optional)"
    ></textarea>
    <button onClick={Hanldeclick} className={writingcss.evaluateButton}>
      Evaluate
    </button>
    {evaluatedText && (
      <div className={writingcss.evaluatedText}>
        <h3>Evaluated result:</h3>
        <p>{airesponse}</p>
      </div>
    )}
    
  </div>
  {Loader && <svg viewBox="25 25 50 50">
  <circle r="20" cy="50" cx="50"></circle>
</svg>}
<button className={writingcss.downloadButton} onClick={handleDownload}>
        <i className="fas fa-download"></i>
      </button>
     
</div>



  )

}

export default Writing