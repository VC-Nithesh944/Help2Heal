import jwt from "jsonwebtoken";
//user authentication middleware

//Since its a middleware we are using a callback function called next
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
