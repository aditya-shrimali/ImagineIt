import express from "express";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();

// The Limewire API endpoint
const LIMEWIRE_API_URL = "https://api.limewire.com/api/image/generation";

// Limewire API requires a Bearer token for authentication
const LIMEWIRE_API_KEY = process.env.LIMEWIRE_API_KEY;

router.route("/").get((req, res) => {
  res.send("Hello from Limewire Image Generation");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Make a POST request to Limewire's image generation API
    const response = await fetch(LIMEWIRE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Version": "v1",
        Accept: "application/json",
        Authorization: `Bearer ${LIMEWIRE_API_KEY}`, // Add the API key from the environment variables
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: "1:1", // Default to square aspect ratio; this can be adjusted as needed
      }),
    });

    const result = await response.json();

    if (response.ok && result.status === "COMPLETED") {
      // Extract the asset_url from the data array
      const imageUrl = result.data[0].asset_url;

      res.status(200).json({
        imageUrl: imageUrl,
        message: "Image generated successfully using Limewire.",
      });
    } else {
      res
        .status(500)
        .json({ message: result.failure_reason || "Image generation failed." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error?.message || "An error occurred while generating the image");
  }
});

export default router;
