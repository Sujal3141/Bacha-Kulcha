import React from "react";
import logoImg from "../../assets/logo.png";

interface BachaKulchaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BachaKulchaLogo({ className = "", size = "md" }: BachaKulchaLogoProps) {
  // Size mapping based strictly on height to maintain aspect ratio dynamically
  // 'md' maps to h-14 (56px) which is ~80% of a standard 70px navbar
  const heightClass = {
    sm: "h-10",
    md: "h-14",
    lg: "h-20",
  }[size];

  return (
    <img 
      src={logoImg} 
      alt="Bacha Kulcha Logo" 
      className={`${heightClass} w-auto object-contain select-none ${className}`}
      style={{ border: "none", outline: "none", padding: 0, margin: 0 }}
    />
  );
}
