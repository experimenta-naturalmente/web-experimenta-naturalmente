import { createTheme } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface PaletteColor {
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }

  interface Palette {
    neutrals: {
      baseWhite: string;
      lightGrey: string;
      darkGrey: string;
      baseBlack: string;
    };
}

  interface PaletteOptions {
    neutrals?: {
      baseWhite?: string;
      lightGrey?: string;
      darkGrey?: string;
      baseBlack?: string;
    };
  }

  interface Typography {
    smallButton: React.CSSProperties;
    mediumButton?: React.CSSProperties;
    body3?: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    smallButton: React.CSSProperties;
    mediumButton: React.CSSProperties;
    body3: React.CSSProperties;
  }

  interface TypographyVariants {
    smallButton: React.CSSProperties;
    mediumButton: React.CSSProperties;
    body3: React.CSSProperties;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    navigation: true;
    cta: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true;
    smallButton: true;
    mediumButton: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#B0D182",
      100: "#F9FFF1",
      200: "#DAFFA0",
      300: "#B0D182",
      400: "#8DA86E",
      500: "#637757",
      600: "#4D5B45",
      700: "#3A502C",
    },
    secondary: {
      main: "#78B7AB",
      100: "#D2E8E4",
      200: "#9BD8CD",
      300: "#78B7AB",
      400: "#378072",
      500: "#185348",
    },
    neutrals: {
      baseWhite: "#FFFFFF",
      lightGrey: "#F5F5F5",
      darkGrey: "#6B6363",
      baseBlack: "#474242",
    },
  },
  typography: {
    h1: {
      fontFamily: "'Rasa', serif",
      fontWeight: 700,
      fontSize: "3rem",
    },
    h2: {
      fontFamily: "'Rasa', serif",
      fontWeight: 500,
      fontSize: "2.5rem",
    },
    h3: {
      fontFamily: "'Rasa', serif",
      fontWeight: 400,
      fontSize: "2rem",
    },
    body1: {
      fontFamily: "Roboto, sans-serif",
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    body2: {
      fontFamily: "Roboto, sans-serif",
      fontWeight: 100,
      fontSize: "1.2rem",
    },
    body3: {
      fontFamily: "Roboto, sans-serif",
      fontWeight: 100,
      fontSize: "0.9rem",
    },

    smallButton: {
      fontFamily: "Roboto, sans-serif",
      fontWeight: 500,
      fontSize: "0.9rem",
      textTransform: "none",
    },
    mediumButton: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
      fontSize: "1rem",
      textTransform: "none",
    },
  },
});

export default theme;
