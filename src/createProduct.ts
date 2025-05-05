import { createProduct } from "./services/productService";

async function main() {
  try {
    const productData = {
      save_mode: "LISTING",
      description:
        " <p>Please check the measurements before purchase.</p>\n<ul> \n  <li>M-Size</li>\n  <li>XL-Size</li>\n</ul> \n<img src=\"https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/181595ea7d26489284b5667488d708c1~tplv-o3syd03w52-origin-jpeg.jpeg?from=1432613627\" width='100' height='100' /> ",
      category_id: "600001",
      brand_id: "7082427311584347905",
      main_images: [
        {
          uri: "tos-maliva-i-o3syd03w52-us/c668cdf70b7f483c94dbe",
        },
      ],
      skus: [
        {
          sales_attributes: [
            {
              id: "100089",
              value_id: "1729592969712207000",
              value_name: "Red",
              sku_img: {
                uri: "tos-maliva-i-o3syd03w52-us/c668cdf70b7f483c94dbe",
              },
              name: "Color",
              supplementary_sku_images: [
                {
                  uri: "tos-maliva-i-o3syd03w52-us/c668cdf70b7f483c94dbe",
                },
              ],
            },
          ],
          inventory: [
            {
              warehouse_id: "7068517275539719942",
              quantity: 999,
            },
          ],
          seller_sku: "Color-Red-XM001",
          price: {
            amount: "1.21",
            currency: "USD",
          },
          external_sku_id: "1729592969712207012",
          identifier_code: {
            code: "10000000000000",
            type: "GTIN",
          },
          combined_skus: [
            {
              product_id: "1729582718312380123",
              sku_id: "2729382476852921560",
              sku_count: 1,
            },
          ],
          sku_unit_count: "100.00",
          external_urls: [
            "https://example.com/path1",
            "https://example.com/path2",
          ],
          extra_identifier_codes: ["00012345678905", "9780596520687"],
          pre_sale: {
            type: "PRE_ORDER",
            fulfillment_type: {
              handling_duration_days: 7,
              release_date: 1619611761,
            },
          },
          list_price: {
            amount: "1",
            currency: "USD",
          },
          external_list_prices: [
            {
              source: "SHOPIFY_COMPARE_AT_PRICE",
              amount: "1",
              currency: "USD",
            },
          ],
        },
      ],
      title:
        "Men's Fashion Sports Low Cut Cotton Breathable Ankle Short Boat Invisible Socks",
      is_cod_allowed: false,
      certifications: [
        {
          id: "7182427311584347905",
          images: [
            {
              uri: "tos-maliva-i-o3syd03w52-us/c668cdf70b7f483c94dbe",
            },
          ],
          files: [
            {
              id: "v09ea0g40000cj91373c77u3mid3g1s0",
              name: "brand_cert.PDF",
              format: "PDF",
            },
          ],
          expiration_date: 1741234626,
        },
      ],
      package_dimensions: {
        length: "10",
        width: "10",
        height: "10",
        unit: "CENTIMETER",
      },
      product_attributes: [
        {
          id: "100392",
          values: [
            {
              id: "1001533",
              name: "Birthday",
            },
          ],
        },
      ],
      package_weight: {
        value: "1.32",
        unit: "KILOGRAM",
      },
      video: {
        id: "v09e40f40000cfu0ovhc77ub7fl97k4w",
      },
      external_product_id: "172959296971220002",
      delivery_option_ids: ["1729592969712203232"],
      size_chart: {
        image: {
          uri: "tos-maliva-i-o3syd03w52-us/c668cdf70b7f483c94dbe",
        },
        template: {
          id: "7267563252536723205",
        },
      },
      primary_combined_product_id: "1729582718312380123",
      is_not_for_sale: true,
      category_version: "v1",
      manufacturer_ids: ["172959296971220002"],
      responsible_person_ids: ["172959296971220003"],
      listing_platforms: ["TIKTOK_SHOP"],
      shipping_insurance_requirement: "REQUIRED",
      minimum_order_quantity: 1,
      is_pre_owned: false,
      idempotency_key: "create202208291503530001100220033",
    };

    const response = await createProduct(productData);
    console.log("Product created successfully:", response);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// Execute the function
main().catch(console.error);
