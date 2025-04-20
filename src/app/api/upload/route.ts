//https://www.youtube.com/watch?v=_Xkdn1QpPG0&t=1768s
import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: "deimspwc6",
  api_key: "597296641252981",
  api_secret: "hV-zb_wBxhTvjhk3KPoJhTBs15E",
});

//"Handler for POST requests (image upload)."
export async function POST(request: Request) {
  try {
    //Extracts the form data sent in the request.
    const data = await request.formData();
    const file = data.get("file");

    //"Validates that a file has been provided and that it is a valid instance of File."
    if (!file || !(file instanceof File)) {
      return NextResponse.json("No valid image file provided.", {
        status: 400,
      });
    }

    // Converts the file into a byte buffer so it can be processed by Cloudinary.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Uploads the image to Cloudinary using upload_stream and a Promise to await the result.
    const response = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, resul) => {
          // Error handling: if there's an error or the response is undefined, the promise is rejected.
          if (err || !resul) {
            reject(err);
          }
          // If there is a valid response, the promise is resolved with the response.
          if (resul) {
            resolve(resul);
          }
        })
        // Ends the stream by sending the buffer.
        .end(buffer);
    });
    // Returns a JSON response with the message and the secure URL of the uploaded image.
    return NextResponse.json({
      message: "Image uploaded.",
      url: response.secure_url,
    });
  } catch (error) {
    // Global error handling: logs the error to the console and responds with a 500 error.
    console.error("Error uploading image to Cloudinary.:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
