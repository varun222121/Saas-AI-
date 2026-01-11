

// Middleware to check userId and haspremiumPlan

import { clerkClient } from "@clerk/express";


export const auth = async (req, res, next)=>{
    try{
        console.log('=== Auth Middleware ===');
        const{userId, has}= await req.auth();
        console.log('User ID from Clerk:', userId);

        const hasPremiumPlan= await has({permission:'premium'});
        console.log('Has premium plan:', hasPremiumPlan);

        const user= await clerkClient.users.getUser(userId);
        console.log('User metadata:', user.privateMetadata);

        if(!hasPremiumPlan && user.privateMetadata?.free_usage !== undefined){
            req.free_usage = user.privateMetadata.free_usage
            console.log('Existing free usage:', req.free_usage);
        }else if(!hasPremiumPlan){
            console.log('Initializing free usage to 0');
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata:{
                    free_usage:0
                }
            })
            req.free_usage=0;
        }else{
            req.free_usage=0;
        }

        req.Plan = hasPremiumPlan ? 'premium' : 'free';
        console.log('Final plan:', req.Plan, 'free_usage:', req.free_usage);
        next()
    } catch (error){
        console.error('=== Auth Middleware Error ===');
        console.error('Error:', error.message);
        res.json({success: false, message: error.message})
     }
 } 