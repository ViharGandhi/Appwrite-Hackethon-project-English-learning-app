import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './Story.module.css'

function Previouswriting() {
    const [writings,setwritings] = useState([])
    useEffect(()=>{
        const Email  = localStorage.getItem('email')
        const fetchdata = async()=>{
            const response = await axios.post(`${process.env.REACT_APP_URL }/allwritings`,{
                Email:Email
            })
            setwritings(response.data)
        }
        
        fetchdata()
        
    },[writings])
  return (
    <div>
        <h1>Previous writings are</h1>
        {writings.map((articles, index) => (
        <div key={index} className={styles.card}>
       
        <p className={styles.summary}>{articles}</p>
       
      </div>
      ))}
    </div>
  )
}

export default Previouswriting