import { apiClient } from "@/lib/Apiclient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  category_id: number;
  category_name?: string;
  category_tipo?: string;
  category_active?: boolean;
  image_path?: string;
  image_filename?: string;
  features?: string;
  specs?: string;
}

export interface ProductCreate {
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock?: number;
  category_id: number;
  features?: string;
  specs?: string;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  stock?: number;
  category_id?: number;
  features?: string;
  specs?: string;
}

export interface StockUpdate {
  id: number;
  name: string;
  previous_stock: number;
  current_stock: number;
  change: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  sku: string;
  stock: number;
  category_name: string;
  alert: "CRÍTICO" | "BAJO";
}

export interface ProductApiResponse {
  http_code: number;
  message: string;
  data: Product[];
}

export interface ProductSingleApiResponse {
  http_code: number;
  message: string;
  data: Product;
}

export interface StockApiResponse {
  http_code: number;
  message: string;
  data: StockUpdate;
}

export interface LowStockApiResponse {
  http_code: number;
  message: string;
  data: LowStockProduct[];
}

export interface ImageApiResponse {
  http_code: number;
  message: string;
  data: {
    id: number;
    name: string;
    image_path: string;
    image_filename: string;
  };
}


// ─── GET /products/products/ (público, sin token) ─────────────────────────────

export const fetchPublicProducts = async (
  category_id?: number,
  skip: number = 0,
  limit: number = 100
): Promise<ProductApiResponse> => {
  try {
    const params: Record<string, string | number | undefined> = { skip, limit };
    if (category_id !== undefined) params.category_id = category_id;

    const response = await apiClient.get("/products/products/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching public products:", error);
    throw error;
  }
};


// ─── GET /products/products/ (con token) ─────────────────────────────────────

export const fetchProducts = async (
  token: string,
  category_id?: number,
  search?: string,
  min_price?: number,
  max_price?: number,
  min_stock?: number,
  low_stock?: boolean,
  skip: number = 0,
  limit: number = 100
): Promise<ProductApiResponse> => {
  try {
    const params: Record<string, string | number | boolean | undefined> = { skip, limit };
    if (category_id !== undefined) params.category_id = category_id;
    if (search !== undefined) params.search = search;
    if (min_price !== undefined) params.min_price = min_price;
    if (max_price !== undefined) params.max_price = max_price;
    if (min_stock !== undefined) params.min_stock = min_stock;
    if (low_stock !== undefined) params.low_stock = low_stock;

    const response = await apiClient.get("/products/products/", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};


// ─── GET /products/products/{id} (público) ────────────────────────────────────

export const fetchProductById = async (
  product_id: number
): Promise<ProductSingleApiResponse> => {
  try {
    const response = await apiClient.get(`/products/products/${product_id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${product_id}:`, error);
    throw error;
  }
};


// ─── POST /products/products/ ────────────────────────────────────────────────

export const createProduct = async (
  token: string,
  data: ProductCreate
): Promise<ProductSingleApiResponse> => {
  try {
    const response = await apiClient.post("/products/products/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};


// ─── POST /products/products/{id}/image ──────────────────────────────────────

export const uploadProductImage = async (
  token: string,
  product_id: number,
  imageFile: File
): Promise<ImageApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await apiClient.post(
      `/products/products/${product_id}/image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error uploading image for product ${product_id}:`, error);
    throw error;
  }
};


// ─── PUT /products/products/{id} ─────────────────────────────────────────────

export const updateProduct = async (
  token: string,
  product_id: number,
  data: ProductUpdate
): Promise<ProductSingleApiResponse> => {
  try {
    const response = await apiClient.put(`/products/products/${product_id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${product_id}:`, error);
    throw error;
  }
};


// ─── DELETE /products/products/{id} ──────────────────────────────────────────

export const deleteProduct = async (
  token: string,
  product_id: number
): Promise<ProductSingleApiResponse> => {
  try {
    const response = await apiClient.delete(`/products/products/${product_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${product_id}:`, error);
    throw error;
  }
};


// ─── DELETE /products/products/{id}/image ────────────────────────────────────

export const deleteProductImage = async (
  token: string,
  product_id: number
): Promise<ProductSingleApiResponse> => {
  try {
    const response = await apiClient.delete(`/products/products/${product_id}/image`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting image for product ${product_id}:`, error);
    throw error;
  }
};


// ─── PATCH /products/products/{id}/stock ─────────────────────────────────────

export const updateProductStock = async (
  token: string,
  product_id: number,
  quantity: number
): Promise<StockApiResponse> => {
  try {
    const response = await apiClient.patch(
      `/products/products/${product_id}/stock`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { quantity },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating stock for product ${product_id}:`, error);
    throw error;
  }
};


// ─── GET /products/products/low-stock/summary ────────────────────────────────

export const fetchLowStockSummary = async (
  token: string
): Promise<LowStockApiResponse> => {
  try {
    const response = await apiClient.get("/products/products/low-stock/summary", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching low stock summary:", error);
    throw error;
  }
};