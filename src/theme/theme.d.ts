import '@mui/material/styles';

declare module '@mui/material/styles' {
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

  interface PaletteColor {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
  }

  interface SimplePaletteColorOptions {
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    neutrals: {
      baseWhite: string;
      lightGrey: string;
      darkGrey: string;
      baseBlack: string;
    };
  }
}