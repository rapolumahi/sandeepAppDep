import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  let gmailInputRef=useRef();
  let passwordInputRef=useRef();
  let navigate=useNavigate();
  // useEffect(()=>{
  //   validationTokenCredential();
  // },[])
  let validateCredential=async()=>{
    let dataToSend=new FormData();
    dataToSend.append("gmail",gmailInputRef.current.value);
    dataToSend.append("password",passwordInputRef.current.value);
    let response=await axios.post("http://localhost:6565/validateLogin",dataToSend);
    console.log(response);
    if(response.data.status=="success"){
      alert(response.data.msg);
       localStorage.setItem("token",response.data.token)
      navigate("/home",{state:response.data});
    }else{
      alert(response.data.msg);
    }
  }
  // let validationTokenCredential=async()=>{
  //   let dataToSend=new FormData();
  //   dataToSend.append("token",localStorage.getItem("token"));
  //   let response=await axios.post("http://localhost:6565/validateToken",dataToSend);
  //   console.log(response);
  // }

  return (
    <div>
      <form>
        <p>LOGiN PAGE</p>
        <div>
          <label>Email id :</label>
          <input  ref={gmailInputRef}></input>
        </div>
        <div>
          <label>password :</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <button type='button'  
          onClick={()=>{
            validateCredential();
          }}
          
          
          >LOGIN</button>
        </div>
        <div>
          <Link to="signup">SIGNUP</Link>
        </div>
      </form>
      
    </div>
  )
}

export default Login