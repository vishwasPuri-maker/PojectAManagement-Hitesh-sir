import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    password : {
        type : String,
        required : [true, "Password is required and to be atleast 8 characters long"],
        trim : true,
        unique: true,
        index : true
    },
    isEmailVerified : {
       type : Boolean,
       default : false
    },
    refereshToken : {
        type : String,
    },
    forgotPasswordToken : {
        type : String,
    },
    forgotPasswordExpiry : {
        type : Date,
    },
    emailVerificationToken : {
        type : String,

    },
    emailVerificationTokenExpiry : {
        type : Date,
    },
}
,{
    timestamps : true
})

userSchema.pre("save",async function(next){ // pre means pre hook database me store hone se pehle kya kya hoga 
    if(!this.isModified("password")) return next()  // ye hamne isliye lagaya ha taaki agr model / schema me kuch bhi change ho to password dobara encrypt na ho ye tab hi ho jab hi hoga tab sabse pehli baar user register kr rha ha or jab password involve ho ye tab hi run hoga 
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAcessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username
        },
        process.env.ACESS_TOKEN_SECERET,
        {
            expiresIn : process.env.ACESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefershToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFERESH_TOKEN_SECERET,
        {
            expiresIn : process.env.REFERESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex")
    
    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex")

    const tokenExpiry = Date.now() + (20*60*1000)   // 20 minutes 

    return {
        unHashedToken,
        hashedToken,
        tokenExpiry
    }
}

export const User = mongoose.model("User", userSchema)