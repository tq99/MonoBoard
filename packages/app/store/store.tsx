import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface EmailStore {
  email: string
  setEmail: (email: string) => void
}

export const useEmailStore = create<EmailStore>()(
  persist(
    (set, get) => ({
      email: '',
      setEmail: (email) => set({ email }),
    }),
    {
      name: 'email',
      storage: createJSONStorage(() => ({
        setItem: async (name, value) => {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(name, jsonValue)
        },
        getItem: async (name) => {
          const jsonValue = await AsyncStorage.getItem(name)
          return jsonValue !== null ? JSON.parse(jsonValue) : null
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name)
        },
      })),
      partialize: (state) => ({ email: state.email }),
    }
  )
)
