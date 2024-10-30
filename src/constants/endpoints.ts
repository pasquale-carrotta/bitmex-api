/**
 * BitMEX API Endpoints Constants
 * ----------------------------
 * Purpose:
 * 1. Centralize all API endpoint paths
 * 2. Prevent typos in endpoint strings
 * 3. Enable IDE autocompletion
 * 4. Simplify endpoint maintenance
 *
 * Endpoints:
 * 1. POSITION: Manage trading positions
 *    - GET: Fetch current positions
 *    - POST: Update position settings
 *
 * 2. ORDER: Handle trading orders
 *    - GET: List orders
 *    - POST: Create new order
 *    - PUT: Amend order
 *    - DELETE: Cancel order
 *
 * 3. INSTRUMENT: Market instruments
 *    - GET: Fetch instrument details
 *    - GET with params: Filter specific instruments
 *
 * 4. QUOTE: Price quotations
 *    - GET: Real-time price data
 *    - GET with params: Historical quotes
 *
 * 5. TRADE: Trading history
 *    - GET: List recent trades
 *    - GET with params: Filter trade history
 *
 * 6. USER: Account management
 *    - GET: User information
 *    - PUT: Update preferences
 */

export const ENDPOINTS = {
  POSITION: "/position",
  ORDER: "/order",
  INSTRUMENT: "/instrument",
  QUOTE: "/quote",
  TRADE: "/trade",
  USER: "/user",
} as const;
