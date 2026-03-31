import Ticket from "../models/ticket.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: `${process.env.GROQ_API_KEY}` });

const classifyWithGroq = async (message) => {
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are a support ticket classifier. Analyze the message and respond ONLY in this exact JSON format with no explanation:
{
  "category": "Bug Report" or "Feature Request" or "Billing Issue" or "General Question" or "Urgent/Critical",
  "priority": number between 1 to 5,
  "aiSummary": "one line summary",
  "aiStatus": "processed"
}`
            },
            {
                role: "user",
                content: message
            }
        ],
        temperature: 0.3,
    });

    const text = completion.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
}

const sendFeedback = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if ([name, email, subject, message].some((field) => field?.trim() === "")) {
        throw new apiError(401, "form fields are empty");
    }

    const formData = await Ticket.create({ name, email, subject, message });

    if (!formData) {
        throw new apiError(401, "Error while creating Ticket");
    }

    try {
        const aiResult = await classifyWithGroq(message);
        formData.category = aiResult.category;
        formData.priority = aiResult.priority;
        formData.aiSummary = aiResult.aiSummary;
        formData.aiStatus = aiResult.aiStatus;
        await formData.save();
    } catch (err) {
        console.error("Groq error:", err.message);
    }

    return res
        .status(200)
        .json(new apiResponse(200, formData, "successfully submit feedback"));
});

 const getTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    
    return res
        .status(200)
        .json(new apiResponse(200, tickets, "tickets fetched successfully"));
});

export {sendFeedback,getTickets} ;



