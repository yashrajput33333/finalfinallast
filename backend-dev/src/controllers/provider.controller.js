import { User } from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Goal from "../models/goal.model.js";

export const getAllPatients = async (req, res, next) => {
  try {
    // Fetch all patients (users with patient role)
    const patients = await User.find({ role: "patient" })
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    // Merge with their profile (if exists)
    const patientsWithProfiles = await Promise.all(
      patients.map(async (patient) => {
        const profile = await Profile.findOne({ userId: patient._id });

        // Build full name
        const fullName =
          profile?.firstName || profile?.lastName
            ? `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim()
            : patient.username || patient.email;

        return {
          _id: patient._id,
          email: patient.email,
          username: patient.username,
          role: patient.role,

          // Full name for dashboard
          fullName,

          // Raw profile (optional)
          profile: profile || null,

          // Directly expose these for convenience
          firstName: profile?.firstName || null,
          lastName: profile?.lastName || null,
          phone: profile?.phone || null,
          dateOfBirth: profile?.dateOfBirth || null,
          medicalHistory: profile?.medicalHistory || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        patients: patientsWithProfiles,
        count: patientsWithProfiles.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getPatientById = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const patient = await User.findOne({ 
      _id: patientId, 
      role: 'patient' 
    }).select('-password -refreshToken');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    const profile = await Profile.findOne({ userId: patientId });

    res.status(200).json({
      success: true,
      data: { 
        patient: {
          ...patient.toJSON(),
          profile
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientGoals = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Verify patient exists
    const patient = await User.findOne({ 
      _id: patientId, 
      role: 'patient' 
    });

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    const goals = await Goal.find({ userId: patientId })
      .sort({ date: -1 })
      .limit(30); // Last 30 days

    res.status(200).json({
      success: true,
      data: { 
        goals,
        count: goals.length
      }
    });
  } catch (error) {
    next(error);
  }
};
