import { ShortURL } from "../models/shorturl.model.js";
import { User } from "../models/user/user.model.js";

export const getProfileOfUser = async (req, res) => {
    try{
        const user = req.user;
        const userId = user.id;

        const dbuser = await User.findOne({ _id: userId });
        console.log("User object: ", user);
        console.log("Printing cookies: ", req.cookies);
        console.log("User profile data requested.");
        return res.status(200).json({ 
            message: "User profile", 
            data: dbuser
        });
    } catch (error) {
        console.error("Error getting user profile data:", error.message);
        return res.status(500).json({ 
            message: "error from user profile",
            error: "Internal Server Error"
        });
    }
}

export const getMyUrls = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const dbuser = await User.findOne({ _id: userId });
        const urls = await ShortURL.find({ userId: userId });
        return res.status(200).json({
            message: "User URLs",
            data: urls
        });
    } catch (error) {
        console.error("Error getting user URLs:", error.message);
        return res.status(500).json({
            message: "error from user URLs",
            error: "Internal Server Error"
        });
    }
}