import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) =>{
    try{
        const user = await User.findOne(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshtoken = refreshToken
       await user.save({validateBeforeSave:false})
       return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500,"somthing went wrong while generating refresh and access tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    // Algorithm for register user
    //get user details from frontend
    //validation-not empty
    //check if user already exists : username ,email
    //check for images ,check for avtar
    //upload them to cloudinary, aavtar
    //create user object - create entry in db
    //remove password and refresh token field from reponse
    //check for user creation
    //return res

    const { username, email, avatar, password, category } = req.body;

    if (
        [username, email, avatar, password, category].some((field) => field?.trim === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        console.log(existedUser);
        throw new ApiError(409, "User with username or email already exist");
    }

    if (existedUser && existedUser.isActive === true) {
        throw new ApiError(409, "User with email or username already exists")
    }
    if (existedUser && existedUser.isActive === false) {
        await User.deleteOne({ username });
    }

    // code for upload avatar image and cover image
    //     const avatarlocalpath = req.files?.avatar[0]?.path;
    //     const coverImageLocalPath = req.files?.coverImage[0]?.coverImage[0]?.path;

    //     if (!avatarlocalpath) {
    //         throw new ApiError(400, "Avatar file is compulsary")
    //     }

    //   const avatar =  await uploadOnCloudinary(avatarlocalpath)
    //   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //   if (!avatarlocalpath) {
    //     throw new ApiError(400, "Avatar file is compulsary")
    // }

    await User.create({
        username,
        email,
        avatar,
        password,
        category
    })

    // what data send back to user in response

    // const createdUser = await User.findById(User._id).select(
    //     "-password"
    // )
    // if(!createdUser)
    // {
    //     throw new ApiError(500, "somthing Went Wrong while register the user")
    // }

    return res.status(201).json(
        new ApiResponse(200, "Null", "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // request data from body
    // decide for login ,what we use username or email
    // after decide find the user from database(if user not forund then show error)
    // then check password(if password not matched then show error)
    // generate access and refresh token
    // then send tokens to cookie
    const { username, email, password } = req.body
    console.log(username,password,email);

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }
    //  console.log("from controllers");
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "invalid user credentials")
    }

  const {accessToken,refreshToken} =  await generateAccessAndRefreshTokens(user._id)
    
    const loggedinUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,{user: loggedinUser ,accessToken ,refreshToken},
            "user logged in sucessfully")
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,{
        $set:{
            refreshToken: undefined
        }
    },
    {
        new: true
    }
   )

   const options = {
    httpOnly: true,
    secure: true
}
return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    // fetch refeshToken from cookies
    const incomingRefershToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefershToken)
    {
        throw new ApiError(401,"Unauthorized request")
    }
    try {
        // docode incomingRefershToken
        const decodedToken = jwt.verify(
            incomingRefershToken,process.env.REFRESH_TOKEN_SECRET
        )
        //find user with help of user_id from decoded token
        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401,"Invalid Refesh token")
        }
        //check incomingRefershToken and user refeshtoken is same or not
        if(incomingRefershToken !== user?.refreshtoken){
            throw new ApiError(401,"Refresh token is expired or used")
        }

        const options={
            httpOnly:true,
            secure:true
        }
       //generate new access and refesh token
        const {accessToken, newRefreshtoken} = await generateAccessAndRefreshTokens(user._id)
       //send response to user
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
        console.log("refesh token generated");
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} 