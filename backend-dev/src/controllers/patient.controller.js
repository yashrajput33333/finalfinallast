import { User } from "../models/user.model.js";
import Profile from "../models/profile.model.js";
export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId })
      .populate('userId', '-password -refreshToken');

    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, dateOfBirth, phone, address, medicalHistory } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.userId },
      {
        firstName,
        lastName,
        dateOfBirth,
        phone,
        address,
        medicalHistory
      },
      { new: true, runValidators: true }
    ).populate('userId', '-password -refreshToken');

    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};

export const createProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, dateOfBirth, phone, address, medicalHistory } = req.body;

    // Check if profile already exists for this user
    const existingProfile = await Profile.findOne({ userId: req.user.userId });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user"
      });
    }

    // Create a new profile
    const profile = await Profile.create({
      userId: req.user.userId,
      firstName,
      lastName,
      dateOfBirth,
      phone,
      address,
      medicalHistory
    });

    // Populate user data while hiding password & refreshToken
    await profile.populate("userId", "-password -refreshToken");

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: { profile }
    });

  } catch (error) {
    next(error);
  }
};