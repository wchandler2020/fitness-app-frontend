import {create} from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    role: null, // 'client' || 'trainer' || 'admin'
    accessToken: null,
    isAuthLoading: false,

    setAuthLoading: (value) => set({isAuthLoading: value}),
    login: ({ user, role, accessToken }) =>
        set({user, role, accessToken}),
    logout: () => set({user: null, role: null, accessToken: null}),
}))

export default  useAuthStore()