import { fetchOrders } from "./services/orderService";

async function main() {
  try {
    // Fetch orders data for specific order IDs
    const orderIds = ["576717916890501341"];
    const ordersResponse = await fetchOrders(orderIds);
    return ordersResponse;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Execute the function
main().catch(console.error);
