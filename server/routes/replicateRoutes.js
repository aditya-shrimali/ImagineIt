import express from "express";
import * as dotenv from "dotenv";
import Replicate from "replicate";

dotenv.config();

const router = express.Router();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

router.route("/").get((req, res) => {
  res.send("Hello from Replicate Image Generation");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const output = await replicate.run(
      "bingbangboom-lab/flux-dreamscape:b761fa16918356ee07f31fad9b0d41d8919b9ff08f999e2d298a5a35b672f47e",
      {
        input: {
          model: "dev",
          prompt: prompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        },
      }
    );

    if (output && output.length > 0) {
      const imageUrl = output[0];
      console.log(imageUrl);
      res.status(200).json({
        imageUrl: imageUrl,
        message: "Image generated successfully using Replicate.",
      });
    } else {
      throw new Error("No image was generated");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({
      error: error.message || "An error occurred while generating the image",
      details: error.response ? error.response.data : null,
    });
  }
});

export default router;
