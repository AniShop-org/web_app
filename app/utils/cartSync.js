export const syncLocalCartWithServer = async () => {
  try {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (localCart.length === 0) return true;

    const token = localStorage.getItem("authToken");
    if (!token) return false;

    let syncSuccess = true;
    // Send each local cart item to server
    for (const item of localCart) {
      try {
        // Find the appropriate variant
        const variantId =
          item.selectedVariantId ||
          (item.variants && item.variants.length > 0
            ? item.variants[0].id
            : null);

        if (!variantId) {
          console.error("No variant ID found for item:", item);
          continue;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/cart/addToCart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            body: JSON.stringify({
              productId: item.id,
              variantId: variantId,
              quantity: item.quantity || 1,
            }),
          },
        );

        if (!response.ok) {
          syncSuccess = false;
          console.error("Failed to sync item:", item.name);
        }
      } catch (error) {
        syncSuccess = false;
        console.error("Error syncing item:", item.name, error);
      }
    }

    return syncSuccess;
  } catch (error) {
    console.error("Error syncing local cart with server:", error);
    return false;
  }
};

export const mergeServerAndLocalCart = async (serverCartItems = []) => {
  try {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (localCart.length === 0) return true;

    const token = localStorage.getItem("authToken");
    if (!token) return false;

    // Create a map of server cart items for easy lookup
    const serverCartMap = new Map();
    serverCartItems.forEach((item) => {
      const key = `${item.product.id}-${item.variant.id}`;
      serverCartMap.set(key, item);
    });

    let mergeSuccess = true;

    // Process local cart items
    for (const item of localCart) {
      try {
        const variantId =
          item.selectedVariantId ||
          (item.variants && item.variants.length > 0
            ? item.variants[0].id
            : null);

        if (!variantId) continue;

        const key = `${item.id}-${variantId}`;

        // If item exists in both carts, update quantity
        if (serverCartMap.has(key)) {
          const serverItem = serverCartMap.get(key);
          const newQuantity = (serverItem.quantity || 0) + (item.quantity || 1);

          // Update server cart item quantity
          const updateResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/cart/updateCart`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
              body: JSON.stringify({
                cartItemId: serverItem.id,
                variantId: variantId,
                quantity: newQuantity,
              }),
            },
          );

          if (!updateResponse.ok) {
            mergeSuccess = false;
          }
        } else {
          // If item only exists in local cart, add to server cart
          const addResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/cart/addToCart`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
              body: JSON.stringify({
                productId: item.id,
                variantId: variantId,
                quantity: item.quantity || 1,
              }),
            },
          );

          if (!addResponse.ok) {
            mergeSuccess = false;
          }
        }
      } catch (error) {
        mergeSuccess = false;
        console.error("Error merging item:", error);
      }
    }

    return mergeSuccess;
  } catch (error) {
    console.error("Error merging carts:", error);
    return false;
  }
};

export const checkAndSyncCart = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const localCart = JSON.parse(localStorage.getItem("cart")) || [];
  if (localCart.length === 0) return;

  try {
    // Get server cart first
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/cart/viewCart`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      // Merge local cart with server cart
      await mergeServerAndLocalCart(data.cartItems || []);
    } else {
      // If we can't get the server cart, just sync the local cart
      await syncLocalCartWithServer();
    }
  } catch (error) {
    console.error("Error checking and syncing cart:", error);
  }
};

export const checkUserHasAddress = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/account/active-address`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return !!data.address; // Returns true if address exists
    }

    return false;
  } catch (error) {
    console.error("Error checking user address:", error);
    return false;
  }
};

export const syncCartAndCheckAddress = async ({
  onSyncComplete = () => {},
  onAddressMissing = () => {},
}) => {
  try {
    // First sync the cart
    const syncResult = await checkAndSyncCart();

    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: syncResult,
        isLoggedIn: false,
        hasAddress: false,
      };
    }

    // Check if user has an address
    const hasAddress = await checkUserHasAddress();

    // If sync was successful but no address exists, call the address missing callback
    if (syncResult && !hasAddress) {
      onAddressMissing();
    } else if (syncResult) {
      // If sync was successful and address exists, call the sync complete callback
      onSyncComplete();
    }

    return {
      success: syncResult,
      isLoggedIn: true,
      hasAddress,
    };
  } catch (error) {
    console.error("Error in syncCartAndCheckAddress:", error);
    return {
      success: false,
      isLoggedIn: !!localStorage.getItem("authToken"),
      hasAddress: false,
      error: error.message,
    };
  }
};
