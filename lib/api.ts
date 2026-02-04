import { ApiError, ApiErrorWithDetails } from "@/types/api";

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
  serverSide?: boolean;
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, serverSide = false, ...fetchOptions } = options;

    try {
      const url = this.buildUrl(endpoint, params);

      let headers: HeadersInit = {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      };

      // Para servidor
      if (serverSide && typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();

        if (allCookies.length > 0) {
          const cookieString = allCookies
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; ");

          headers = {
            ...headers,
            Cookie: cookieString,
          };
        }
      }

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const apiError: ApiError = {
          message: data.error || "Error en la petición",
          statusCode: response.status,
        };
        throw new ApiErrorWithDetails(apiError);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiErrorWithDetails) {
        throw error;
      }

      const apiError: ApiError = {
        message: error instanceof Error ? error.message : "Error desconocido",
        statusCode: 500,
      };
      throw new ApiErrorWithDetails(apiError);
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string>,
    options?: { tags?: string[]; serverSide?: boolean; cache?: RequestCache }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      params,
      serverSide: options?.serverSide ?? false,
      next: options?.tags ? { tags: options.tags } : undefined,
      cache: options?.cache ?? "default",
    });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const url = this.buildUrl(endpoint);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const apiError: ApiError = {
          message: data.error || "Error en la petición",
          statusCode: response.status,
        };
        throw new ApiErrorWithDetails(apiError);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiErrorWithDetails) {
        throw error;
      }

      const apiError: ApiError = {
        message: error instanceof Error ? error.message : "Error desconocido",
        statusCode: 500,
      };
      throw new ApiErrorWithDetails(apiError);
    }
  }
}

export const apiClient = new ApiClient();
