import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

    //get user details from frontend
    //validation-not empty
    //check if user already exists : username ,email
    //check for images ,check for avtar
    //upload them to cloudinary, aavtar
    //create user object - create entry in db
    //remove password and refresh token field from reponse
    //check for user creation
    //return res

const registerUser = asyncHandler(async (req, res) => {
   
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

//  return res.status(200).json(
//     new ApiResponse(200, "Null","data submitted")
//  )
const createdUser = await User.findById(User._id).select(
    "-password -refreshtoken"
)

if(!createdUser)
{
    throw new ApiError(500, "somthing Went Wrong while register the user")
}

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
)

})

export {
    registerUser
} 