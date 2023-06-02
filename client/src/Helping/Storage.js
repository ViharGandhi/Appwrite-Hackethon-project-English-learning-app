import { Client, Storage,ID,InputFile } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(`${process.env.REACT_APP_PROJECTID}`);

const storage = new Storage(client);

const Storefile = async (data)=>{
    const promise = storage.createFile(
        `${process.env.REACT_APP_BUCKETID}`,
        ID.unique(),
        data
    );
   return promise
  
          
}
export const Getfileurl = async(id)=>{
    const result =  await storage.getFileView(`${process.env.REACT_APP_BUCKETID}`,id);
    return result
}
export default Storefile


      