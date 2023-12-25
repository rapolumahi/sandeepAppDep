import React, {  useRef,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
    let firstNameInputRef = useRef();
  let lastNameInputRef = useRef();
  let genderLabelRef = useRef();
  let gmailInputRef = useRef();
  let passwordInputRef = useRef();
  let profilepicInputRef = useRef();
  let[gender,setGender]=useState();
  let navigate=useNavigate();
  let[profilePic,setprofilePic]=useState("./images/dummy.jpg");
  let sendDataToServer=async()=>{
    let dataToSend=new FormData();
    dataToSend.append("fn",firstNameInputRef.current.value);
    dataToSend.append("ln",lastNameInputRef.current.value);
    dataToSend.append("gender",gender);
    dataToSend.append("gmail",gmailInputRef.current.value);
    dataToSend.append("password",passwordInputRef.current.value);
    for(let i=0;i<profilepicInputRef.current.files.length;i++){
        dataToSend.append("profilepic",profilepicInputRef.current.files[i])
    }
    let response=await axios.post("http://localhost:6565/Signup",dataToSend);
    console.log(response);
   
    if(response.data.status==0){
      alert(response.data.msg);
        navigate("/");

    }else{
      alert(response.data.msg);
    }
  }

  return (
    <div>
         <form>
        <p>Signup page</p>

        <div>
          <label>FirstName :</label>
          <input ref={firstNameInputRef}></input>
        </div>
        <div>
          <label>LastName :</label>
          <input ref={lastNameInputRef}></input>
        </div>
        <div>
          <label ref={genderLabelRef}>Gender :</label>
          <input type="radio" id="male" name="radio"
          onChange={(e)=>{
            console.log(e.target.checked);
            setGender("Male")

          }}
          ></input>
          <label htmlFor="male" className="innerLabel">
            Male
          </label>
          <input type="radio" id="female" name="radio"
          onChange={(e)=>{
            console.log(e.target.checked);
            setGender("Female")
          }}
          ></input>
          <label htmlFor="female" className="innerLabel">
            Female
          </label>
        </div>
        <div>
          <label>Gmail :</label>
          <input ref={gmailInputRef}></input>
        </div>
        <div>
          <label>Password :</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <label>Profilepic :</label>
          <input type="file" ref={profilepicInputRef}
          onChange={()=>{
            let createdUrl=URL.createObjectURL(profilepicInputRef.current.files[0]);
            setprofilePic(createdUrl);
          }}
          ></input>
        </div>
        <img className="dummy"  src={profilePic}></img>
        <div>
          <button  type="button"    onClick={()=>{
          sendDataToServer();
        //   navigate("/");
          }}>signup</button>
        </div>
      </form>
    </div>
  )
}

export default Signup