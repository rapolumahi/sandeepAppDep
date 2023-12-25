const express=require("express");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const cors=require("cors")
const multer=require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${Date.now()}_${file.originalname}`);
    }
  })
  
  const upload = multer({ storage: storage })
let app=express();
app.use(cors());
app.use("/upload",express.static("upload"));
let connetMD=async()=>{
    try{
await mongoose.connect("mongodb+srv://brninfotech2306:sai@cluster0.pifsnv8.mongodb.net/mahi?retryWrites=true&w=majority")
console.log("connect database")

    }catch(err){
        console.log("unable connect")
    }
}
let userSchema=new mongoose.Schema({
    firstName:String,
    lastName:String,
    gender:String,
    gmail:String,
    password:String,
    profilepic:String
});
let User=new mongoose.model("user",userSchema);
app.post("/Signup",upload.single("profilepic"),async(req,res)=>{
    console.log(req.body);
    console.log(req.body.password);
     let hashedPassword=await bcrypt.hash(req.body.password,10);
     console.log(hashedPassword);
    let userDetails=await User.find().and({gmail:req.body.gmail})
    if(userDetails.length>0){
        res.json({status:"failure", msg:"user already exit"});
    }else{
        try{
            let newUser=new User(
                {
                    firstName:req.body.fn,
                    lastName:req.body.ln,
                    gender:req.body.gender,
                    gmail:req.body.gmail,
                    password:hashedPassword,
                    profilepic:req.file.path
                }
            );
            await User.insertMany([newUser]);
            res.json({status:"success",msg:"user created successfully"});
                }catch(err){
                    res.json({status:"failure",msg:"user not created successfully"});
                }

    }
 

});
app.post("/validateLogin",upload.none(),async(req,res)=>{
    console.log(req.body);
    let userDetails=await User.find().and({gmail:req.body.gmail});
    if(userDetails.length==0){
        res.json({status:"failure",msg:"user does not exit"});
    }else{
        let result=await bcrypt.compare(req.body.password,userDetails[0].password);
        console.log(result);
        // if(userDetails[0].password==req.body.password){
            if(result==true){
          let encryptCredential= jwt.sign({gmail:userDetails[0].gmail,password:userDetails[0].password},"Jyothi");
          console.log(encryptCredential);
            res.json({status:"success",
            msg:"valid credential",
             token:encryptCredential,
            data:userDetails[0]
        })
        }else{
            res.json({status:"failure",msg:"Incorrect password"});
        }
    }
})
app.post("/validateToken",upload.none(),async(req,res)=>{
    console.log(req.body.token);
    let decryptCredential=jwt.verify(req.body.token,"Jyothi");
    console.log(decryptCredential);
    let userDetails=await User.find().and({gmail:decryptCredential.gmail})
    try{
        if(userDetails.length>0){
            if(userDetails[0].password==decryptCredential.password){
                res.json({
                    status:"success",
                    msg:"valid token credential",
                    data:userDetails[0]
            })
            }

        }else{
            res.json({
                status:"failure",
                msg:"invalaid token",
            })
        }
    }catch(err){
        res.json({
            status:"failure",
            msg:"invalaid token",
        })
        
    }
});
app.patch("/updateDetails",upload.single("profilepic"),async(req,res)=>{
    try{
        await User.updateMany({gmail:req.body.gmail},
            {
                firstName:req.body.fn,
                lastName:req.body.ln,
                profilepic:req.file.path
            }
            )
            res.json({status:"success",msg:"user successfully updated"});
    }catch(err){
        res.json({status:"failure",msg:"user not updated successfully"});
    }
})
app.delete("/deleteAccount",upload.none(),async(req,res)=>{
    try{
        let deleteUser=await User.deleteMany({gmail:req.body.gmail});
        res.json({status:"success",msg:"user deleted successfully"});

    }catch(err){
        res.json({status:"failure",msg:"user not deleted successfully"});

    }
   
})


app.listen(6565,()=>{
    console.log("listening port");
})
connetMD();