import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField, Loader } from "../components";
import { getRandomPrompt } from "../utils";
import { PiImage } from "react-icons/pi";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are present
    if (form.name && form.prompt) {
      setLoading(true);
      try {
        // Call the backend image generation route
        const response = await fetch(
          "https://imagine-it-kappa.vercel.app/api/v1/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: form.prompt, // Send the prompt for image generation
              num_images: 1, // Specify the number of images to generate
              aspect_ratio: "1:1", // Optional, adjust based on user input or requirements
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Update form with the generated image URL
          setForm({
            ...form,
            photo: data.imageUrl, // Store the image URL in the 'photo' field
          });

          alert("Image generated successfully!");

          // Optionally, display the image or navigate
          // Example: you can render the image with <img src={form.photo} alt="Generated Image" />
          navigate("/");
        } else {
          alert("Error: " + (data.message || "Something went wrong"));
        }
      } catch (err) {
        alert("An error occurred: " + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please provide all the fields");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);

        // Send a POST request to your backend
        const response = await fetch(
          "https://imagine-it-kappa.vercel.app/api/v1/replicate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: form.prompt,
              num_images: 1, // or any other parameters required by your API
            }),
          }
        );

        // Check if the response is okay
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response data as JSON
        const data = await response.json();

        // Check if the image URL exists in the response data
        if (data.imageUrl) {
          // Set the image URL directly if it's a data URL
          setForm({ ...form, photo: data.imageUrl });
        } else {
          throw new Error("No image URL received from the server");
        }
      } catch (error) {
        console.error("Error generating image:", error);
        alert(error.message || "An error occurred while generating the image");
      } finally {
        setGeneratingImg(false); // Reset the loading state
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-3xl">Create</h1>
        <p className="mt-2 text-gray-500 text-base">
          Create imaginative and visually stunning images
        </p>
      </div>

      <form action="" className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            lableName="Your Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            lableName="Prompt"
            type="text"
            name="prompt"
            placeholder="a stained glass window depicting a hamburger and french fries"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className="relative bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex justify-center">
                <PiImage size={200} color="gray" />
              </div>
            )}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center opacity-90">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-500 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>
        <div className="mt-3">
          <p className="mt-2 text-[#666e75] text-[14px]">
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
