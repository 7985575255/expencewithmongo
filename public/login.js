


document.getElementById('loginForm').addEventListener('submit',  async function(event) {
    event.preventDefault();
  
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    let obj={email, password};
    console.log(obj)
    try{

    const response=await axios.post('http://localhost:3000/loginuser',obj);
     console.log(response);
    localStorage.setItem("token" , response.data.token);
    if(response.status==200){
        window.location.href="./dashbord.html";
    }
    }catch(err){
        console.log(err)
    }
  });
  