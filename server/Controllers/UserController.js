import UserModel from "../Models/userModel.js";

import bcrypt from "bcrypt";

// get a user
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherDetail } = user._doc;

      res.status(200).json(otherDetail);
    } else {
      res.status(404).json("No such user exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//update a user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.boby.password = await bcrypt.hash(password, salt);
      }

      const user = await UserMode.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    req.status(403).json("Access Denied! you can only uptade your own profile");
  }
};

//Delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    req
      .status(403)
      .json("Access Denied! you can only delete uptade your own profile");
  }
};

// Follow a  user
export const followUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = UserModel.findById(id);
      const followingUser = UserModel.findById(currentUserId);

      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOn({ $push: { followers: currentUserId } });
        await followingUser.updateOn({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("User is Alreadyu followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// UnFollow a  user
export const UnFollowUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = UserModel.findById(id);
      const followingUser = UserModel.findById(currentUserId);

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOn({ $pull: { followers: currentUserId } });
        await followingUser.updateOn({ $pull: { following: id } });
        res.status(200).json("User Unfollowed!");
      } else {
        res.status(403).json("User is not Alreadyu followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
