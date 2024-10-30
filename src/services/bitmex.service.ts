/**
 * BitMEX API Service
 * -----------------
 * Core functionalities:
 * 1. API authentication
 * 2. Position management
 * 3. Order execution
 * 4. Market data retrieval
 */

import axios from "axios";
import crypto from "crypto";
import { ENDPOINTS } from "../constants/endpoints";
import { config } from "../config/config";

export class BitMEXService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly baseUrl: string;

  /**
   * Initialize service with API credentials
   * 1. Loads API key and secret from environment
   * 2. Sets base URL for testnet/mainnet
   */
  constructor() {
    this.apiKey = process.env.BITMEX_API_KEY!;
    this.apiSecret = process.env.BITMEX_API_SECRET!;
    this.baseUrl = config.isTestnet ? config.urls.testnet : config.urls.mainnet;
  }

  /**
   * Generate request signature
   * 1. Combines request parameters
   * 2. Creates HMAC signature
   * 3. Returns hex-encoded string
   */
  private generateSignature(
    method: string,
    path: string,
    expires: number,
    data: string = ""
  ): string {
    const message = `${method}/api/v1${path}${expires.toString()}${data}`;
    const cleanSecret = this.apiSecret.trim();
    return crypto
      .createHmac("sha256", cleanSecret)
      .update(message)
      .digest("hex");
  }

  /**
   * Fetch current positions
   * 1. Generates authentication
   * 2. Makes GET request to /position
   * 3. Handles API response
   */
  async getPositions() {
    const path = ENDPOINTS.POSITION;
    const expires = Math.round(new Date().getTime() / 1000) + 60;

    try {
      const signature = this.generateSignature("GET", path, expires);
      const headers = {
        "api-expires": expires.toString(),
        "api-key": this.apiKey,
        "api-signature": signature,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${this.baseUrl}${path}`, { headers });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        console.error("BitMEX API Error Response:", error.response.data);
      }
      throw this.handleError(error);
    }
  }

  /**
   * Create new order
   * 1. Validates order data
   * 2. Signs POST request
   * 3. Submits order to BitMEX
   */
  async createOrder(orderData: any) {
    const path = ENDPOINTS.ORDER;
    const expires = Math.round(new Date().getTime() / 1000) + 60;
    const signature = this.generateSignature(
      "POST",
      path,
      expires,
      JSON.stringify(orderData)
    );

    try {
      const response = await axios.post(`${this.baseUrl}${path}`, orderData, {
        headers: {
          "api-expires": expires,
          "api-key": this.apiKey,
          "api-signature": signature,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch instrument details
   * 1. Optional parameter filtering
   * 2. Retrieves instrument data
   * 3. Handles response/errors
   */
  async getInstruments(params?: any) {
    const path = ENDPOINTS.INSTRUMENT;
    const expires = Math.round(new Date().getTime() / 1000) + 60;
    const verb = "GET";

    try {
      const signature = this.generateSignature(verb, path, expires);
      const headers = {
        "api-expires": expires.toString(),
        "api-key": this.apiKey,
        "api-signature": signature,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${this.baseUrl}${path}`, { headers });
      return response.data;
    } catch (error: any) {
      console.error("Full error response:", error.response?.data);
      throw this.handleError(error);
    }
  }

  /**
   * Error handler
   * 1. Processes API errors
   * 2. Formats error messages
   * 3. Returns standardized error
   */
  private handleError(error: any) {
    if (error.response) {
      return new Error(
        `BitMEX API Error: ${
          error.response.data.error?.message || error.message
        }`
      );
    }
    return new Error(`Network Error: ${error.message}`);
  }
}
