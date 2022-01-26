module.exports = async (req, res) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      res.status(401).json("invalid token");
    } else {
      res.clearCookie("RefreshToken");
      res.status(200).json({ message: "successfully signout" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
