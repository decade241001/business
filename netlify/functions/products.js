import { products } from "./_shared/products.js";
export default async () => Response.json(products);
export const config = { path: "/api/products" };
