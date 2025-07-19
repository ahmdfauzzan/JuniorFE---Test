import { getPayloadFromEvent, responseBuilder } from "../../../util/common";
import {ProductService} from "../../../lib/produc/service";

export class WebProductController {
    static async getProducts(req: any, res: any) {
        try {
            const payload = getPayloadFromEvent(req);
            const limit = parseInt(payload.limit) || 10;
            const offset = parseInt(payload.offset) || 0;
            const page = parseInt(payload.page) || 1;
            const search = payload.search || payload.q; // support both 'search' and 'q' params
            const actualOffset = offset || (page - 1) * limit;

            const result = await ProductService.getService().getProducts(limit, actualOffset, search);

            const pagination = {
                page: Math.floor(actualOffset / limit) + 1,
                limit: limit,
                total: result.total,
                total_pages: Math.ceil(result.total / limit),
                search: search || null
            };

            return responseBuilder(res, true, 200, result.products, pagination);
        } catch (e) {
            console.error('Error in getProducts:', e);
            return responseBuilder(res, false, 500, null, null, "INTERNAL_SERVER_ERROR");
        }
    }

    static async getProduct(req: any, res: any) {
        try {
            const payload = getPayloadFromEvent(req);
            const productId = payload.productId || payload.product_id;

            if (!productId) {
                return responseBuilder(res, false, 400, null, null, "PRODUCT_ID_REQUIRED");
            }

            const product = await ProductService.getService().getProduct(productId);

            if (!product) {
                return responseBuilder(res, false, 404, null, null, "PRODUCT_NOT_FOUND");
            }

            return responseBuilder(res, true, 200, product);
        } catch (e) {
            console.error('Error in getProduct:', e);
            return responseBuilder(res, false, 500, null, null, "INTERNAL_SERVER_ERROR");
        }
    }

    static async createProduct(req: any, res: any) {
        try {
            const payload = getPayloadFromEvent(req);

            // Validate required fields
            if (!payload.product_title || !payload.product_price) {
                return responseBuilder(res, false, 400, null, null, "MISSING_REQUIRED_FIELDS");
            }

            const productData = {
                product_title: payload.product_title,
                product_price: payload.product_price,
                product_description: payload.product_description,
                product_image: payload.product_image,
                product_category: payload.product_category
            };

            const product = await ProductService.getService().createProduct(productData);

            return responseBuilder(res, true, 201, product);
        } catch (e) {
            console.error('Error in createProduct:', e);
            return responseBuilder(res, false, 500, null, null, "INTERNAL_SERVER_ERROR");
        }
    }

    static async updateProduct(req: any, res: any) {
        try {
            const payload = getPayloadFromEvent(req);
            const productId = payload.productId || payload.product_id;

            if (!productId) {
                return responseBuilder(res, false, 400, null, null, "PRODUCT_ID_REQUIRED");
            }

            const updateData = {
                product_title: payload.product_title,
                product_price: payload.product_price,
                product_description: payload.product_description,
                product_image: payload.product_image,
                product_category: payload.product_category
            };

            // Remove undefined values
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            const product = await ProductService.getService().updateProduct(productId, updateData);

            if (!product) {
                return responseBuilder(res, false, 404, null, null, "PRODUCT_NOT_FOUND");
            }

            return responseBuilder(res, true, 200, product);
        } catch (e) {
            console.error('Error in updateProduct:', e);
            return responseBuilder(res, false, 500, null, null, "INTERNAL_SERVER_ERROR");
        }
    }

    static async deleteProduct(req: any, res: any) {
        try {
            const payload = getPayloadFromEvent(req);
            const productId = payload.productId || payload.product_id;

            if (!productId) {
                return responseBuilder(res, false, 400, null, null, "PRODUCT_ID_REQUIRED");
            }

            const deleted = await ProductService.getService().deleteProduct(productId);

            if (!deleted) {
                return responseBuilder(res, false, 404, null, null, "PRODUCT_NOT_FOUND");
            }

            return responseBuilder(res, true, 200, { message: "Product deleted successfully" });
        } catch (e) {
            console.error('Error in deleteProduct:', e);
            return responseBuilder(res, false, 500, null, null, "INTERNAL_SERVER_ERROR");
        }
    }
}