exports.handler = async (event) => {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {statusCode: 200, headers, body: ""};
  }

  if (event.httpMethod !== "POST") {
    return {statusCode: 405, headers, body: "Method Not Allowed"};
  }

  const {prompt} = JSON.parse(event.body);
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({error: "API key not configured"}),
    };
  }

  try {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            contents: [{parts: [{text: prompt}]}],
          }),
        },
    );

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({error: error.message}),
    };
  }
};