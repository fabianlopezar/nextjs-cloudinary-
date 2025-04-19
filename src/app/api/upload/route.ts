import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Configuration
cloudinary.config({
  cloud_name: "deimspwc6",
  api_key: "597296641252981",
  api_secret: "hV-zb_wBxhTvjhk3KPoJhTBs15E", // Click 'View API Keys' above to copy your API secret
});

export async function POST(request: Request) {
  const data = await request.formData();
  const image = data.get("file");

  //console.dir(data,{depth:null});
  if (!image) {
    return NextResponse.json("no se ha subido ninguna imagen", { status: 400 });
  }
  if (image) {
    //console.log("deberia funcionar ");
    //console.log(data.get("file"));
  }
  if (image instanceof File) {
    console.log("deberia funcionar 2");
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /*const filePath = path.join(process.cwd(), "public", image.name);
    await writeFile(filePath, buffer);*/

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, resul) => {
          if (err) {
            reject(err);
          }
          resolve(resul);
        })
        .end(buffer);
    });
    console.log(response);
    return NextResponse.json({
      message: "imagen subida",
      url: response.secure_url,
    });
  }
}
