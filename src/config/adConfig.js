/**
 * Centralized Ad Configuration
 * Set enabled to true and update client/slot IDs when Google AdSense account is approved.
 */

export const adConfig = {
  // Set to true once Google AdSense is approved
  enabled: false,

  // Your Google AdSense Publisher ID (e.g., 'ca-pub-1234567890123456')
  publisherId: "ca-pub-XXXXXXXXXXXXXXXX",

  // Ad slot identifiers for different positions
  slots: {
    topBanner: "1234567890",
    bottomBanner: "2345678901",
    sidebarSticky: "3456789012",
    downloadModal: "4567890123",
  },

  // Countdown timer in seconds for download interstitial modal
  downloadCountdownSeconds: 3,

  // Fallback demo banner settings when ads are disabled (shows a neat unobtrusive placeholder)
  showDevPlaceholders: true,
};
