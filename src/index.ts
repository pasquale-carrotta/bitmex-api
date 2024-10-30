/**
 * BitMEX API Integration
 * ---------------------
 * 1. Imports required dependencies
 * 2. Loads environment variables
 * 3. Initializes BitMEX service
 * 4. Demonstrates basic API interactions
 */

import dotenv from "dotenv";
import { BitMEXService } from "./services/bitmex.service";

// Load environment variables from .env file
dotenv.config();

async function main() {
  // Initialize BitMEX service with credentials from .env
  const bitmex = new BitMEXService();

  try {
    // Example API calls
    // 1. Fetch current positions
    const positions = await bitmex.getPositions();
    console.log("Positions:", positions);

    // 2. Get instrument details for XBTUSD
    const instruments = await bitmex.getInstruments({ symbol: "XBTUSD" });
    console.log("Instruments:", instruments);
  } catch (error) {
    // Error handling for API calls
    console.error("Error:", error);
  }
}

// Execute the main function
main();
