import axios from 'axios';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Home() {
    let loc=useLocation();
    console.log(loc);
    let navigate=useNavigate();
    let deleteAccountToServer=async()=>{
      let dataToSend=new FormData();
      dataToSend.append("gmail",loc.state.data.gmail);
      let response=await axios.delete("http://localhost:6565/deleteAccount",dataToSend);
      console.log(response);
      if(response.data.status=="success"){
        alert(response.data.msg);
        navigate("/");
      }else{
        alert(response.data.msg);
      }

    }
  return (
    <div>
      <div>
        <button 
        onClick={()=>{

          navigate("/editprofile",{state:loc.state.data});
        }}
        >EDIT PROFILE</button>
      </div>
      <div>
        <button  onClick={()=>{
          deleteAccountToServer();
        }}>DELETE</button>
      </div>
        <h1>{loc.state.data.firstName} {loc.state.data.lastName}</h1>
        <img className='homeProfilePic'   src={`http://localhost:6565/${loc.state.data.profilepic}`}></img>
    </div>
  )
}

export default Home