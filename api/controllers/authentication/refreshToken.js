const RefreshToken = require("../../../database/entities/RefreshToken");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || "";
    const checkJwt = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (checkJwt) {
      const user = await RefreshToken.findOne({ user: checkJwt.id }).populate(
        "user"
      );
      if (!user) {
        return res.status(401).json({ message: "Unauthorized User" });
      }
      const token = jwt.sign(
        {
          id: user?.user?._id,
          nghi: +new Date(),
        },
        "Truong top 1 server",
        {
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        }
      );
      const refresh = jwt.sign(
        {
          id: user?.user?._id,
          iat: new Date().getTime(),
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_TIME,
        }
      );
      res.cookie("refreshToken", refresh, {
        secure: false,
        httpOnly: true,
        expires: new Date(new Date().setDate(new Date().getDate() + 30)),
      });
      await RefreshToken.deleteMany({ user: user?.user?._id });
      await RefreshToken.create({
        refreshToken: refresh,
        user: user?.user?._id,
      });
      return res.status(200).json({ token: token });
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
