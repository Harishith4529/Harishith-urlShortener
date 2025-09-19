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
            // Ensure customUrl is treated as string
            const customUrlString = String(customUrl);
            const existing = await ShortURL.findOne({ shortCode: customUrlString});
            if(!existing) {
                newNanoId = customUrlString;
            }
        }


        const newSortCode = await ShortURL.create({
            originalUrl,
            title,
            shortCode: String(newNanoId), // Ensure it's stored as string
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
        
        // Ensure shortCode is treated as string
        const codeToSearch = String(shortCode);

        const doc = await ShortURL.findOne({ shortCode: codeToSearch });
        if (!doc) {
            return res.status(404).json({ message: "Short URL not exists" });
        }

        // Check if URL is active
        if (!doc.isActive) {
            return res.status(404).json({ message: "Short URL is inactive" });
        }

        // Increment click count
        doc.clickCount = (doc.clickCount || 0) + 1;
        await doc.save();

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

        // Ensure shortURL is treated as string
        const codeToSearch = String(shortURL);

        const existed = await ShortURL.findOne({ shortCode: codeToSearch });
        if (!existed) {
            return res.status(404).json({ 
                status: "Not Found",
                message: "Short URL not exists" });
        }

        const updatedRecord = await ShortURL.findOneAndUpdate(
            { shortCode: codeToSearch },
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
        
        // Ensure shortURL is treated as string
        const codeToSearch = String(shortURL);
        
        const existed = await ShortURL.findOne({ shortCode: codeToSearch });
        if (!existed) {
            return res.status(404).json({ 
                status: "Not Found",
                message: "Short URL not exists" });
        }

        if (!existed.isActive) {
            // Hard delete if already inactive
            await ShortURL.deleteOne({ shortCode: codeToSearch });
            return res.status(200).json({
                message: "Short URL permanently deleted"
            });
        }

        // Soft delete (set inactive)
        existed.isActive = false;
        await existed.save();

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