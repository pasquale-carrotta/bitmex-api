/**
 * BitMEX API Configuration
 * -----------------------
 * Purpose:
 * 1. Centralize API configuration
 * 2. Handle environment-based settings
 * 3. Provide default values
 */

const getIsTestnet = (): boolean => {
  const testnetEnv = process.env.BITMEX_TESTNET;
  // Explicit check for "false" string
  if (testnetEnv === "false") return false;
  // Default to true for safety
  return true;
};

export const config = {
  // API Authentication
  credentials: {
    apiKey: process.env.BITMEX_API_KEY || "",
    apiSecret: process.env.BITMEX_API_SECRET || "",
  },

  // API URLs
  urls: {
    mainnet: "https://www.bitmex.com/api/v1",
    testnet: "https://testnet.bitmex.com/api/v1",
  },

  // Request configuration
  request: {
    timeout: 10000,
    retries: 3,
    rateLimit: 30, // requests per minute
  },

  // Environment settings
  isTestnet: getIsTestnet(),
} as const;

//Devo ancora finire di buttare dentro al codice tutte queste proprietà di configurazione.
//Per ora ho solo usato l'urls nel service
