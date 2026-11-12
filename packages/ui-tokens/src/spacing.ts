export const spacing = {
  scale: {
    4: 4,
    8: 8,
    12: 12,
    16: 16,
    24: 24,
    32: 32,
    48: 48,
  },
  layout: {
    screenSidePadding: 16,
    minTapTarget: 48,
    bookButtonHeight: 72,
  },
  radius: {
    buttons: 12,
    cards: 16,
    bottomSheetTop: 24,
    chips: 999,
  },
  elevation: {
    cards: "0 1px 3px rgba(16, 24, 40, 0.1)",
    bottomSheet: "0 -4px 16px rgba(16, 24, 40, 0.12)",
  },
  breakpoints: {
    mobileMax: 639,
    tabletMin: 640,
    tabletMax: 1023,
    desktopMin: 1024,
    contentMaxWidth: 1200,
  },
} as const;

export type Spacing = typeof spacing;
