import {React,useContext,useEffect,useState} from 'react'
import creatstorycss from './CreateSotry.module.css'
import axios from 'axios'
import Usercontext from '../Helping/Context'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function CreateStory() {
    const [content,setcontent] = useState('')
    const [showCard,setshowcontet] = useState(false)
    const [Generatedidea,setgeneratedidea] = useState("")
    const [evaluatedText,setevaluatedtext] = useState(false)
    const [airesponse,setairesponse] = useState('')
    const [Loader,setLoader] = useState(false)
    const [loader1,setLoader1] = useState(false)
    const [Title,setTitle] =  useState('')
    const [Name,setName] = useState('')
    const[loader,setloader] = useState(false)
    const user = useContext(Usercontext)
    const HandleUploadClcik =async(e)=>{
      e.preventDefault()
      
      try{
        setloader(true)
        const response = await axios.post(`${process.env.REACT_APP_URL}/uploadstory`,{
          title:Title,
          story:content,
          by:Name
        })
        setLoader(false)
        toast.success('Successfully uploaded the story', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: false
        });
      }catch(error){
        setLoader(false)
         
        toast.error(
          "something went wrong", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: false,
        });
        console.log(error)
      }

    }

    const Generatestoryline = async()=>{
        try{
            setLoader1(true)
            const response = await axios.post(`${process.env.REACT_APP_URL}/generatestory`)
            setLoader1(false)
            setshowcontet(true)
            setgeneratedidea(response.data.message)

        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
      const isloggedin = localStorage.getItem('isloggedin')
      if(isloggedin){
        const name = localStorage.getItem('user')
       
        setName(name)
       
      }else{
        
        setName(user.Namen)
      }
    })
  return (
    <div className={creatstorycss.container}>
  <div className={creatstorycss.header}>
    <h1>
      Welcome to the Story part{" "}
      <span className={creatstorycss.greenText}>Upskill</span> your creativity
    </h1>
  </div>
  <div className={creatstorycss["topic-generator"]}>
    <div className={creatstorycss["topic-card"]}>
      <h2>Generate a Topic</h2>
      <button onClick={Generatestoryline} >Generate</button>
    </div>
  { loader1 && <svg viewBox="25 25 50 50">
  <circle r="20" cy="50" cx="50"></circle>
</svg>}
  </div>
  {showCard && (
    <div className={creatstorycss.card}>
      <p>{Generatedidea}</p>
    </div>
  )}
 
 <div className={creatstorycss.content}>
    <div className={creatstorycss["input-container"]}>
      <input
        type="text"
        value = {Title}
        onChange={(e)=>setTitle(e.target.value)}
        placeholder="Enter the title of your story"
      />
      </div>
    </div>
  <div className={creatstorycss.content}>
    <textarea
      value={content}
      onChange={(e) => setcontent(e.target.value)}
      placeholder="Start your Story from here"
    ></textarea>
    <button onClick={HandleUploadClcik} className={creatstorycss.evaluateButton}>
      Post
    </button>
    {evaluatedText && (
      <div className={creatstorycss.evaluatedText}>
        <h3>Evaluated result:</h3>
        <p>{airesponse}</p>
      </div>
    )}
    
  </div>
  {Loader && <svg viewBox="25 25 50 50">
  <circle r="20" cy="50" cx="50"></circle>
</svg>}

     
</div>
  )
}

export default CreateStory