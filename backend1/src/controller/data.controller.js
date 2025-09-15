import Data from "../models/data.model.js";

export const getUserData = async(req,res) =>{
    try {
        const userId = req.user.id;
        const userData = await Data.find({ userId: userId });
        res.status(200).json({
            success: true,
            data: userData
    });
    } catch (error) {
        console.log("Error in getUserData controller ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}