exports.handler = async (event) => {
  // CORS headers - allow all origins
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: headers,
      body: JSON.stringify({error: "Method Not Allowed"}),
    };
  }

  // Get the prompt from request body
  const {prompt} = JSON.parse(event.body);
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // Check if API key exists
  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({error: "API key not configured"}),
    };
  }

  // Call Gemini API
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{parts: [{text: prompt}]}],
        }),
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({error: error.message}),
    };
  }
};