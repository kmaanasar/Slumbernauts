const functions = require("firebase-functions");
const cors = require("cors")({origin: true});

exports.callGemini = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const {prompt} = req.body;
    const GEMINI_API_KEY = functions.config().gemini.key;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        error: "API key not configured. Run: " +
          "firebase functions:config:set gemini.key=\"YOUR_KEY\"",
      });
    }

    try {
      const apiUrl = "https://generativelanguage.googleapis.com/" +
        "v1beta/models/gemini-1.5-flash:generateContent?key=" +
        GEMINI_API_KEY;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{parts: [{text: prompt}]}],
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      res.status(500).json({error: error.message});
    }
  });
});