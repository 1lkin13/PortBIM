import { heroui } from "@heroui/react";

export default heroui({
  defaultTheme: "light",
  themes: {
    light: {
      layout: {
        radius: {
          small: "0.5rem",
          medium: "0.75rem",
          large: "1rem",
        },
      },
      colors: {
        background: "#FAFAFA", // Light gray background
        foreground: "#111827", // Dark gray text (Gray 900)
        
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1", // Our Brand Primary
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
        },
        
        content1: "#FFFFFF", // Paper/Card background
        content2: "#F3F4F6", // Gray 100
        content3: "#E5E7EB", // Gray 200
        content4: "#D1D5DB", // Gray 300
        
        divider: "#E5E7EB", // Borders
        focus: "#6366F1", 

        success: {
            DEFAULT: "#10B981",
            foreground: "#ffffff",
        },
        warning: {
            DEFAULT: "#F59E0B",
            foreground: "#ffffff",
        },
        danger: {
            DEFAULT: "#EF4444",
            foreground: "#ffffff",
        },
      },
    },
  },
});
