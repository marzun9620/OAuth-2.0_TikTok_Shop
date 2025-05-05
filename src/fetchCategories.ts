import { fetchCategories } from "./services/categoryService";

async function main() {
  try {
    // Fetch categories data (token refresh is handled internally)
    const categoriesResponse = await fetchCategories();
    return categoriesResponse;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Execute the function
main().catch(console.error);
