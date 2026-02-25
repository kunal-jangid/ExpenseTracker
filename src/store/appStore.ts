import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeType } from '../theme/theme';
import { ParsedTransaction } from '../services/parser';

export interface LocalTransaction extends ParsedTransaction {
    id: string;
    synced: boolean;
}

interface AppState {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    budgetLimit: number;
    setBudgetLimit: (limit: number) => void;
    transactions: LocalTransaction[];
    addTransaction: (transaction: ParsedTransaction) => void;
    markAsSynced: (id: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'sandyLight',
            setTheme: (theme) => set({ theme }),
            budgetLimit: 50000, // Example default
            setBudgetLimit: (budgetLimit) => set({ budgetLimit }),
            transactions: [],
            addTransaction: (t) => set((state) => ({
                transactions: [{ ...t, id: Date.now().toString(), synced: false }, ...state.transactions],
            })),
            markAsSynced: (id) => set((state) => ({
                transactions: state.transactions.map((t) =>
                    t.id === id ? { ...t, synced: true } : t
                )
            }))
        }),
        {
            name: 'expense-tracker-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
