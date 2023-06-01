import React, { useEffect, useState } from 'react'
import styles from './Story.module.css'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
function StoryTelling() {
  const [Titles,setTitles] = useState([])
  const [data,setdata] = useState([])
  const[stories,setstory] = useState([])
    const navigate  = useNavigate()
    const HandleClick = ()=>{
        navigate("/createstory")
    }
  useEffect(()=>{
    const fetchdata = async()=>{
      const response = await axios.get(`${process.env.REACT_APP_URL}/allstory`)
      
      setdata(response.data.documents)
      const alltitles = data.map(item=>item.Title)
      const allstories = data.map(item=>item.Story)
      setTitles(alltitles)
      setstory(allstories)
      console.log(data)
      
    }
    fetchdata();
    
  })
  return (
    <div>
     <nav className={styles.navbar}>
      <ul>
        <li onClick={HandleClick} className={styles.link}>Write Stories</li>
        <li className={`${styles.link} ${styles.selected}`}>Explore Stories</li>
      </ul>
    </nav>
    {data.map((story, index) => (
        <div key={index} className={styles.card}>
        <h1 className={styles.title}>{story.Title}</h1>
        <p className={styles.summary}>{story.Story}</p>
        <p className={styles.author}>By: <span className={styles.authorName}>{story.by}</span></p>
       
      </div>
      ))}
        
    </div>
  )
}

export default StoryTelling