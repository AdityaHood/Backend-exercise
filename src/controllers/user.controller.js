import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //Decide steps for registering the user

  //get user details from frontend
  //validation - if not empty
  //check if user already exits - by email,password
  //check for images, check for avatr
  //upload them  to cloudinary,check if avatar successfully uploaded or not as it was required field
  //create user object -create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return res

  const { fullName, email, username, password } = req.body;
  console.log("email", email);
  //this is just for checking purpose if we are gettng the data properly,we can check this for every field

  //Validation
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are Required!");
  }

  //check if user already exits - by email,password
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  //we get the user data from User to check if already exists,
  //to check for multiple values' $or'operator is used,it simply takes the array of values

  if (existedUser) {
    throw new ApiError();
  }

  //check for images, check for avatr
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // **const coverImageLocalPath = req.files?.coverImage[0]?.path;

  //[we are checking for avatar image strictly but not for coverImage,it not compulsory to upload coverImage
  //But this syntax gives error as if not given coverImage empty string might give some errors

  //this .files method can be accessed because we used multer as middleware
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!");
  }

  //upload them  to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //check if avatar successfully uploaded or not as it was required field
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required!");
  }

  // //create user object -create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //check if user is created successfully or not
  //remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //in the select field it selects everything and we have to write what we dont need in "" with a ' - '
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //return response
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
