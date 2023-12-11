const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(res,req,next)).catch((err)=>next(err))
    }
}

export {asyncHandler};

// const asyncHandler() =>{}
// const asyncHandler(fun) => {()=>{}}
// const asyncHandler(fun) => ()=>{}  // higher order function (fun) => ()=>{} function that returns a function 

/*
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        })
    }
}
*/