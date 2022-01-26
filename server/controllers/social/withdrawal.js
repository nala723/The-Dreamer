const { User } = require("../../models");

module.exports = async (req, res) => {
  const authorization = req.headers["authorization"];
  const email = req.body.email;

  try {
    const accessToken = authorization.split(" ")[1];

    if (!accessToken) {
      res.status(401).json({ message: "invalid user" });
    } else {
      await User.destroy({
        where: {
          email: email,
        },
      });
      res.status(200).json({ message: "success" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
