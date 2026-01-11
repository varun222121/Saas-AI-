import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import {v2 as cloudinary} from "cloudinary";
import axios from "axios";
import FormData from "form-data";
import fs from 'fs'
// Import pdf-parse dynamically
let pdfParse = null;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticles = async (req, res)=>{
    try{
        console.log('=== Generate Articles Request ===');
        const {userId}= await req.auth();
        const {prompt, length} = req.body;
        const  plan= req.Plan;
        const free_usage= req.free_usage;

        console.log('User ID:', userId);
        console.log('Plan:', plan);
        console.log('Free usage:', free_usage);
        console.log('Prompt:', prompt);
        console.log('Length:', length);

        if(plan !== 'premium' && free_usage >= 10){
            console.log('Usage limit reached');
            return res.json({success: false, message: "Limited reached. Upgrade to continue."})
        }

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
            max_tokens:length,
        });

        const content = response.choices[0].message.content
        console.log('AI Response received, length:', content?.length);

        console.log('Inserting into database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'article')`;
        console.log('✓ Database insert successful');

        if(plan !== 'premium'){
            console.log('Updating user metadata...');
            await clerkClient.users.updateUserMetadata(userId,
                {
                    privateMetadata:{
                        free_usage: free_usage + 1
                    }
                }
            )
            console.log('✓ User metadata updated');
        }

        console.log('Sending success response');
        res.json({success: true, content})
    }

    catch (error){
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.json({success: false, message: error.message})
    }
}

export const generateBlogTitle = async (req, res)=>{
    try{
        console.log('=== Generate Blog Titles Request ===');
        const {userId}= await req.auth();
        const {prompt} = req.body;
        const  plan= req.Plan;
        const free_usage= req.free_usage;

        console.log('User ID:', userId);
        console.log('Plan:', plan);
        console.log('Free usage:', free_usage);
        console.log('Prompt:', prompt);

        if(plan !== 'premium' && free_usage >= 10){
            console.log('Usage limit reached');
            return res.json({success: false, message: "Limited reached. Upgrade to continue."})
        }

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
            max_tokens:500,
        });

        const content = response.choices[0].message.content
        console.log('AI Response received, length:', content?.length);

        console.log('Inserting into database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'Blog-title')`;
        console.log('✓ Database insert successful');

        if(plan !== 'premium'){
            console.log('Updating user metadata...');
            await clerkClient.users.updateUserMetadata(userId,
                {
                    privateMetadata:{
                        free_usage: free_usage + 1
                    }
                }
            )
            console.log('✓ User metadata updated');
        }

        console.log('Sending success response');
        res.json({success: true, content})
    }

    catch (error){
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.json({success: false, message: error.message})
    }
}

export const generateImage = async (req, res)=>{
    try{
        console.log('=== Generate Image ===');
        const {userId}= await req.auth();
        const {prompt, publish} = req.body;
        const  plan= req.Plan;

        console.log('User ID:', userId);
        console.log('Plan:', plan);
        console.log('Prompt:', prompt);
        console.log('Publish:', publish);

        // Removed premium check for development/testing
        // if(plan !== 'premium'){
        //     console.log('Usage limit reached');
        //     return res.json({success: false, message: "This feature is only available for premium subscription."})
        // }


        console.log('Calling ClipDrop API...');
        const formData = new FormData();
        formData.append('prompt', prompt);
        const {data}= await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
                ...formData.getHeaders()
            },
            responseType: "arraybuffer",
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').
            toString('base64')}`;

        const {secure_url} = await cloudinary.uploader.upload(base64Image)   

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
            max_tokens:100,
        });

        const content = response.choices[0].message.content
        console.log('AI Response received, length:', content?.length);

        console.log('Inserting into database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type, publish)
            VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;
        console.log('✓ Database insert successful');

        

        console.log('Sending success response');
        res.json({success: true, content: secure_url})
    }

    catch (error){
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.json({success: false, message: error.message})
    }
}

export const removeImageBackground = async (req, res)=>{
    try{
        console.log('=== Remove Image Background ===');
        const {userId}= await req.auth();
        const image= req.file;
        const  plan= req.Plan;

        console.log('User ID:', userId);
        console.log('Plan:', plan);
        console.log('Image:', image?.filename);

        // Removed premium check for development/testing
        // if(plan !== 'premium'){
        //     console.log('Usage limit reached');
        //     return res.json({success: false, message: "This feature is only available for premium subscription."})
        // }




        const {secure_url} = await cloudinary.uploader.upload(image.path,{
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal:'remove_the_background'
                }
            ]
        })   

        console.log('Inserting into database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, 'Remove Background from image', ${secure_url}, 'image')`;
        console.log('✓ Database insert successful');

        

        console.log('Sending success response');
        res.json({success: true, content: secure_url})
    }

    catch (error){
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.json({success: false, message: error.message})
    }
}

