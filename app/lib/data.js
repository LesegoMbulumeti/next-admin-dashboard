// Fetch users data
export const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:8000/users");
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    
    const users = await res.json();
    
    // Get current count
    const currentCount = users.length;
    
    // For demonstration, let's assume we have a way to get previous week's count
    // In a real app, you might have this data stored or calculate it differently
    const previousCount = Math.floor(currentCount * (Math.random() > 0.5 ? 0.9 : 1.1)); // Simulate previous week data
    
    return {
      current: currentCount,
      previous: previousCount
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Fetch products data
export const fetchProducts = async () => {
  try {
    const res = await fetch("http://localhost:8000/products");
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    
    const products = await res.json();
    
    // Get current count
    const currentCount = products.length;
    
    // For demonstration, simulate previous week's count
    const previousCount = Math.floor(currentCount * (Math.random() > 0.5 ? 0.85 : 1.15)); // Simulate previous week data
    
    return {
      current: currentCount,
      previous: previousCount
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Calculate total product value (sum of all product prices)
export const fetchTotalProductValue = async () => {
  try {
    const res = await fetch("http://localhost:8000/products");
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    
    const products = await res.json();
    
    // Calculate current total value - just sum the prices without multiplying by stock
    const currentTotal = products.reduce((sum, product) => {
      return sum + product.price;
    }, 0);
    
    // For demonstration, simulate previous week's total
    const previousTotal = currentTotal * (Math.random() > 0.5 ? 0.92 : 1.08); // Simulate previous week data
    
    return {
      current: currentTotal,
      previous: previousTotal
    };
  } catch (error) {
    console.error("Error calculating total product value:", error);
    throw error;
  }
};