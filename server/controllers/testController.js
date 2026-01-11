import OpenAI from "openai";
import sql from "../configs/db.js";
import {v2 as cloudinary} from "cloudinary";
import axios from "axios";
import FormData from "form-data";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// TEST ENDPOINT - No authentication required
export const testGenerateArticle = async (req, res) => {
    try {
        console.log('=== TEST Generate Articles Request ===');
        const { prompt, length } = req.body;

        // Use test user ID
        const userId = 'test_user_123';

        console.log('User ID:', userId);
        console.log('Prompt:', prompt);
        console.log('Length:', length);

        console.log('Calling AI API...');
        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content;
        console.log('AI Response received, length:', content?.length);

        console.log('Inserting into database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'article')`;
        console.log('✓ Database insert successful');

        console.log('Sending success response');
        res.json({ success: true, content });
    }
    catch (error) {
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.json({ success: false, message: error.message });
    }
};

// TEST ENDPOINT for Image Generation - No authentication required
export const testGenerateImage = async (req, res) => {
    try {
        console.log('=== TEST Generate Image Request ===');
        const { prompt, publish } = req.body;

        // Use test user ID
        const userId = 'test_user_123';

        console.log('User ID:', userId);
        console.log('Prompt:', prompt);
        console.log('Publish:', publish);

        console.log('Calling ClipDrop API...');
        const formData = new FormData();
        formData.append('prompt', prompt);
        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
                ...formData.getHeaders()
            },
            responseType: "arraybuffer",
        });

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;
        console.log('✓ Image generated from ClipDrop');

        console.log('Uploading to Cloudinary...');
        const {secure_url} = await cloudinary.uploader.upload(base64Image);
        console.log('✓ Uploaded to Cloudinary:', secure_url);

        console.log('Inserting into database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type, publish)
            VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;
        console.log('✓ Database insert successful');

        console.log('Sending success response');
        res.json({ success: true, content: secure_url });
    }
    catch (error) {
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.json({ success: false, message: error.message });
    }
};
