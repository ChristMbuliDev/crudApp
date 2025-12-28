import User from "../models/user.model.js";

import mongoose from "mongoose";

// GET ALL
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// GET ONE
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// CREATE
export const createUser = async (req, res) => {
  const { name, email } = req.body;
  // Recherche si le nom et l'email existent déjà
  const existingUser = await User.findOne({ $or: [{ name }, { email }] });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const user = await User.create(req.body);
  res.status(201).json(user);
};

// UPDATE
export const updateUser = async (req, res) => {
  const { name, email } = req.body;
  // Vérifier si un autre utilisateur a le même nom ou email
  const existingUser = await User.findOne({
    $and: [
      { _id: { $ne: req.params.id } },
      { $or: [{ name }, { email }] }
    ]
  });
  if (existingUser) {
    return res.status(400).json({ error: "User with this name or email already exists" });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(user);
};

// DELETE
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted successfully" });
};
