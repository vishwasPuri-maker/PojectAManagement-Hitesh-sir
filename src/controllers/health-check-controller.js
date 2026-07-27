import { ApiResponse } from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";


/** 
 *  This function was the old way to check we can use that also but if we have to go furthr we can't use try catch in every controller so we have to use
 *  asyncHandler function which is in utils folder and we have to wrap our controller function with that function and then we can use that function in our 
 * controller and we can handle the error in that function and we don't have to write try catch in every controller function.
 * 
 * const healthCheck = (req,res)=>{
    try{
        res.status(200).json(
            new ApiResponse(
                200,
                {message : "Server is up and listening"},
            )
        )
    }catch(error){

    }
}

 * 
*/

const healthCheck = asyncHandler(async (req,res) => {
    res.status(200).json(
        new ApiResponse(
            200,
            {message : "Server is up and Listening"},
        )
    )
})


export {healthCheck}