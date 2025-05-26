import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { upload } from "../middlewares/multer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// const registerUser = asyncHandler(async (req, res) => {
//   // get user details from frontend
//   const { username, fullName, password, email } = req.body;
//   console.log(username, fullName, password, email);
//   // validate not empty
//   if (
//     [fullName, email, username, password].some((field) => field.trim() === "")
//   ) {
//     throw new ApiError(400, "Name field is required");
//   }
//   // user already exists
//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }],
//   });
//   if (existedUser) {
//     throw new ApiError(409, "User with email or username already exists.");
//   }

//   // file upload
//   const avatarLocalPath = req.files?.avatar[0].path;
//   const coverImage = req.files?.coverImage[0];

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar file is required.");
//   }

//   // upload to cloudinary
//   const avatar = await uploadOnCloudinary(avatarLocalPath);

//   if (!avatar) {
//     throw new ApiError(400, "Avatar file is required.");
//   }

//   const user = await User.create({
//     avatar: avatar.url,
//     coverImage: coverImage?.url || "",
//     fullName,
//     username: username.toLowerCase(),
//     email,
//     password,
//   });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while registering the user.");
//   }

//   return res
//     .status(201)
//     .json(new ApiResponse(200, createdUser, "User registered Successfully"));
// });

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation not empty
  // check if user already exists -> username or email
  // check for images -> avatar, cover image
  // upload them cloudinary, avatar -> url, cover image -> url
  // create user object
  // create entry in db
  // remove password and refresh token field from response
  // check for user creation success or failure
  // return response
  const { username, email, password, fullName } = req.body;

  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // if(fullName === "" || email === "" || password === "" || username === ""){
  //   throw new ApiError(400, "All fields are required");
  // }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this username or email");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  const avatarLocalPath =
    Array.isArray(req.files?.avatar) && req.files.avatar.length > 0
      ? req.files.avatar[0].path
      : null;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if (
    req.file &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createUser = await User.findById(user._id).select(
    "-password-refreshToken"
  );
  if (!createUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User register Successfully"));
});

export { registerUser };
