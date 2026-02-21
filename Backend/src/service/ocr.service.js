import Tesseract from 'tesseract.js';
import { PDFParse } from 'pdf-parse';

export const extractTextFromImage = async (imageBuffer) => {
    try {
        console.log("Starting OCR processing...");
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        console.log("OCR complete.");
        return text;
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to extract text from image");
    }
};

export const extractTextFromPdf = async (pdfBuffer) => {
    try {
        console.log("Starting PDF text extraction...");
        const parser = new PDFParse(new Uint8Array(pdfBuffer));
        const data = await parser.getText();
        console.log("PDF extraction complete.");
        return data.text;
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Failed to extract text from PDF");
    }
};

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });

export const parseMedicines = async (text) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
        console.warn("No GEMINI_API_KEY provided in .env. Falling back to empty extraction.");
        return [];
    }

    const prompt = `You are a medical data extractor. Extract all medicines from the following medical report text.
    Return ONLY a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json or extra text.
    Each object MUST have these exact keys:
    - id: An integer starting from 0, incrementing for each item.
    - name: The name of the medicine (string). Do not extract symptoms or patient data.
    - originalText: The full line where it was found (string).
    - timing: When to take it (e.g., '1-0-1', 'daily', 'twice', 'SOS') (string). Pick the most accurate timing.
    - dosage: The dosage amount (e.g., '500mg', '10ml', 'As prescribed') (string).
    
    If no actual medicines are found in the text, return an empty array [].
    
    Report Text:
    ${text}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let jsonStr = response.text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Parsing Error:", error);
        return [];
    }
};
