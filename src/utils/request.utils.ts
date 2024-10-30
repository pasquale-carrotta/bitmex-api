/**
 * Request Utilities for BitMEX API
 * -------------------------------
 * 1. Handles HTTP requests to BitMEX API
 * 2. Manages authentication and request signing
 * 3. Implements request interceptors for headers
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AuthUtils } from "./auth.utils";

// Custom configuration interface extending Axios config
interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  timestamp?: number;
}

export class RequestUtils {
  // Singleton instance of Axios
  private static instance: AxiosInstance;

  /**
   * Get or create Axios instance with BitMEX configuration
   * 1. Creates instance if not exists
   * 2. Sets base URL and timeout
   * 3. Configures interceptors
   */
  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL:
          process.env.BITMEX_BASE_URL || "https://testnet.bitmex.com/api/v1",
        timeout: 10000,
      });
      this.setupInterceptors();
    }
    return this.instance;
  }

  /**
   * Configure request interceptors
   * 1. Adds authentication headers
   * 2. Generates API signature
   * 3. Sets expiration timestamp
   */
  private static setupInterceptors() {
    if (!this.instance) return;

    this.instance.interceptors.request.use(
      (config: CustomAxiosConfig) => {
        const path = config.url || "";
        const method = config.method?.toUpperCase() || "GET";
        const timestamp = Math.floor(Date.now() / 1000) + 60;

        // Generate signature for request authentication
        const signature = AuthUtils.generateSignature(
          process.env.BITMEX_API_SECRET || "",
          method,
          path,
          timestamp,
          config.data ? JSON.stringify(config.data) : ""
        );

        // Set required BitMEX API headers
        config.headers = config.headers || {};
        config.headers["api-key"] = process.env.BITMEX_API_KEY || "";
        config.headers["api-signature"] = signature;
        config.headers["api-expires"] = timestamp.toString();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}
