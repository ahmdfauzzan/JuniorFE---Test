import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import type { ApiResponse, Product } from '@/types/product';

const EXTERNAL_API_BASE = 'http://localhost:8001';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const params = new URLSearchParams({
      page,
      limit,
      offset: offset.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await axios.get<ApiResponse<Product[]>>(
      `${EXTERNAL_API_BASE}/api/web/v1/products?${params.toString()}`
    );
    
    console.log('API Response:', response.data);
    
    const responseData = {
      data: response.data.data || response.data || [],
      total: response.data.total || 0,
      page: parseInt(page),
      limit: parseInt(limit)
    };
    
    return NextResponse.json(responseData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = axios.isAxiosError(error) ? error.response?.data : null;
    
    console.error('Error fetching products:', errorMessage);
    console.error('Error details:', errorResponse);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
}