import User from "../models/admin.model.js";
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
// GeneretAccessAndRefreshToken
const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(401, "userId not match");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// RegisterUser
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new apiError(401, "users all details required");
  }

  const user = await User.findOne({ $or: [{ email }, { name }] });

  if (user) {
    throw new apiError(401, "user credintial all ready exist");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const createUser = await User.findById(newUser._id).select("-password");

  if (!createUser) {
    throw new apiError(401, "somthing went wrong while creating User");
  }
  return res
    .status(200)
    .json(new apiResponse(200, createUser, "user created successfully"));
});

//LoginUser
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(401, "all fields are required");
  }
  const loggedIn = await User.findOne({ email });

  if (!loggedIn) {
    throw new apiError(401, "user not registered");
  }

  const isPasswordValid = await loggedIn.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "User Password are wrong");
  }

  // generate refresh and access token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    loggedIn._id
  );

  const loggedInUser = await User.findById(loggedIn._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
    sameSite:"None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { accessToken, refreshToken, user: loggedInUser },
        "user successfully logged in."
      )
    );
});
// logout user
const logoutUser = asyncHandler(async(req,res)=>{
    const currUser = await User.findByIdAndUpdate(req.user._id,{
        refreshToken:null
    })

    if (!currUser) {
        throw new apiError(401,"Error while deleting user refresh token")
    }

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    return res
    .status(200)
    .json(new apiResponse(200,currUser,"Logout successfull"))
}) 
// check-Auth
const checkAuth = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, { user: req.user }, "user logged in"));
});


export {
    registerUser,
    loginUser,
    checkAuth,
    logoutUser
}