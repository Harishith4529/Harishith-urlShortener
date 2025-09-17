export const authMiddleWare = (req, res, next) => {
    try {
        console.log("Auth middleware is running...");
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error.message);
        res.status(500).send("Internal Server Error");
    }
}