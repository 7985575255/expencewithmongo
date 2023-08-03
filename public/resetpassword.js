
async function resetPassword(event){
   event.preventDefault();
   try{
    const email=document.getElementById('email').value;
    
    const  response=await axios.post('http://localhost:3000/password/forgot-password',{email});
    console.log(response.data);
    if(response.status==200){
      alert("Email is sent succesfully check your email box");
    }else{
      alert("Error email is not sent");
    }

   }catch(err){
    console.log(err, "post email is not working")
   }
}