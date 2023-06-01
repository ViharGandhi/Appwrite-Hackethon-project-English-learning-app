import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from './Previousaudios.module.css'
function Previousaudios() {
    const [audios,setaudios]  = useState([])
    
  useEffect(()=>{
    const fetchdata= async()=>{
        const Email = localStorage.getItem('email')
        const response = await axios.post(`${process.env.REACT_APP_URL}/allaudio`,{
            Email:Email
        })
       
          setaudios(response.data)
        
        
    }
    fetchdata()
    //allaudio
  },[audios])
  return (
    <div className={styles.audioList}>
    <h1 className={styles.heading}>Your Previous Audios</h1>
    <div className={styles.audioContainer}>
      {audios.map((audio, index) => (
        <div key={index} className={styles.audioItem}>
          <audio controls>
            <source src={audio} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  </div>
  )
}

export default Previousaudios