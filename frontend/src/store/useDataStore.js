import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useDataStore = create((set) => ({
    userData: null,
    isLoadingData: false,

    fetchUserData: async () => {
        set({ isLoadingData: true});
        try {
            const response = await axiosInstance.get("/data");
            if(response.data.success){
                set({
                    userData: response.data.data,
                })
                return response.data.data;
            } else{
                console.log("Failed to fetch user data", response.data.message);
                toast.error('Failed to fetch user data');
                set({ isLoadingData: false });
            }
        } catch (error) {
            console.error("Error fetching user data", error);
            toast.error('Error fetching user data');
            set({ isLoadingData: false });
        }
    }
}))