const getUserRoleFromToken = (token) => {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      // console.log(tokenParts);
      
      const decodedPayload = JSON.parse(atob(tokenParts[1])); // Decode the token payload
      // console.log(decodedPayload);
      
      return decodedPayload.role; // Adjust based on your token structure (e.g., "role")
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  export default getUserRoleFromToken;