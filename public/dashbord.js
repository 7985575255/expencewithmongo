

var submit = document.getElementById("submit");
submit.addEventListener("click", (e) => {
  e.preventDefault();
  try {
    var product = document.getElementById("product").value;
    var price = document.getElementById("price").value;
    var option = document.getElementById("option").value;
    var obj = { option, product, price };
    postData(obj);
  } catch (err) {
    console.log(err);
  }
});

//post data in backend
async function postData(obj) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/user/expence/add-data",
      obj,
      { headers: { Authorization: token } }
    );
    showUserDataOnScreen(response.data.newData);
  } catch (error) {
    console.log(error);
  }
}

async function showUserDataOnScreen(user) {
  try {
    let fo = document.getElementById("food");
    document.getElementById("product").value = "";
    document.getElementById("price").value = "";

    if (!user || typeof user !== "object") {
      console.log("Invalid 'user' object or missing properties.");
      return;
    }
console.log(user)
    // Check for the presence of required properties
    if (!user._id || !user.product || !user.price || !user.option) {
      console.error("Invalid 'user' object or missing properties.");
      return;
    }

    let listItem = document.createElement('li');
    listItem.id = user._id ;
    listItem.textContent = `${user.product}-${user.price}-${user.option}`;

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Item';
    deleteButton.addEventListener('click', () => {
      deleteUser(user._id , user.price);
    });

    listItem.appendChild(deleteButton);
    fo.appendChild(listItem);
  } catch (error) {
    console.log("Error in showUserDataOnScreen:", error);
  }
}


//delete userfuncton
async function deleteUser(Id, price) {
  try {
    console.log("Delete function calling");
    const token = localStorage.getItem("token");
    const del = await axios.delete(
      `http://localhost:3000/user/expence/delete/${Id}?price=${price}`,
      {
        headers: { Authorization: token },
      }
    );
    removeUserFromScreen(Id);
  } catch (error) {
    console.log(error);
  }
}

async function removeUserFromScreen(user_id) {
  try {
    let child = document.getElementById(user_id);
    let foo = document.getElementById("food");
      foo.removeChild(child);
    
  } catch (error) {
    console.log("This removeUserFromScreen is not working");
  }
}
// show data when page is refresh
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  axios.get("http://localhost:3000/user/expence/get-data", {
      headers: { Authorization: token },
    })
    .then((response) => {
      //console.log(response.data);
        createPaginationButtons(response.data.length,response.data);
        showPageContent(response.data,1)
      // for(let i=0; i<response.data.length; i++){
      //   showUserDataOnScreen(response.data[i]);
      // }
    })
    .catch((err) => {
      console.log(err);
    });
  let decode = parseJwt(token);
  let ispremimumuser = decode.ispremimumuser;
  if (ispremimumuser) {
    premiumUser();
  }
});
//pagination
let currentPage =1;
let itemsPerPage=5;
const paginationContainer = document.getElementById("pagination");

function showPageContent(data, page) {
  currentPage = page;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const fo = document.getElementById('food');
  fo.innerHTML = "";

  for (let i = startIndex; i < endIndex; i++) {
    if (data[i]) {
      showUserDataOnScreen(data[i]);
    }
  }
}

//Function to create pagination buttons
function createPaginationButtons(totalexp,data) {
  paginationContainer.innerHTML = "";
  let totalPages=Math.ceil(totalexp/itemsPerPage);
  

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.innerText = i;

    // Add event listener to call showPageContent with the respective page number
    button.addEventListener("click", function () {
      showPageContent(data,i);
    });


    paginationContainer.appendChild(button);
  }
}

// Initial setup
createPaginationButtons();
showPageContent(currentPage);

//premium user
function premiumUser() {
  const bodyElement = document.body;
  bodyElement.style.backgroundColor = 'yellow'

  document.getElementById("PremiumButton").style.visibility = "hidden";

 let buttonled=document.getElementById('leaderbord');
  buttonled.addEventListener("click", showLeaderbordData);
  buttonled.style.display = 'block';
  //Download functionalty

   let downloadbutton=document.getElementById('download');
  downloadbutton.addEventListener("click",downloadExpence);
  downloadbutton.style.display = 'block';
}

 
///Download Expence api call
async function downloadExpence(){
  const token = localStorage.getItem("token");
  try{
  let response=await axios.get('http://localhost:3000/downloadexpense', { headers: { Authorization: token } })
      if(response.status==200){
        window.location.href = response.data.fileUrl;
      }else{
        console.log('somthing went wrong');
      }
  }catch(err){
    console.log(err);
  }
}

///Premium Button features

document.getElementById("PremiumButton").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/purchase/premiumfeatures",
  { headers: { Authorization: token} });
  console.log(response)
 
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    name: "Test Company",
    order_id: response.data.order.id, // For one time payment

    theme: {
      color: "#3399cc",
    },
    ///this handler function will work when payment is succesfull
    handler: async function (response) {
      console.log(response);
      try {
        const ans = await axios.post("http://localhost:3000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("Now you are permimue user");
         localStorage.setItem( "token", ans.data.token);
        premiumUser();
      } catch (err) {
        alert("somthing went wrong");
        console.log(err);
      }
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    alert("somthing went wrong and payment failed");
  });
};

//parse jwt token for get data

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
// Show Leaderbord data in your frontoned


async function showLeaderbordData() {
    const token = localStorage.getItem("token");
  try {

    const response = await axios.get("http://localhost:3000/get/leaderbordata", { headers: { Authorization: token }});
    let id=1;
    let parent =document.getElementById('showleaderbord');
    parent.innerHTML="";
    console.log(response.data)
    response.data.forEach(element => {
     
        showLeaderborDataOnScreen(element,id);
        id++;
    })
  } catch (err) {
    console.log(err);
  }
}


async function showLeaderborDataOnScreen(element,id){
   try{
    let parent =document.getElementById('showleaderbord');
    
     let child=document.createElement('li');
   
     child.innerHTML=`${id}. -${element.name} - ${element.totalExpence}`;
    parent.appendChild(child);
   }catch(err){
    console.log(err)
   }
}


//logout function

function clearTokenFromLocalStorage() {
  localStorage.removeItem('token');
}

function logout() {
  clearTokenFromLocalStorage();
  window.location.href="./login.html";
}

const logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener('click', logout);
