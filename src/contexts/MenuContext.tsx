"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MenuContextType {
    isMenuMbOpen: boolean;
    setIsMenuMbOpen: (isOpen: boolean) => void;
    closeMenu: () => void;
    toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
    const [isMenuMbOpen, setIsMenuMbOpen] = useState(false);

    const closeMenu = () => setIsMenuMbOpen(false);
    const toggleMenu = () => setIsMenuMbOpen((prev) => !prev);

    return (
        <MenuContext.Provider value={{ isMenuMbOpen, setIsMenuMbOpen, closeMenu, toggleMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu must be used within a MenuProvider");
    }
    return context;
};
