import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useFormStore = create((set) => ({
    isSubmittingContact: false,
    isSubmittingFeedback: false,
    isSubmittingUserData: false,

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
    submitUserDataForm: async (latitude, longitude, area, district) => {
    set({ isSubmittingUserData: true });
    try {
      const response = await axiosInstance.post("/processing", {
        latitude,
        longitude,
        area,
        district,
      });
      toast.success("User data form submitted successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to submit user data form");
      console.error("Error submitting user data form:", error);
      throw error; // Re-throw so calling component can handle it
    } finally {
      set({ isSubmittingUserData: false });
    }
  },
}))