import Feedback from "../models/feedback.model.js";

export const feedbackFormHandler = async (req, res) =>{
    const {fullName, email, feedback} = req.body;
    try {
        if(!fullName || !email || !feedback){
            return res.status(400).json({ message: "Please fill all the required fields"});
        }
        const newFeedback = new Feedback({
            fullName,
            email,
            feedback
        });
        if(newFeedback){
            await newFeedback.save();
            return res.status(201).json({
                fullName: newFeedback.fullName,
                email: newFeedback.email,
                feedback: newFeedback.feedback,
            });
        }
        else{
            return res.status(400).json({message: "Failed to create feedback"});
        }
    } catch (error) {
        console.log("Error in the feedbackFormHandler controller", error.message);
        res.status(500).json({message: "Internal server error" });
    }
}