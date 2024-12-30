import jwt from "jsonwebtoken";

const generateToken = (user) => {
  console.log("Используемый SECRET_KEY:", process.env.SECRET_KEY);

  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined");
  }

  return jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "3h",
  });
};

export default generateToken;
