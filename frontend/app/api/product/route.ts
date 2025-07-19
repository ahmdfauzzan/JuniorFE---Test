import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import type { ApiResponse, Product, ProductFormData } from '@/types/product';

const EXTERNAL_API_BASE = 'http://localhost:8001';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const product_id = searchParams.get('product_id');
    
    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }
    
    const response = await axios.get<ApiResponse<Product>>(
      `${EXTERNAL_API_BASE}/api/web/v1/product?product_id=${product_id}`
    );
    
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching product:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch product' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProductFormData = await request.json();
    
    const response = await axios.post<ApiResponse<Product>>(
      `${EXTERNAL_API_BASE}/api/web/v1/product`,
      body
    );
    
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating product:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to create product' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: ProductFormData & { product_id: string } = await request.json();
    
    const response = await axios.put<ApiResponse<Product>>(
      `${EXTERNAL_API_BASE}/api/web/v1/product`,
      body
    );
    
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating product:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to update product' }, 
      { status: 500 }
    );
  }
}