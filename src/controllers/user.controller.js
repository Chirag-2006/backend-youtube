import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinery.fileupload.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  
  // get user details from frontend
  const { username, Email, password, fullName } = req.body;
  console.log("email: ", Email);
  
  // validate user details - not empty, email is valid, password is valid
  if (
    [username, Email, password, fullName].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
    // check if email is valid
    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(Email)) {
      throw new ApiError(400, "Email is not valid");
    }
    
    // check if user exists: email, username
    const existUser = User.findOne({
      $or: [{ Email }, { username }],
    });
    if (existUser) {
      throw new ApiError(409, "User with Username and Email already exists");
    }
    
    // cheak for image and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }
  });
  
  // upload image and avatar to cloudinary and get url
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  
  // create user object - create enteries in db 
  const user =  await User.create({
    username: username.toLowerCase(), 
    Email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  
  // remove password and refresh token fileds from response -> select("-password -refreshToken")
  const createdUser = await user.findById(user._id).select("-password -refreshToken");
  
  // cheak for user creation
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user");
  }
  
  // send response
  return res.status(201).json(new ApiResponse(200, createdUser, "User created successfully"));
  
  export { registerUser };
  