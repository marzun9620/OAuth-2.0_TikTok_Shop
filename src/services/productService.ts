import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { getFreshAccessToken } from "../utils/tokenManager";

const appKey = "6g2s247q1cqtl";
const appSecret = "3c0331190b356f9f4ec0a370d3c025d17260a430";
const shopCipher = "ROW_vkf2GgAAAACym91vJndajupiWTzH1JuG";

// Interfaces for the request body
interface Image {
  uri: string;
}

interface SalesAttribute {
  id: string;
  valueId: string;
  valueName: string;
  skuImg?: Image;
  name: string;
  supplementarySkuImages?: Image[];
}

interface Inventory {
  warehouseId: string;
  quantity: number;
}

interface Price {
  amount: string;
  currency: string;
}

interface IdentifierCode {
  code: string;
  type: string;
}

interface CombinedSku {
  productId: string;
  skuId: string;
  skuCount: number;
}

interface PreSaleFulfillmentType {
  handlingDurationDays: number;
  releaseDate: number;
}

interface PreSale {
  type: string;
  fulfillmentType: PreSaleFulfillmentType;
}

interface ExternalListPrice {
  source: string;
  amount: string;
  currency: string;
}

interface Sku {
  salesAttributes: SalesAttribute[];
  inventory: Inventory[];
  sellerSku: string;
  price: Price;
  externalSkuId: string;
  identifierCode: IdentifierCode;
  combinedSkus?: CombinedSku[];
  skuUnitCount?: string;
  externalUrls?: string[];
  extraIdentifierCodes?: string[];
  preSale?: PreSale;
  listPrice?: Price;
  externalListPrices?: ExternalListPrice[];
}

interface Certification {
  id: string;
  images?: Image[];
  files?: {
    id: string;
    name: string;
    format: string;
  }[];
  expirationDate?: number;
}

interface PackageDimensions {
  length: string;
  width: string;
  height: string;
  unit: string;
}

interface ProductAttribute {
  id: string;
  values: {
    id: string;
    name: string;
  }[];
}

interface PackageWeight {
  value: string;
  unit: string;
}

interface Video {
  id: string;
}

interface SizeChart {
  image?: Image;
  template?: {
    id: string;
  };
}

interface CreateProductRequest {
  save_mode: string;
  description: string;
  category_id: string;
  brand_id: string;
  main_images: Image[];
  skus: Sku[];
  title: string;
  is_cod_allowed: boolean;
  certifications?: Certification[];
  package_dimensions?: PackageDimensions;
  product_attributes?: ProductAttribute[];
  package_weight?: PackageWeight;
  video?: Video;
  external_product_id?: string;
  delivery_option_ids?: string[];
  size_chart?: SizeChart;
  primary_combined_product_id?: string;
  is_not_for_sale?: boolean;
  category_version?: string;
  manufacturer_ids?: string[];
  responsible_person_ids?: string[];
  listing_platforms?: string[];
  shipping_insurance_requirement?: string;
  minimum_order_quantity?: number;
  is_pre_owned?: boolean;
  idempotency_key?: string;
}

export interface CreateProductResponse {
  code: number;
  data: {
    product_id: string;
  };
  message: string;
  request_id: string;
}

export class ProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductError";
  }
}

function generateSign(
  params: Record<string, string | number>,
  body: any
): string {
  // Convert the request body to a string
  const bodyStr = JSON.stringify(body);

  // Sort query parameters
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map((k) => `${k}${params[k]}`).join("");

  // Combine app secret, path, query parameters, body, and app secret again
  const strToSign = `${appSecret}/product/202309/products${paramString}${bodyStr}${appSecret}`;

  // Generate HMAC SHA256 signature
  return crypto.createHmac("sha256", appSecret).update(strToSign).digest("hex");
}

export async function createProduct(
  productData: CreateProductRequest
): Promise<CreateProductResponse> {
  try {
    // Get a fresh access token before making the API call
    const accessToken = await getFreshAccessToken();

    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      app_key: appKey,
      shop_cipher: shopCipher,
      timestamp,
    };

    const sign = generateSign(params, productData);

    const response = await axios.post(
      "https://open-api.tiktokglobalshop.com/product/202309/products",
      productData,
      {
        params: {
          ...params,
          sign,
        },
        headers: {
          "x-tts-access-token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "Product creation response:",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", error.response?.data || error.message);
      throw new ProductError(
        `Product API error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new ProductError("Unknown error occurred during product API call");
  }
}
