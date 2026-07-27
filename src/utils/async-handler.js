const asyncHandler= (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((error)=>{
            next(error)
        })
    }
}

export {asyncHandler}   // ye hamne isliye likha ha taaki hame asyncHandler function/,ethod isliye bnaya ha taaki hame controllers me hame jitne 
// bhi async functions ha unko wrap krke error handling kr sake. or taaki hame baar baar try catch na likhna pade. or ab iska code ko kese controller me use 
// krte ha usse hame controllers me ja krna padega. or hame controllers me jaha bhi async function ha waha pe hame asyncHandler function ka use krna padega. or ye hamne isliye likha ha taaki hame