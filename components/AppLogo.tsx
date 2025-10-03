import React from "react";
import { LogoIcon } from "@/constants/Icons";

interface AppLogoProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

export default function AppLogo({
  size = 100,
  primaryColor = "#A27B5C",
  secondaryColor = "#8C5C38",
}: AppLogoProps) {
  return (
    <LogoIcon
      color={primaryColor}
      width={size}
      height={size}
      secondColor={secondaryColor}
    />
  );
}
