const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const searchRouter = require("./routers/search");
const signRouter = require("./routers/sign");
const mypageRouter = require("./routers/mypage");
const pictureRouter = require("./routers/picture");
const socialRouter = require("./routers/social");
const port = 80;

global.__basedir = __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  })
);

app.use(cookieParser());

app.use("/search", searchRouter);
app.use("/sign", signRouter);
app.use("/mypage", mypageRouter);
app.use("/picture", pictureRouter);
app.use("/social", socialRouter);

app.get("/", (req, res) => {
  res.status(201).send("hello world");
});

app.listen(port, () => {
  console.log("server running");
});
