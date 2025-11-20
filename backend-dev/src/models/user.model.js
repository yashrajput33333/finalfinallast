import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase: true,
            trim: true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase: true,
            trim: true,
            
        },
        role:{
            type:String,
            enum:['patient','provider'],
            default:'patient',
        }
        ,
        password:{
             type:String,
             required:[true,'Password is required'],

        },
        refreshToken:{
            type:String,
        }


},{
    timestamps:true
}
)
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
     this.password=await bcrypt.hash(this.password, 10);
     next();
})
userSchema.methods.isPasswordCorrect=async function (password){
        return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=function(){
     console.log("hello access");
     console.log("reached here");
     const token =jwt.sign(
       {
         userId:this._id,
         email:this.email,
         username:this.username,
         role:this.role
        
       },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
          }
       
     )
     console.log("access token generated");
  
     return token;
}
userSchema.methods.generateRefreshToken=function(){
    console.log("hello");
    const token=jwt.sign(
        {
          userId:this._id,
          role:this.role

        },
           process.env.REFRESH_TOKEN_SECRET,
           {
             expiresIn:process.env.REFRESH_TOKEN_EXPIRY
           }
        
      )
      return token;
}
export const User=mongoose.models.User ||  mongoose.model("User",userSchema);

