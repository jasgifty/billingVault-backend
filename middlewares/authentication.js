import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);
  if (token == null) {
    return res.status(401).send("access denied");
  } else {
    try {
      const user = jwt.verify(token, process.env.SECRET);
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(400).send("Invalid Credintials");
    }
  }
};

export const generateToken = (email, userType) => {
  const token = jwt.sign(
    {
      email: email,
      userType: userType,
    },
    process.env.SECRET
  );
  return token;
};
