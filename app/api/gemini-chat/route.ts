
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-1.5-flash-latest"; // Default model, can be overridden by request
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export async function POST(request: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured. Please set GEMINI_API_KEY." },
      { status: 500 }
    );
  }

  try {
    const { model: requestedModel, prompt, systemInstruction, previousHtml } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const modelToUse = requestedModel || MODEL_NAME;

    const generationConfig = {
      temperature: 0.9, // Controls randomness
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192, // Max output tokens for the model
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const updatedSystemInstruction = systemInstruction
      ? `${systemInstruction}

Ensure you return the complete HTML file from <!DOCTYPE html> to </html> in one response. If the code is long, continue in subsequent messages until it's complete. Do not stop prematurely or truncate.`
      : "Ensure you return the complete HTML file from <!DOCTYPE html> to </html> in one response. If the code is long, continue in subsequent messages until it's complete. Do not stop prematurely or truncate.";

    const generativeModel = genAI.getGenerativeModel({
        model: modelToUse,
        generationConfig,
        safetySettings,
        systemInstruction: updatedSystemInstruction,
    });

    let fullHtmlContent = "";
    let currentPrompt = prompt;
    let isFirstCall = true;

    do {
      let promptForModel = currentPrompt;
      if (isFirstCall && previousHtml) {
        promptForModel = `USER'S REQUEST: "${currentPrompt}"\n\nPREVIOUS HTML CODE TO MODIFY (ensure you modify this code and do not start from scratch):\n${previousHtml}\n\nRemember to output the full modified HTML based on the user's request.`;
      } else if (!isFirstCall) {
        promptForModel = "Please continue the previous HTML from where you left off.";
      }

      const result = await generativeModel.generateContent(promptForModel);
      const response = result.response;
      let chunk = response.text();

      const cleanedChunk = chunk.trim();
      if (cleanedChunk.startsWith("```html") && cleanedChunk.endsWith("```")) {
        chunk = cleanedChunk.substring(7, cleanedChunk.length - 3).trim();
      } else if (cleanedChunk.startsWith("```") && cleanedChunk.endsWith("```")) {
        chunk = cleanedChunk.substring(3, cleanedChunk.length - 3).trim();
      }

      fullHtmlContent += chunk;
      isFirstCall = false;

    } while (!fullHtmlContent.trim().toLowerCase().endsWith("</html>"));

    let htmlContent = fullHtmlContent;

    if (!htmlContent.trim().toLowerCase().startsWith("<!doctype html")) {
        console.warn("AI response might not be valid HTML after cleaning:", htmlContent.substring(0, 200));
    }

    return NextResponse.json({ html: htmlContent });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "Failed to generate content from AI.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    // @ts-ignore
    if (error.response && error.response.data && error.response.data.error) {
        // @ts-ignore
        errorMessage = error.response.data.error.message || errorMessage;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
