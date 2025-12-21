// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,

            setUser: (user) => set({ user }),
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            
            // ADD THIS
            logout: () => set({ 
                user: null, 
                accessToken: null, 
                refreshToken: null 
            }),

            login: (user, accessToken, refreshToken) => set({
                user,
                accessToken,
                refreshToken,
            }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;