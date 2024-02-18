import { Router } from "express";
import {contactmeMail}  from "../controllers/contact.controllers.js";

const router = Router()

router.route("/contact").post(contactmeMail)
   


export default router;