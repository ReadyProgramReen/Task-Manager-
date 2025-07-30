export function getUserFromToken() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decoded = JSON.parse(atob(payloadBase64));
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}
