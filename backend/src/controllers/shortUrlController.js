import { ShortURL } from "../models/shorturl.model.js";
import {nanoid} from "nanoid";


export const createShortURL = async (req, res) => {
    try {
        let {originalUrl, title, expiresAt: expiryDate, customUrl} = req.body;
        const userId = req.user.id;
        let newNanoId = nanoid(7);

        while(true) {
            const existing = await ShortURL.findOne({ shortCode: newNanoId });
            if(!existing) break;
            newNanoId = nanoid(7);
        }

        if(customUrl) {
            const existing = await ShortURL.findOne({ shortCode: customUrl});
            if(!existing) {
                newNanoId = customUrl;
            }
        }


        const newSortCode = await ShortURL.create({
            originalUrl,
            title,
            shortCode: newNanoId,
            expiresAt: expiryDate && String(expiryDate).length > 0 ? new Date(expiryDate) : null,
            userId,
            isActive: true
        });

        console.log("Created ShortURL:", newSortCode); // Add this line

        res.status(200).json({
            message: "Short URL created successfully",
            data: newSortCode
        });

    } catch (error) {
        console.error("Error creating short URL:", error.message);
        return res.status(500).json({
            message: "error from create short URL",
            error: "Internal Server Error"
        });
    }
}


export const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const doc = await ShortURL.findOne({ shortCode });
        if (!doc) {
            return res.status(404).json({ message: "Short URL not exists" });
        }

        const originalUrl = doc.originalUrl;

        // Redirect to the original URL
        return res.redirect(originalUrl);
        
    } catch (error) {
        console.error("Error redirecting to original URL:", error.message);
        return res.status(500).json({
            message: "error from redirecting to original URL",
            error: "Internal Server Error"
        });
    }
}

export const updateShortURLController = async (req, res) => {
    try {
        const { shortURL } = req.params;
        const updateData = req.body;

        const existed = await ShortURL.findOne({ shortCode: shortURL });
        if (!existed) {
            return res.status(404).json({ 
                status: "Not Found",
                message: "Short URL not exists" });
        }

        const updatedRecord = await ShortURL.findOneAndUpdate(
            { shortCode: shortURL },
            { ...updateData },
            { new: true }
        );
        res.status(200).json({
            message: "Short URL updated successfully",
            data: updatedRecord
        });

    } catch (error) {
        console.error("Error updating short URL:", error.message);
        res.status(500).json({
            message: "error from updating short URL",
            error: "Internal Server Error"
        });
    }
}

export const deleteShortURLController = async (req, res) => {
    try {
        const { shortURL } = req.params;
        const existed = await ShortURL.findOne({ shortCode: shortURL });
        if (!existed) {
            return res.status(404).json({ 
                status: "Not Found",
                message: "Short URL not exists" });
        }

        // soft delete
        existed.isActive = false;
        await existed.save();

        //hard delete
        // await ShortURL.findOneAndDelete({ shortCode: shortURL });

        res.status(200).json({
            message: "Short URL deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting short URL:", error.message);
        res.status(500).json({
            message: "error from deleting short URL",
            error: "Internal Server Error"
        });
    }
}