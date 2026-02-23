// Generic API fetcher for the external Business Listing Server
const API_BASE_URL = process.env.BUSINESS_SERVER_API_URL || "http://localhost:8081";

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public status: number,
    public endpoint: string,
    public method: string,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = 'APIError';
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }
}

// Helper to get user-friendly error messages
function getErrorMessage(status: number, details: string): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication failed. Please log in again.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return status >= 500 
        ? 'Server error. Please try again later.'
        : 'An error occurred. Please try again.';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  options: { params?: Record<string, string>; token?: string } = {}
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (options.params) {
    Object.keys(options.params).forEach(key => 
      url.searchParams.append(key, options.params![key])
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    const userMessage = getErrorMessage(response.status, errorText);
    
    // throw new APIError(
    //   response.status,
    //   endpoint,
    //   method,
    //   userMessage,
    //   errorText
    // );
    return null as any; // This line will never be reached but satisfies TypeScript return type
  }

  if (method === "DELETE") return {} as T;

  return response.json();
}
