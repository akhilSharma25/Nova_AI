
import OpenAI from "openai";
import sql from "../config/db.js";
import FormData from 'form-data';
import fs from 'fs'
import pdf from "pdf-parse/lib/pdf-parse.js"

import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
export const generateArticle=async(req ,res)=>{
    try {
        const {userId}=req.auth();
        const {prompt,length}=req.body;
        const plan=req.plan;
        const free_usage=req.free_usage;

        if(plan!=='premium' && free_usage>=10){
            return res.json({success:false,message:"Limit reached, Upgrade to continue"})
        }

        const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },

    ],
    temperature:0.7,
    max_tokens:length
});
const content=response.choices[0].message.content

await sql` INSERT INTO creations(user_id,prompt,content,type) values (${userId},${prompt},${content},${'article'})`;

if(plan!=='premium'){
    await clerkClient.users.updateUserMetadata(userId,{
        privateMetadata:{
    free_usage: free_usage + 1
        }
    })

}

res.json({success:true,content});

    } catch (error) {
        console.log(error.message);
        
           res.status(500).json({ success: false, message: error.message });

    }

}
export const generateBlogTitle=async(req ,res)=>{
    try {
        const {userId}=req.auth();
        const {prompt}=req.body;
        const plan=req.plan;
        const free_usage=req.free_usage;

        if(plan!=='premium' && free_usage>=10){
            return res.json({success:false,message:"Limit reached, Upgrade to continue"})
        }

        const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },

    ],
    temperature:0.7,
    max_tokens:100
});
const content=response.choices[0].message.content

await sql` INSERT INTO creations(user_id,prompt,content,type) values (${userId},${prompt},${content},${'blog-title'})`;

if(plan!=='premium'){
    await clerkClient.users.updateUserMetadata(userId,{
        privateMetadata:{
    free_usage: free_usage + 1
        }
    })

}

res.json({success:true,content});

    } catch (error) {
        console.log(error.message);
        
           res.status(500).json({ success: false, message: error.message });

    }

}
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth(); // Assuming you are using Clerk or similar
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    // FormData to send prompt
    const formData = new FormData();
    formData.append("prompt", prompt);
// console.log("Clipdrop API Key:", process.env.Clickdrop_API_KEY)

    // Call ClipDrop API
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.Clickdrop_API_KEY,
        },
        responseType: "arraybuffer", // because image data is returned
      }
    );

    // Convert binary data to base64
    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    // Upload to Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // Store in DB
    await sql`
      INSERT INTO creations(user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, ${"generate-image"}, ${
      publish ?? false
    })
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Image generation failed. " + error.message });
  }
};
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth(); // Assuming you are using Clerk or similar
    const image  = req.file;
    const plan = req.plan;
console.log("Uploaded file:", req.file);

        if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded. Please use 'image' as key in form data.",
      });
    }
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

  
    // Upload to Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(image.path,{
        transformation:[
            {
                effect:'background_removal',
                background_removal:'remove_the_background'
            }
        ]
    });

    // Store in DB
    await sql`
      INSERT INTO creations(user_id, prompt, content, type, publish)
      VALUES (${userId}, ${'Remove background from image'}, ${secure_url},'image', ${false})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Error remove background image:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Image generation failed. " + error.message });
  }
};
export const removeImageObj = async (req, res) => {
  try {
    const { userId } = req.auth(); // Assuming you are using Clerk or similar
    const { object } = req.body; // Assuming you are using Clerk or similar
    const image  = req.file;
    const plan = req.plan;
console.log("Uploaded file:", req.file);

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

  
    // Upload to Cloudinary
    const { public_id } = await cloudinary.uploader.upload(image.path);

   const imageUrl= cloudinary.url(public_id,{
        transformation:[{effect:`gen_remove:${object}`}],
        resource_type:"image"
    })

    // Store in DB
    await sql`
      INSERT INTO creations(user_id, prompt, content, type, publish)
      VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl},'image', ${false})`;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error("Error remove object image:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Image generation failed. " + error.message });
  }
};
export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth(); // Assuming you are using Clerk or similar
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    if(resume.size>5*1024*1024){
        return res.json({success:false,message:"Resume file size exceeds allowed size (5MB)."})
    }

    const dataBuffer=fs.readFileSync(resume.path)

    const pdfData=await pdf(dataBuffer)
    const prompt=`Review the following resume and provide constructive feedback on its strengths, weakness, and areas for improvement. Resume Content:\n\n${pdfData.text} `

         const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },

    ],
    temperature:0.7,
    max_tokens:1000
});
const content=response?.choices[0].message.content

  
    // Store in DB
  await sql`
  INSERT INTO creations(user_id, prompt, content, type, publish)
  VALUES (${userId}, ${'Review the uploaded resume'}, ${content}, 'Resume Review', ${false})`;

    res.json({ success: true, content: content });
  } catch (error) {
    console.error("Error resume review", error.message);
    res
      .status(500)
      .json({ success: false, message: "Image generation failed. " + error.message });
  }
};