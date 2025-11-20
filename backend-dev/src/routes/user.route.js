// src/routes/user.routes.js
import { Router } from "express";
import { registerUser,logOutUser,loginUser ,refreshAccessToken, changeCurrentPassword} from "../controllers/user.controller.js"; // Ensure correct path and export
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCurrentUser, } from "../controllers/user.controller.js";
import pkg from 'jsonwebtoken';
const { verify } = pkg;
const router = Router();
console.log("problem");
router.route("/register").post(registerUser); 
// when someone goes to register route this method is executed 

router.route("/login").post(loginUser);
//secured routes
router.route("/logout").post(verifyJWT,logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeCurrentPassword
);
router.route("/current-user").get(verifyJWT,getCurrentUser);

export default router;
