export const colors = {
  primary: {
    50: '#E8F6EE',
    500: '#16A34A',
    600: '#0B7D43',
    700: '#09663A',
  },
  emergency: {
    50: '#FEF3F2',
    600: '#D92D20',
  },
  warning: {
    50: '#FFFAEB',
    600: '#B54708',
  },
  info: {
    600: '#1570EF',
  },
  ink: {
    300: '#D0D5DD',
    600: '#475467',
    900: '#101828',
  },
  surface: {
    0: '#FFFFFF',
    50: '#F9FAFB',
  },
  categories: {
    BLS: '#16A34A',
    ALS: '#D92D20',
    ICU: '#7A5AF8',
    PT: '#1570EF',
    NEO: '#EE46BC',
  },
} as const;

export type Colors = typeof colors;

