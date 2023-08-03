const AWS=require('aws-sdk');
const { json } = require('body-parser');
require('dotenv').config()




 const uploadToS3= (data,fileName)=>{
console.log(process.env.BUCKET);
  const s3bucket= new AWS.S3({accessKeyId:process.env.IAM_USER_KEY,   secretAccessKey:process.env.IAM_USER_SECREAT_KEY});
 
   let params={
    Bucket:process.env.BUCKET,
    Key:fileName,
    Body:data,
    ACL:'public-read'
   }
    return new Promise((resolve, reject)=>{
       s3bucket.upload(params, (err, s3data)=>{
    if(err){
       reject(err);
    }else{
      resolve(s3data.Location)
    }
  });
    })
  }

  module.exports={uploadToS3}
