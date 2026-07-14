import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettings = create(
    persist<{
        isLightMode: boolean;
        flipTheme: () => void;

        isCustomCountry: boolean;
        flipCustomCountry: () => void;
    }>(
        (set) => ({
            isLightMode: true,

            flipTheme: () => {
                set((state) => ({
                    isLightMode: !state.isLightMode,
                }));
            },

            isCustomCountry: false,

            flipCustomCountry: () => {
                set((state) => ({
                    isCustomCountry: !state.isCustomCountry,
                }));
            },
        }),
        { name: "settings" },
    ),
);
