import Contact from "../models/contact.model.js";

export const contactFormHandler = async (req, res) =>{
    const { fullName, email, message} = req.body;
    try {
        if(!fullName || !email || !message){
        }
        const newContact = new Contact({
            fullName,
            email,
            message
        });
        if(newContact){
            await newContact.save();
            return res.status(201).json({
                fullName: newContact.fullName,
                email: newContact.email,
                message: newContact.message,
            });
        }
        else{
            return res.status(400).json({ message: "Failed to create contact" });
        }

    } catch (error) {
        console.log("Error in the contacFormHandler controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}