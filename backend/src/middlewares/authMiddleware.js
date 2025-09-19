import jwt from 'jsonwebtoken';
export const authMiddleWare = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const token = cookies.jwt;

        if(!token){
            return res.status(403).json({
                message: "Token is invalid."
            });
        }
        try{
        const decode = await jwt.decode(token);
        req.user = decode;
        console.log("Decoded data from token: ", decode);
        }
        catch(error){
            console.error("Error decoding token", error.message);
            return res.status(403).json({
                message: "Token is invalid."
            });
        }
        next();
    } 
    catch (error) {
        console.error("Invalid token", error.message);
        res.status(500).send("Internal Server Error");
    }
}