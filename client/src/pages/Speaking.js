import React, { useState, useEffect,useRef, useContext } from 'react';
import vmsg from 'vmsg';
import axios from 'axios';
import Speakingcss from './Speaking.module.css'
import writingcss from './Writing.module.css';
import Storefile from '../Helping/Storage';
import { Getfileurl } from '../Helping/Storage';
import Usercontext from '../Helping/Context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const recorder = new vmsg.Recorder({
  wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm',
});

function Speaking() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const[loader1,setLoader1] = useState(false)
  const [generatedidea,setgeneratedidea] = useState()
  const [showCard,setshowcontet] = useState(false)
  const [evaluatedText,setevaluatedtext] = useState(false)
  const [airesponse,setairesponse] = useState('')
  const [loader,setloader] = useState(false)
  const[audiohelp,setaudiohelp] = useState(false)
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
  },[generatedidea])
  const handleRecord = async () => {
    setIsLoading(true);
    if (isActive) {
      clearInterval(intervalRef.current);
      setSeconds(0);
    } else {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    setIsActive(!isActive);
    if (isRecording) {
      const blob = await recorder.stopRecording();
      setIsLoading(false);
      setIsRecording(false);    
      setRecordings(URL.createObjectURL(blob));
      setaudiohelp(true)
      clearInterval(intervalRef.current);
      setSeconds(0);
      setloader(true)

    const file = new File([blob], 'audio.wav');
      const formData = new FormData();
      try{  
        
      formData.append('model', 'whisper-1');
      formData.append('file',file)
      const newdata  = await Storefile(file)
      
      const url = await Getfileurl(newdata.$id)
        
      await axios.post(`${process.env.REACT_APP_URL}/saveaudio`,{
        Email:Email,
        url:url
      })
      
      const response = await axios.post("https://api.openai.com/v1/audio/translations",formData,{
        headers:
        {
        Authorization: `Bearer ${process.env.REACT_APP_API} ` ,   
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}` 
        }
      })

      
     
      const response2 = await axios.post(`${process.env.REACT_APP_URL}/recodingai`,{
        Email:"omd@gmail.com",
        content:response.data.text
      })
      setloader(false)
      setairesponse(response2.data.message)
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
     
          

    
   
    } else {
      try {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        setIsLoading(false);
        setIsRecording(true);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    }
  };
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
<div className={Speakingcss.container}>
  <h1 className={Speakingcss.title}>
    Welcome to the speaking part. <span className={Speakingcss.highlight}>Upskill</span> your speaking
  </h1>
  <div className={writingcss["topic-generator"]}>
    <div className={writingcss["topic-card"]}>
      <h2>Generate a Topic</h2>
      <button onClick={generateTopic}>Generate</button>
    </div>
  {loader1 && <svg viewBox="25 25 50 50">
  <circle r="20" cy="50" cx="50"></circle>
</svg>}
  </div>
  {showCard && (
    <div className={writingcss.card}>
      <p>{generatedidea}</p>
    </div>
  )}
  <h1 className={Speakingcss.subtitle}>Start recording and start Practicing </h1>
  <div className={Speakingcss.timerContainer}>
  <button className={Speakingcss.recordButton} disabled={isLoading} onClick={handleRecord}>
    {isRecording ? (
      <i className="fas fa-times"></i>
    ) : (
      <i className="fas fa-microphone"></i>
    )}
  </button>
  <h1 className={Speakingcss.timer}>{formatTime(seconds)}</h1>
  </div>
   <audio src={recordings} controls />
  {loader && <svg viewBox="25 25 50 50">
  <circle r="20" cy="50" cx="50"></circle>
</svg>}
  {evaluatedText && (
      <div className={writingcss.evaluatedText}>
        <h3>Evaluated result:</h3>
        <p>{airesponse}</p>
      </div>
    )}
</div>
  
  );
}

export default Speaking;
/*
  // <>
    //   <button disabled={isLoading} onClick={handleRecord}>
    //     {isRecording ? 'Stop' : 'Record'}
    //   </button>
    //   <ul style={{ listStyle: 'none', padding: 0 }}>
    //     {recordings.map((url) => (
    //       <li key={url}>
    //         <audio src={url} controls />
    //       </li>
    //     ))}
    //   </ul>
    // </>*/