import {WebProductController} from "./controller";


export const ProductRoutes = [
    {
        method: "GET",
        route: "/api/web/v1/products",
        controller: WebProductController.getProducts
    },
    {
        method: "GET",
        route: "/api/web/v1/product",
        controller: WebProductController.getProduct
    },
    {
        method: "PUT",
        route: "/api/web/v1/product",
        controller: WebProductController.updateProduct
    },
    {
        method: "POST",
        route: "/api/web/v1/product",
        controller: WebProductController.createProduct
    },
]