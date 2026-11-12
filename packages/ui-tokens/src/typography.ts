export const typography = {
  fonts: {
    english: 'Inter',
    kannada: 'Noto Sans Kannada',
  },
  styles: {
    display: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
    },
    title: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700',
    },
    heading: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    caption: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400',
    },
  },
  largeTextMultiplier: 1.3,
} as const;

export type Typography = typeof typography;

