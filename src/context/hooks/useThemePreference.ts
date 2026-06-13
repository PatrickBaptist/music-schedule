import { useContext } from "react";
import { ThemeContext } from "../themeContext";

const useThemePreference = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemePreference must be used within ThemePreferenceProvider"
    );
  }

  return context;
};

export default useThemePreference;
