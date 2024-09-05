import express from "express";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { TextToImage } from "deepinfra"; // Import the DeepInfra SDK

dotenv.config();

const router = express.Router();

// DeepInfra API Key and Model
const DEEPINFRA_API_KEY = process.env.DEEPINFRA_API_KEY;
const MODEL = "black-forest-labs/FLUX-1-schnell"; // Model ID

router.route("/").get((req, res) => {
  res.send("Hello from DeepInfra Image Generation");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Initialize DeepInfra's TextToImage model with the API key
    const model = new TextToImage(MODEL, DEEPINFRA_API_KEY);

    // Generate image using the provided prompt
    const response = await model.generate({ prompt });

    const imageUrl = response.images[0];

    // Check if the URL is a data URL (base64) or a regular URL
    if (imageUrl.startsWith("data:image/")) {
      // It's a data URL
      res.status(200).json({
        imageUrl: imageUrl, // Directly use the base64 data URL
        message: "Image generated successfully using DeepInfra.",
      });
    } else if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      // It's an HTTP/HTTPS URL, fetch the image
      const imageResponse = await fetch(imageUrl);

      if (imageResponse.ok && imageResponse.body) {
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString("base64");

        res.status(200).json({
          imageUrl: `data:image/png;base64,${base64Image}`,
          message: "Image generated successfully using DeepInfra.",
        });
      } else {
        console.error(
          "Failed to fetch the generated image from DeepInfra:",
          imageResponse.status,
          imageResponse.statusText
        );
        res
          .status(500)
          .json({ message: "Failed to fetch the generated image." });
      }
    } else {
      throw new Error("Unsupported URL format received.");
    }
  } catch (error) {
    console.error("Error in DeepInfra API call:", error); // Log more detailed error info
    res
      .status(500)
      .send(error?.message || "An error occurred while generating the image.");
  }
});

export default router;
