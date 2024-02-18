import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import contactMMail from "../utils/contactMail.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const contactmeMail = asyncHandler(async (req, res) => {
    const { name,message } = req.body;
    try {
        console.log("hello world");
        await contactMMail.contactMMail(name,message);
        return res.status(201).json(
            new ApiResponse(200, "mail send sucessfully")
        );
    }
    catch (err) {
       
        throw new ApiError(500, 'Failed to send contact email');
    }
})
export { contactmeMail };