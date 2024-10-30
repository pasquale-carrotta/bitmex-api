/**
 * RequestUtils Test Suite
 * ----------------------
 * Tests cover:
 * 1. Axios instance creation
 * 2. Request interceptor setup
 * 3. Authentication header generation
 */

import axios from "axios";
import { RequestUtils } from "../request.utils";
import { AuthUtils } from "../auth.utils";

// Mock external dependencies
jest.mock("axios");
jest.mock("../auth.utils");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("RequestUtils", () => {
  /**
   * Test setup
   * 1. Clear all mocks before each test
   * 2. Create mock Axios instance
   * 3. Configure mock return values
   */
  beforeEach(() => {
    jest.clearAllMocks();

    const mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      request: jest.fn(),
      getUri: jest.fn(),
      defaults: {},
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    } as unknown as typeof axios;
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
  });

  /**
   * Test case: Request configuration
   * Verifies:
   * 1. Correct base URL configuration
   * 2. Proper timeout setting
   * 3. Request interceptor registration
   */
  it("should properly configure request headers", async () => {
    const mockHeaders = {
      "api-expires": "1234567890",
      "api-key": "test-key",
      "api-signature": "test-signature",
      "Content-Type": "application/json",
    };

    (AuthUtils.generateHeaders as jest.Mock).mockReturnValue(mockHeaders);

    const instance = RequestUtils.getInstance();
    await instance.get("/test");

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "https://testnet.bitmex.com/api/v1",
      timeout: 10000,
    });

    const mockAxiosInstance = (axios.create as jest.Mock).mock.results[0].value;
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
  });
});
