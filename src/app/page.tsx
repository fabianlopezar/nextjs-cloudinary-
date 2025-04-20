/*https://www.youtube.com/watch?v=_Xkdn1QpPG0&t=1768s*/
"use client";
import React from "react";
import { useState } from "react";

function HomePage() {
  // Declare a state variable to store the selected file, which can be either a File or null
  const [file, setFile] = useState<File | null>(null);
  // Declare a state variable to store the URL of the uploaded image, initially set to null
  const [imageUrl, setImageUrl] = useState(null);

  return (
    <div>
      <form
        // Handle form submission
        onSubmit={async (e) => {
          e.preventDefault(); // Prevent the default form submission behavior

          // Create a new FormData object to handle file data
          const formData = new FormData();
          // Append the selected file to the FormData object if it's not null
          if (file) {
            formData.append("file", file);
          }
          // Make a POST request to the server to upload the file
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData, // Send the file as the request body
          });

          // Parse the response as JSON
          const data = await response.json();
          // Set the image URL in the state after the file is successfully uploaded
          setImageUrl(data.url);
        }}
      >
        {/* Input field for selecting a file */}
        <input
          type="file"
          onChange={(e) => {
            // Get the files from the input event
            const files = e.target.files;
            // If files are selected, update the state with the first file
            if (files && files.length > 0) {
              setFile(files[0]);
            }
          }}
        />
        {/* Submit button */}
        <button>Enviar</button>
      </form>
      {/* If the image URL is available, display the uploaded image */}
      {imageUrl && <img src={imageUrl} alt="" />}
    </div>
  );
}

export default HomePage;
