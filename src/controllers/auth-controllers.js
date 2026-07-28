import {User} from "../models/user.model.js"    // This will help us to quesry anything from our Database 

import { ApiResponse } from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { emailverificationGeneratorContent, sendEmail } from "../utils/mail.js";

const generateAcessAndRefereshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const acessToken = user.generateAcessToken()
        const refereshToken = user.generateRefershToken()

        user.refereshToken = refereshToken
        await user.save({validateBeforeSave : false});
        return {acessToken,refereshToken}
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating the error"
        )
    }
}

/**
 * Now How the register the user Flow Looks like it is right below 
 * 
 * 1. First Take some Data - means that got the data from the frontend where user will fill the register form 
 * 2. Validate the data which you got 
 * 3. Check in DB if user already exists or not 
 * 4. SAVED the new user (AT , RT , GT, sendEmail)
 * 5. user verification using Email or what ever process you are using 
 * 6. send response back to the request 
 * 
 * This all six points are necessary for registering the user
 * 
 */

const registerUser = asyncHandler(async (req,res)=>{
    const {email , useranme, password , role} = req.body    // Here we are getting the data from the frontend 

    // Now check the if the user is already exists or not 
    existedUser = await User.findOne({
        $or: [{username} , {email}]             // Hamne yaha ye likha ha ki yaha pe agr hame jo user ne data diya ha agr uss me se hame agr username ya fir email kuch bhi mil jata ha to ham aage proceed nhi karenge kyunki vo database me dikhte ha hame 
    })

    if(existedUser){
        throw new ApiError(409 , "User with email or username already exists" , [])
    }

    const user = await User.create({
        email,
        username,
        password,
        isEmailVerified : false

    })

    const { unHashedToken , hashedToken , tokenExpiry } = user.generateTemporaryToken()
    user.emailVerificationToken = hashedToken
    user.emailVerificationTokenExpiry = tokenExpiry

    await user.save({validateBeforeSave : false})

    await sendEmail({
        email : user?.email,
        subject : "Please verify your email",
        mailgenContent : emailverificationGeneratorContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/vi/users/verify-email/${unHashedToken}`
        )
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refereshToken -emailVerificationToken -emailVerificationTokenExpiry"
    );

    if(!createdUser){
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        )
    }

    res.
        status(200)
        .json(
            new ApiResponse(
                200,
                {user : createduser},
                "User registered Sucessfully and verification email has been sent on your email"
            )
        )

})

export {registerUser}