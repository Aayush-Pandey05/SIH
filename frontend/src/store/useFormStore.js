import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useFormStore = create((set) => ({
    isSubmittingContact: false,
    isSubmittingFeedback: false,

    submitContactForm: async (formData) => {
        set({ isSubmittingContact: true });
        try {
            const response = await axiosInstance.post("/contact", formData);
            toast.success("Contact form submitted successfully");
            return response.data;
        } catch (error) {
            toast.error("Failed to submit contact form");
            console.error("Error submitting contact form:", error);
        } finally {
            set({ isSubmittingContact: false });
        }
    },

    submitFeedbackForm: async (formData) => {
        set({ isSubmittingFeedback: true });
        try {
            const response = await axiosInstance.post("/feedback", formData);
            toast.success("Feedback form submitted successfully");
            return response.data;
        } catch (error) {
            toast.error("Failed to submit feedback form");
            console.error("Error submitting feedback form:", error);
        } finally {
            set({ isSubmittingFeedback: false });
        }
    },
}))