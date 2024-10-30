/**
 * Authentication Utilities for BitMEX API
 * -------------------------------------
 * Main functions:
 * 1. Generate HMAC signatures for API requests
 * 2. Create authentication headers
 * 3. Handle request expiration timestamps
 */

import crypto from "crypto";

export class AuthUtils {
  /**
   * Creates a signature for API request authentication
   *
   * How it works:
   * 1. Takes request details as input
   * 2. Combines them into a single string
   * 3. Creates HMAC SHA256 hash using API secret
   * 4. Returns hexadecimal signature
   */
  static generateSignature(
    apiSecret: string,
    verb: string,
    path: string,
    expires: number,
    data: string = ""
  ): string {
    const signature = crypto.createHmac("sha256", apiSecret);
    return signature.update(verb + path + expires + data).digest("hex");
  }

  /**
   * Prepares all required BitMEX authentication headers
   *
   * Process:
   * 1. Calculates request expiration (current time + 60 seconds)
   * 2. Generates request signature
   * 3. Returns object with all necessary headers
   *
   * Headers:
   * - api-expires: Expiration timestamp
   * - api-key: API key for identification
   * - api-signature: Request signature
   * - Content-Type: Always application/json
   */
  static generateHeaders(
    apiKey: string,
    apiSecret: string,
    verb: string,
    path: string,
    data: string = ""
  ) {
    const expires = Math.round(new Date().getTime() / 1000) + 60;
    const signature = this.generateSignature(
      apiSecret,
      verb,
      path,
      expires,
      data
    );

    return {
      "api-expires": expires.toString(),
      "api-key": apiKey,
      "api-signature": signature,
      "Content-Type": "application/json",
    };
  }
}
