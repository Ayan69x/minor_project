const getUserIdFromToken = (token) => {
  try {
    // Split the token into its parts: header, payload, and signature
    const tokenParts = token.split(".");

    if (tokenParts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Decode the payload (second part of the token)
    const decodedPayload = JSON.parse(atob(tokenParts[1]));

    // Return the userId from the payload (adjust based on your token structure)
    return decodedPayload.id; // Adjust the key based on your API
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
export default getUserIdFromToken();
