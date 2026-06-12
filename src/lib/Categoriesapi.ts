import { apiClient } from "@/lib/Apiclient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  description?: string;
  tipo: string;
  active: boolean;
  products_count?: number;
}

export interface CategoryProduct {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface CategoryDetail extends Category {
  products: CategoryProduct[];
}

export interface CategoryCreate {
  name: string;
  description?: string;
  tipo: string;
  active?: boolean;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  tipo?: string;
  active?: boolean;
}

export interface CategoryApiResponse {
  http_code: number;
  message: string;
  data: Category[];
}

export interface CategorySingleApiResponse {
  http_code: number;
  message: string;
  data: Category | CategoryDetail;
}


// ─── GET /categories/categories/ ─────────────────────────────────────────────

export const fetchCategories = async (
  token: string,
  tipo?: string,
  active?: boolean,
  skip: number = 0,
  limit: number = 100
): Promise<CategoryApiResponse> => {
  try {
    const params: Record<string, string | number | boolean | undefined> = { skip, limit };
    if (tipo !== undefined) params.tipo = tipo;
    if (active !== undefined) params.active = active;

    const response = await apiClient.get("/categories/categories/", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


// ─── GET /categories/categories/{id} ─────────────────────────────────────────

export const fetchCategoryById = async (
  token: string,
  category_id: number
): Promise<CategorySingleApiResponse> => {
  try {
    const response = await apiClient.get(`/categories/categories/${category_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${category_id}:`, error);
    throw error;
  }
};


// ─── POST /categories/categories/ ────────────────────────────────────────────

export const createCategory = async (
  token: string,
  data: CategoryCreate
): Promise<CategorySingleApiResponse> => {
  try {
    const response = await apiClient.post("/categories/categories/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};


// ─── PUT /categories/categories/{id} ─────────────────────────────────────────

export const updateCategory = async (
  token: string,
  category_id: number,
  data: CategoryUpdate
): Promise<CategorySingleApiResponse> => {
  try {
    const response = await apiClient.put(`/categories/categories/${category_id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${category_id}:`, error);
    throw error;
  }
};


// ─── DELETE /categories/categories/{id} ──────────────────────────────────────

export const deleteCategory = async (
  token: string,
  category_id: number
): Promise<CategorySingleApiResponse> => {
  try {
    const response = await apiClient.delete(`/categories/categories/${category_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${category_id}:`, error);
    throw error;
  }
};


// ─── PATCH /categories/categories/{id}/toggle-status ─────────────────────────

export const toggleCategoryStatus = async (
  token: string,
  category_id: number
): Promise<CategorySingleApiResponse> => {
  try {
    const response = await apiClient.patch(
      `/categories/categories/${category_id}/toggle-status`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error toggling category status ${category_id}:`, error);
    throw error;
  }
};