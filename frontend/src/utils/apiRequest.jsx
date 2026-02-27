const apiRequest = async (apiConfig, body = null) => {
  const { url, method } = apiConfig;

  const isFormData = body instanceof FormData;

  const response = await fetch(url, {
    method: method.toUpperCase(),
    credentials: "include",
    headers: isFormData
      ? {} 
      : { "Content-Type": "application/json" },
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : null,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export default apiRequest;