export const getProfileOfUser = (req, res) => {
    try{
        console.log("User profile data requested.");
        return res.status(200).json({ message: "User profile data fetched successfully.", data: { name: "Aryan", email: "aryan@example.com" } });
    } catch (error) {
        console.error("Error getting user profile data:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}