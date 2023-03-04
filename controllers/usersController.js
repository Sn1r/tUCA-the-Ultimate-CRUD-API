const User = require("../models/User");
const { users } = require("./authController");

require("dotenv").config();

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const allUsers = users.map((user) => {
      return {
        id: user._id,
        username: user.username,
        name: user.name,
      };
    });
    res.status(200).send(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Get user by Id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username id name");
    if (!user) {
      res.status(404).send({ success: false, msg: "User not found" });
    }
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Get self user
const getUserInfo = async (req, res) => {
  try {
    const me = req.user.id;
    const user = await User.findById(me).select("username id name");
    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserInfo,
};
