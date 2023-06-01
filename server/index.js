import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { Client, Account, Databases, Query } from 'appwrite';
import { Configuration, OpenAIApi } from "openai";
import  multer from 'multer';
import axios from 'axios';
import fs from 'fs'
import { spawn }  from 'child_process';
import ffmpeg  from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import  stream  from 'stream';
import tmp from 'tmp'
ffmpeg.setFfmpegPath(ffmpegPath.path);
dotenv.config()
const client = new Client();

const account = new Account(client);

const databases = new Databases(client);

client
    .setEndpoint(`${process.env.APPWRITE_ENDPOINT}`) // Your API Endpoint
    .setProject(`${process.env.APPWRITE_PROJECTID}`) // Your project ID
;
const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000
const configuration = new Configuration({
    apiKey:process.env.OPENAI_API
})
const openai = new OpenAIApi(configuration);
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' }); 
//const upload = multer()
app.post("/ai",async(req,res)=>{
const {content,Email} = req.body

const messages = [{
    role:"assistant",
    content:`${content} I would like you to evaluate the paragraph/essay/article/blog I provided and identify any grammatical mistakes or any spelling mistake. Additionally, please provide tips on how I can improve specific parts of the writing. I would also appreciate it if you could point out the strengths or positive aspects of the above piece `
}]
//    content:`${content}  only evaluate the above , the above is my pargraph/essay/article/blog i want you to  find the grammtical mistakes in above if any , tell on what parts i can improve give me tips and also tell me the good part of the above `

try{
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages
      });
    
    

    const promise0  = await databases.listDocuments(`${process.env.APPWRITE_WRITTENDB_DATABASEID}`, `${process.env.APPWRITE_WRITTENDDB_COLLECTIONID}`,[
        Query.equal('Email',Email)
    ])
    // console.log(promise.documents[0].$id)
    if(promise0.total===1)
    {
        let arr = promise0.documents[0].writtenthings
        arr.push(content)
        const promise =  databases.updateDocument(`${process.env.APPWRITE_WRITTENDB_DATABASEID}`,`${process.env.APPWRITE_WRITTENDDB_COLLECTIONID}`, promise0.documents[0].$id,{
            writtenthings : arr
          });
    }
    if(promise0.total===0){
        const arr = [content]
        const promise = databases.createDocument(`${process.env.APPWRITE_WRITTENDB_DATABASEID}`, `${process.env.APPWRITE_WRITTENDDB_COLLECTIONID}`, 'unique()', 
        {
            Email:Email,
            
              writtenthings : arr
            
        });
    }
      res.status(201).json({
        message:completion.data.choices[0].message.content
    });
 
}catch(err){
    res.status(400).json({message:err.message});
}

  
})
app.post("/register",async (req,res)=>{

    const {Email,password,Name} = req.body
    try{
        await account.create("unique()", Email, password,Name);
        const promise = databases.createDocument(`${process.env.APPWRITE_SIGNUPDB_DATABSEID}`, `${process.env.APPWRITE_SIGNUPDB_COLLECTIONID}`, 'unique()', 
            {
                Username:Name,
                Password:password,
                Email:Email,
            });
        res.status(201).json({
            message:"success"
        });
    }catch(err){
        res.status(400).json({message:err.message});
    }
})
app.post("/saveaudio",async(req,res)=>{
    const {Email,url} = req.body
   
    try{
        const promise0  = await databases.listDocuments(`${process.env.APPWRITE_SPEAKINGDB_DATABASEID}`,`${process.env.APPWRITE_SPEAKINGDB_COLLECTIONDB}`,[
            Query.equal('Email',Email)
        ])
        if(promise0.total===1)
        {
            let arr = promise0.documents[0].AudioFIle
            arr.push(url)
            const promise =  databases.updateDocument(`${process.env.APPWRITE_SPEAKINGDB_DATABASEID}`,`${process.env.APPWRITE_SPEAKINGDB_COLLECTIONDB}`, promise0.documents[0].$id,{
                AudioFIle : arr
              });
        }
        if(promise0.total===0){
            const arr = [url]
            const promise = databases.createDocument(`${process.env.APPWRITE_SPEAKINGDB_DATABASEID}`, `${process.env.APPWRITE_SPEAKINGDB_COLLECTIONDB}`, 'unique()', 
            {
                Email:Email,
                AudioFIle : arr
                
            });
        }
        res.status(201).json({
        
        });
        
    }catch(error){
        res.status(400).json({message:err.message});
    }
   
})
app.post("/recodingai",async(req,res)=>{
    const {content} = req.body
    const messages = [{
        role:"assistant",
        content:`${content} I would like you to evaluate the paragraph/essay/article/blog I provided and identify any grammatical mistakes. Additionally, please provide tips on how I can improve specific parts of the writing. I would also appreciate it if you could point out the strengths or positive aspects of the above piece `
    }]
    try{
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages
          });
       
          res.status(201).json({
            message:completion.data.choices[0].message.content
        });
     
    }catch(err){
        res.status(400).json({message:err.message});
    }
})
app.post("/recording",upload.single('audio'),async(req,res)=>{
   
    try {
        if (!req.file) {
          return res.status(400).json({ success: false, error: 'No audio file provided' });
        }
    
        const inputFile = req.file.path; 
        const outputFile = `${inputFile}.mp3`; 
    
        // Convert the audio to MP3 format
        ffmpeg(inputFile)
          .toFormat('mp3')
          .output(outputFile)
          .on('end', async() => {
            console.log('Audio conversion completed');
          
                      const transcript = await openai.createTranscription(
                        fs.createReadStream(outputFile),
                        
                        
                            "whisper-1",
                            "convert the audio in english only"
                              );
                              console.log(transcript.data)

            
            res.status(200).json({ success: true });
          })
          .on('error', (error) => {
            console.error('Error converting audio:', error.message);
            res.status(500).json({ success: false, error: 'Error converting audio' });
          })
          .run();
      } catch (error) {
        console.error('Error handling audio file:', error.message);
        res.status(500).json({ success: false, error: 'Error handling audio file' });
      }
  //https://api.openai.com/v1/audio/transacription

    
  
   
    
})
app.post("/login",async(req,res)=>{
    const {Email,password} = req.body
   
        const promise = await databases.listDocuments(
            `${process.env.APPWRITE_SIGNUPDB_DATABSEID}`,
            `${process.env.APPWRITE_SIGNUPDB_COLLECTIONID}`,
            [
                Query.equal('Email', [Email]),
                
            ],
        );
        if(promise.total===1){
            if(promise.documents[0].Password===password){
                res.status(200).json({
                    message:promise.documents[0]})
            }else{
                res.status(400).json({
                    message:"incorrect password"
                })
            }
        }
        if(promise.total===0)
        {
            res.status(400).json({
                message:"Email dosent exist please signup"
            })
        }
})
app.get("/generatetopic",async(req,res)=>{
    const messages = [{
        role:"assistant",
        content:"Give me an intresting topic on which i can  write an essay/artile/blog  the topic should be an intresting  topic "
    }]
    try{
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages
          });
          res.status(201).json({
            message:completion.data.choices[0].message.content
        });
    
    }catch(err){
        res.status(400).json({message:err.message});
    }

})
app.post("/generatestory",async(req,res)=>{
    const messages = [{
        role:"assistant",
        content:"give me starting two lines i will make a story out of it"
    }]
    try{
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages
          });
          res.status(201).json({
            message:completion.data.choices[0].message.content
        });
    
    }catch(err){
        res.status(400).json({message:err.message});
    }
})
app.post("/uploadstory",async(req,res)=>{
    const {title,story,by} = req.body
   
    try{
        const promise = await databases.createDocument(`${process.env.APPWRITE_STORIESDB_DATABASEID}`,`${process.env.APPWRITE_STORIESDB_COLLECTIONID}`, 'unique()', 
            {
                Title:title,
                Story:story,
                by:by,
            });
            res.status(201).json({
                
            });
        
            
    }catch(err){
        res.status(400).json({message:err.message});
    }

})
app.post("/allaudio",async (req,res)=>{
    const {Email} = req.body
   try{
    const promise = await databases.listDocuments(`${process.env.APPWRITE_SPEAKINGDB_DATABASEID}`,`${process.env.APPWRITE_SPEAKINGDB_COLLECTIONDB}`,  [
        Query.equal('Email', [Email]),
        
    ],)
    if(promise.total > 0){
        res.status(201).json(promise.documents[0].AudioFIle)
    }
   
   }catch(err){
    res.status(400).json({message:err.message});
   }
})
app.post("/allwritings",async(req,res)=>{
    const {Email} = req.body
    try{
        const promise = await databases.listDocuments(`${process.env.APPWRITE_WRITTENDB_DATABASEID}`,`${process.env.APPWRITE_WRITTENDDB_COLLECTIONID}`,[
            Query.equal('Email',[Email])
        ])
        res.status(201).json(promise.documents[0].writtenthings)
    }catch(err){
        console.log(err)
    }
})
app.get("/allstory",(req,res)=>{
    const promise = databases.listDocuments(`${process.env.APPWRITE_STORIESDB_DATABASEID}`, `${process.env.APPWRITE_STORIESDB_COLLECTIONID}`);
    promise.then(function (response) {
        res.status(201).json(response); // Success
    }, function (error) {
        console.log(error);
        res.status(400).json({message:error.message}); // Failure
    });

})
app.listen(PORT,()=>{
    console.log(`port running ${PORT}`)
})


