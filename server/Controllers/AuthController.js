import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

//Resgistering a new User
export const registerUser = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = new userModel({
    username,
    password: hashedPass,
    firstname,
    lastname,
  });

  try {
    await newUser.sav();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login user

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password.user.password);

      validity
        ? res.status(200).json(user)
        : res.status(400).json("wrong password");
    } else {
      res.status(404).json("user does not exists");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
