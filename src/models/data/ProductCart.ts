import {ProductDetail, ProductVariationsOutputData} from "@bikairproject/shared/dist/dto/ProductDetail";

export interface ProductCart extends ProductDetail{
    variation?: ProductVariationsOutputData | null;
}
