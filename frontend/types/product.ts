export interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_description?: string;
  product_image?: string;
  product_category?: string;
  created_timestamp: string;
  updated_timestamp: string;
}

export interface ProductListParams {
  page: number;
  limit: number;
  offset: number;
  search?: string;
}

export interface ProductFormData {
  product_title: string;
  product_price: number;
  product_description?: string;
  product_image?: string;
  product_category?: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  count?: number;
  page?: number;
  limit?: number;
}

export interface ProductsApiResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductApiResponse {
  data: Product;
}

export interface ApiError {
  error: string;
  message?: string;
}