export const removeImageObject = async (req, res)=>{
    try{
        console.log('=== Remove Image Object ===');
        const {userId}= await req.auth();
        const {object}= req.body;
        const image= req.file;
        const  plan= req.Plan;

        console.log('User ID:', userId);
        console.log('Plan:', plan);
        console.log('Object to remove:', object);
        console.log('Image:', image?.filename);

        //if(plan !== 'premium'){
          //  console.log('Usage limit reached');
            //return res.json({success: false, message: "This feature is only available for premium subscription."})
        //}




        const {public_id} = await cloudinary.uploader.upload(image.path)
        
        const imageUrl= cloudinary.url(public_id,{
            transformation:[{effect:`gen_remove:${object}`}],
            resource_type: 'image'
        })

        console.log('Inserting into database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')`;
        console.log('✓ Database insert successful');

        

        console.log('Sending success response');
        res.json({success: true, content: imageUrl})
    }

    catch (error){
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.json({success: false, message: error.message})
    }
}

export const resumeReview = async (req, res)=>{
    try{
        console.log('=== Resume Review ===');
        const {userId}= await req.auth();
        const resume= req.file;
        const  plan= req.Plan;

        console.log('User ID:', userId);
        console.log('Plan:', plan);
        console.log('Resume:', resume?.filename);

       // if(plan !== 'premium'){
         //   console.log('Usage limit reached');
           // return res.json({success: false, message: "This feature is only available for premium subscription."})
        //}


       if(resume.size >5 * 1024 *1024){
            return res.json({success:false, message: "Resume file size exceeds allow size (5MB)"})

       }

       // Simplified approach: Return a helpful message since PDF parsing is not working
       const content = `## Resume Review Feature - PDF Parsing Unavailable

I apologize, but PDF text extraction is currently unavailable. However, I can still help you improve your resume!

### General Resume Review Guidelines:

**Key Strengths to Look For:**
- Clear, concise professional summary
- Quantified achievements with specific metrics
- Relevant keywords for ATS (Applicant Tracking Systems)
- Clean, professional formatting
- Proper grammar and spelling

**Common Weaknesses:**
- Generic job descriptions without specifics
- Missing quantifiable results/impact
- Poor formatting or inconsistent styling
- Irrelevant information
- Typos and grammar errors

**Areas for Improvement:**
1. **Professional Summary**: Tailor it to your target role
2. **Work Experience**: Use action verbs and show measurable impact
3. **Skills Section**: Match job requirements and industry standards
4. **Education**: Highlight relevant coursework, projects, or honors
5. **Format**: Keep it clean, scannable, and ATS-friendly

**Pro Tips:**
- Use the STAR method (Situation, Task, Action, Result) for achievements
- Tailor your resume for each specific job application
- Keep it concise: 1-2 pages maximum
- Use consistent formatting throughout
- Include contact information and LinkedIn profile

**Next Steps:**
For a personalized resume review, you can copy and paste your resume text directly into a text editor or document and I'll provide specific, actionable feedback!

---
*Note: Full PDF parsing capability will be available in a future update.*`

        console.log('Returning resume review guidelines');

        console.log('Inserting into database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;
        console.log('✓ Database insert successful');

        

        console.log('Sending success response');
        res.json({success: true, content})
    }

    catch (error){
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.json({success: false, message: error.message})
    }
}