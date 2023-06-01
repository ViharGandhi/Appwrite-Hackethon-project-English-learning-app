import { Client, Storage,ID,InputFile } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('64665a119b785eed7fc7');

const storage = new Storage(client);

const Storefile = async (data)=>{
    const promise = storage.createFile(
        '646da0f16ff2903a2e38',
        ID.unique(),
        data
    );
   return promise
  
          
}
export const Getfileurl = async(id)=>{
    const result =  await storage.getFileView('646da0f16ff2903a2e38',id);
    return result
}
export default Storefile


      