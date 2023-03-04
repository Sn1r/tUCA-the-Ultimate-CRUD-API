const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/User");

require("dotenv").config();

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string()
      .regex(/^[a-zA-Z0-9]+$/)
      .required(),
    password: Joi.string().min(8).required().messages({
      "string.min:": "Password should be at least {{#limit}} characters",
    }),
    name: Joi.string().allow("").optional(),
  });

  return schema.validate(user);
};

// Register
const register = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    let errorMessage = "Something went wrong";
    if (error.details[0].path.includes("password")) {
      errorMessage = "Password should be at least 8 characters long";
    } else if (error.details[0].path.includes("username")) {
      errorMessage = "Username should not contain special chracters";
    }
    return res.status(400).send({ success: false, msg: errorMessage });
  }

  let user = await User.findOne({ username: req.body.username });
  if (user) {
    return res
      .status(400)
      .send({ success: false, msg: "User is already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const displayName = req.body.name ? req.body.name : undefined;

  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    name: displayName,
  });

  try {
    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username, name: savedUser.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.header("Authorization", token);
    res.send({
      success: true,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        name: displayName,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ success: false, msg: "Something went wrong" });
  }
};

// Login an existing user
const login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res
      .status(400)
      .send({ success: false, msg: "invalid username or password" });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res
      .status(400)
      .send({ success: false, msg: "invalid username or password" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1w",
    }
  );
  res.header("Authorization", token);
  res.send({
    success: true,
    user: { id: user._id, username: user.username },
    token,
  });
};

module.exports = {
  register,
  login,
  User,
};
