import { useState } from "react";

export const useAuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  const openModal = (mode: "sign-in" | "sign-up" = "sign-in") => {
    setMode(mode);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const switchMode = () => {
    setMode(mode === "sign-in" ? "sign-up" : "sign-in");
  };

  return {
    isOpen,
    mode,
    openModal,
    closeModal,
    switchMode,
  };
};
