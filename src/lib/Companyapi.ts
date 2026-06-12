import { apiClient } from "@/lib/Apiclient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Company {
  id: number;
  nombre: string;
  razon_social?: string;
  ruc?: string;
  lema?: string;
  correo?: string;
  telefono?: string;
  whatsapp?: string;
  direccion?: string;
  ciudad?: string;
  maps_url?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  horario_atencion?: string;
  logo_path?: string;
  favicon_path?: string;
}

export interface CompanyCreate {
  nombre: string;
  razon_social?: string;
  ruc?: string;
  lema?: string;
  correo?: string;
  telefono?: string;
  whatsapp?: string;
  direccion?: string;
  ciudad?: string;
  maps_url?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  horario_atencion?: string;
}

export interface CompanyUpdate {
  nombre?: string;
  razon_social?: string;
  ruc?: string;
  lema?: string;
  correo?: string;
  telefono?: string;
  whatsapp?: string;
  direccion?: string;
  ciudad?: string;
  maps_url?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  horario_atencion?: string;
}

export interface CompanyApiResponse {
  http_code: number;
  message: string;
  data: Company;
}

export interface CompanyImageApiResponse {
  http_code: number;
  message: string;
  data: {
    logo_path?: string;
    favicon_path?: string;
  };
}


// ─── GET /company/company/ (público) ─────────────────────────────────────────

export const fetchCompany = async (): Promise<CompanyApiResponse> => {
  try {
    const response = await apiClient.get("/company/company/");
    return response.data;
  } catch (error) {
    console.error("Error fetching company info:", error);
    throw error;
  }
};


// ─── POST /company/company/ ───────────────────────────────────────────────────

export const createCompany = async (
  token: string,
  data: CompanyCreate
): Promise<CompanyApiResponse> => {
  try {
    const response = await apiClient.post("/company/company/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};


// ─── PUT /company/company/ ────────────────────────────────────────────────────

export const updateCompany = async (
  token: string,
  data: CompanyUpdate
): Promise<CompanyApiResponse> => {
  try {
    const response = await apiClient.put("/company/company/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};


// ─── POST /company/company/logo ───────────────────────────────────────────────

export const uploadCompanyLogo = async (
  token: string,
  imageFile: File
): Promise<CompanyImageApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await apiClient.post("/company/company/logo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading company logo:", error);
    throw error;
  }
};


// ─── POST /company/company/favicon ───────────────────────────────────────────

export const uploadCompanyFavicon = async (
  token: string,
  imageFile: File
): Promise<CompanyImageApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await apiClient.post("/company/company/favicon", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading company favicon:", error);
    throw error;
  }
};