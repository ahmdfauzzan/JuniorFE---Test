import { v4 as uuidv4 } from 'uuid';
import {DatabaseManager} from "../external/database/database";

interface Product {
    product_id: string;
    product_title: string;
    product_price: number;
    product_description?: string;
    product_image?: string;
    product_category?: string;
    created_timestamp: string;
    updated_timestamp: string;
}

interface CreateProductData {
    product_title: string;
    product_price: number;
    product_description?: string;
    product_image?: string;
    product_category?: string;
}

interface UpdateProductData {
    product_title?: string;
    product_price?: number;
    product_description?: string;
    product_image?: string;
    product_category?: string;
}

export class ProductService {
    private static _ProductService: _ProductService;

    static getService(): _ProductService {
        if (this._ProductService == null) {
            this._ProductService = new _ProductService();
        }
        return this._ProductService;
    }
}

class _ProductService {
    private db = DatabaseManager.getInstance();

    async getProducts(limit: number = 10, offset: number = 0, search?: string): Promise<{ products: Product[], total: number }> {
        try {
            let whereClause = '';
            let params: any[] = [];

            // Build search query if search term provided
            if (search && search.trim()) {
                whereClause = `WHERE 
                    product_title LIKE ? OR 
                    product_description LIKE ? OR 
                    product_category LIKE ?`;
                const searchTerm = `%${search.trim()}%`;
                params = [searchTerm, searchTerm, searchTerm];
            }

            // Get total count with search filter
            const totalStmt = this.db.prepare(`SELECT COUNT(*) as count FROM products ${whereClause}`);
            const totalResult = totalStmt.get(...params) as { count: number };

            // Get products with pagination and search
            const stmt = this.db.prepare(`
                SELECT * FROM products 
                ${whereClause}
                ORDER BY created_timestamp DESC 
                LIMIT ? OFFSET ?
            `);

            const queryParams = [...params, limit, offset];
            const products = stmt.all(...queryParams) as Product[];

            return {
                products,
                total: totalResult.count
            };
        } catch (e) {
            console.error('Error getting products:', e);
            throw new Error('Failed to get products');
        }
    }

    async getProduct(productId: string): Promise<Product | null> {
        try {
            const stmt = this.db.prepare('SELECT * FROM products WHERE product_id = ?');
            const product = stmt.get(productId) as Product;
            return product || null;
        } catch (e) {
            console.error('Error getting product:', e);
            throw new Error('Failed to get product');
        }
    }

    async createProduct(productData: CreateProductData): Promise<Product> {
        try {
            const productId = uuidv4();
            const now = new Date().toISOString();

            const stmt = this.db.prepare(`
                INSERT INTO products (
                    product_id, product_title, product_price, 
                    product_description, product_image, product_category,
                    created_timestamp, updated_timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run(
                productId,
                productData.product_title,
                productData.product_price,
                productData.product_description || null,
                productData.product_image || null,
                productData.product_category || null,
                now,
                now
            );

            // Return the created product
            return await this.getProduct(productId) as Product;
        } catch (e) {
            console.error('Error creating product:', e);
            throw new Error('Failed to create product');
        }
    }

    async updateProduct(productId: string, productData: UpdateProductData): Promise<Product | null> {
        try {
            // Check if product exists
            const existingProduct = await this.getProduct(productId);
            if (!existingProduct) {
                return null;
            }

            // Build dynamic update query
            const updateFields: string[] = [];
            const values: any[] = [];

            Object.entries(productData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateFields.push(`${key} = ?`);
                    values.push(value);
                }
            });

            if (updateFields.length === 0) {
                return existingProduct;
            }

            // Add updated_timestamp
            updateFields.push('updated_timestamp = ?');
            values.push(new Date().toISOString());

            values.push(productId); // Add productId for WHERE clause

            const stmt = this.db.prepare(`
                UPDATE products
                SET ${updateFields.join(', ')}
                WHERE product_id = ?
            `);

            stmt.run(...values);

            // Return updated product
            return await this.getProduct(productId);
        } catch (e) {
            console.error('Error updating product:', e);
            throw new Error('Failed to update product');
        }
    }

    async deleteProduct(productId: string): Promise<boolean> {
        try {
            const stmt = this.db.prepare('DELETE FROM products WHERE product_id = ?');
            const result = stmt.run(productId);
            return result.changes > 0;
        } catch (e) {
            console.error('Error deleting product:', e);
            throw new Error('Failed to delete product');
        }
    }
}

// util/common.ts
export function getPayloadFromEvent(event: any): any {
    let params = {};

    // Handle body
    try {
        if (event.hasOwnProperty("body") && event.body) {
            if (typeof event.body === 'string') {
                params = JSON.parse(event.body);
            } else {
                params = event.body;
            }
        }
    } catch (err) {
        params = event.body || {};
    }

    // Handle query parameters for Express.js
    let queryStringParameters: any = {};
    try {
        if (event.hasOwnProperty("query") && event.query) {
            queryStringParameters = event.query;
        } else if (event.hasOwnProperty("queryStringParameters") && event.queryStringParameters) {
            if (typeof event.queryStringParameters === 'string') {
                queryStringParameters = JSON.parse(event.queryStringParameters);
            } else {
                queryStringParameters = event.queryStringParameters;
            }
        }
    } catch (err) {
        queryStringParameters = event.queryStringParameters || {};
    }

    // Handle URL parameters
    if (event.hasOwnProperty("params") && event.params) {
        Object.assign(params, event.params);
    }

    if (queryStringParameters.hasOwnProperty("params") && typeof queryStringParameters.params === "string" && queryStringParameters.params) {
        try {
            queryStringParameters.params = JSON.parse(queryStringParameters.params);
        } catch (e) {
            // Keep as string if parsing fails
        }
    }

    return Object.assign(params, queryStringParameters);
}

export function responseBuilder(res: any, is_success: boolean, status_code: number, data: any = null, pagination: any = null, error_code: string = null) {
    const response = {
        status_code: status_code.toString(),
        is_success: is_success,
        error_code: error_code,
        data: data,
        pagination: pagination
    };

    return res.status(status_code).json(response);
}