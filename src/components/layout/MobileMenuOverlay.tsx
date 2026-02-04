"use client";
import { useMenu } from "@/contexts/MenuContext";
import React from "react";

const MobileMenuOverlay = () => {
    const { isMenuMbOpen, closeMenu } = useMenu();

    return (
        <div
            className={`fixed inset-0 bg-black/80 transition-all duration-300 ${isMenuMbOpen ? "opacity-100 z-[40] visible" : "opacity-0 z-[-1] invisible"
                }`}
            onClick={closeMenu}
        />
    );
};

export default MobileMenuOverlay;
