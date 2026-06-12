import { apiClient } from "@/lib/Apiclient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  role: string;
  status?: string;
}

export interface UserCreate {
  username: string;
  name: string;
  email?: string;
  password: string;
  role: string;
  status?: string;
}

export interface UserUpdate {
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface UserApiResponse {
  http_code: number;
  message: string;
  data: User[];
}

export interface UserSingleApiResponse {
  http_code: number;
  message: string;
  data: User;
}

export interface LoginApiResponse {
  http_code: number;
  message: string;
  data: LoginResponse;
}

export interface ResetPasswordApiResponse {
  http_code: number;
  message: string;
  data: null;
}


// ─── POST /auth/token (público) ───────────────────────────────────────────────

export const login = async (
  username: string,
  password: string
): Promise<LoginApiResponse> => {
  try {
    const response = await apiClient.post("/auth/token", { username, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};


// ─── POST /auth/register (público) ───────────────────────────────────────────

export const registerUser = async (
  data: UserCreate
): Promise<UserSingleApiResponse> => {
  try {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};


// ─── GET /auth/users ──────────────────────────────────────────────────────────

export const fetchUsers = async (
  token: string
): Promise<UserApiResponse> => {
  try {
    const response = await apiClient.get("/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


// ─── GET /auth/userDetails ────────────────────────────────────────────────────

export const fetchUserDetails = async (
  token: string,
  user_id?: number,
  username?: string
): Promise<UserSingleApiResponse> => {
  try {
    const params: Record<string, string | number | undefined> = {};
    if (user_id !== undefined) params.user_id = user_id;
    if (username !== undefined) params.username = username;

    const response = await apiClient.get("/auth/userDetails", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};


// ─── PUT /auth/users/{user_id} ────────────────────────────────────────────────

export const updateUser = async (
  token: string,
  user_id: number,
  data: UserUpdate
): Promise<UserSingleApiResponse> => {
  try {
    const response = await apiClient.put(`/auth/users/${user_id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${user_id}:`, error);
    throw error;
  }
};


// ─── DELETE /auth/users/{user_id} ────────────────────────────────────────────

export const deleteUser = async (
  token: string,
  user_id: number
): Promise<UserSingleApiResponse> => {
  try {
    const response = await apiClient.delete(`/auth/users/${user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${user_id}:`, error);
    throw error;
  }
};


// ─── PUT /auth/reset-password ─────────────────────────────────────────────────

export const resetPassword = async (
  token: string,
  username: string,
  new_password: string
): Promise<ResetPasswordApiResponse> => {
  try {
    const response = await apiClient.put(
      "/auth/reset-password",
      { username, new_password },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};