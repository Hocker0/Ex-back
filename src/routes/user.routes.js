import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

const router = Router()

router.route("/register").post(
    // for image upload from user
    // upload.fields([
    //     {
    //     name: "avatar",
    //     maxCount: 1
    //     },
    //     {
    //         name: "coverImage",
    //         maxCount: 1
    //     }
    // ]),
    registerUser
    )
// router.route("/login").post(loginUser)


export default router;
