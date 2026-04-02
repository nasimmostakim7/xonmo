export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  // Standard CORS headers to allow all origins and methods
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400",
  };

  // Handle browser Preflight (OPTIONS) request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Error if no URL is provided
  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "No target URL provided" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Clone the incoming request to forward it to the target API
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : null,
      redirect: "follow",
    });

    // Fetch data from the external API
    const response = await fetch(modifiedRequest);

    // Create a new response to add custom CORS headers
    const newResponse = new Response(response.body, response);

    // Inject CORS headers into the final response
    Object.keys(corsHeaders).forEach((key) => {
      newResponse.headers.set(key, corsHeaders[key]);
    });

    return newResponse;

  } catch (error) {
    return new Response(JSON.stringify({ error: "Proxy Execution Failed", message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
