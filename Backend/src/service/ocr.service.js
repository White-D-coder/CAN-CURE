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

    const prompt = `You are a clinical prescription intelligence engine.

STRICT MODE:
- Extract only explicitly written data.
- If unclear, return "UNKNOWN".
- Do NOT infer disease from medicine.
- Do NOT assume dosage meaning.
- Output valid JSON only.

Clean the OCR text without changing medical meaning. Fix obvious OCR spelling errors, normalize units, remove random symbols. Preserve all medical terms exactly.

EXTRACT:
1. Patient_Info: name, age, gender, date
2. Clinical_Information: symptoms_explicit, diagnoses_explicit, vitals_if_present
3. Medicines: brand_name_as_written, generic_name_if_written, strength_value, strength_unit, dosage_form, frequency_exact_text, timing_exact_text, duration_exact_text, total_quantity_if_written
4. Lab_Tests_Ordered
5. Followup_Notes

Validate the extracted data:
- Check if strength numeric format is correct, unit consistent, dosage form valid, frequency readable.
- If any unsafe ambiguity exists, set "requires_manual_review": true

Return JSON exactly in this format:
{
  "patient_info": {},
  "clinical_information": {},
  "medicines": [
    {
      "brand_name_as_written": "",
      "generic_name_if_written": "",
      "strength_value": "",
      "strength_unit": "",
      "dosage_form": "",
      "frequency_exact_text": "",
      "timing_exact_text": "",
      "duration_exact_text": "",
      "total_quantity_if_written": ""
    }
  ],
  "lab_tests": [],
  "followup_notes": "",
  "data_completeness": "HIGH/MEDIUM/LOW",
  "requires_manual_review": false,
  "validation_notes": []
}

Report Text:
${text}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const parsedData = JSON.parse(response.text);

        // Map the detailed medicines back to the format expected by the frontend
        if (parsedData && Array.isArray(parsedData.medicines)) {
            return parsedData.medicines.map((med, index) => {
                const name = med.brand_name_as_written || med.generic_name_if_written || "Unknown Medicine";
                const strength = (med.strength_value && med.strength_value !== "UNKNOWN") ? med.strength_value : "";
                const unit = (med.strength_unit && med.strength_unit !== "UNKNOWN") ? med.strength_unit : "";
                const dosage = `${strength} ${unit}`.trim() || "As prescribed";
                const timing = (med.timing_exact_text && med.timing_exact_text !== "UNKNOWN") ? med.timing_exact_text :
                    ((med.frequency_exact_text && med.frequency_exact_text !== "UNKNOWN") ? med.frequency_exact_text : "Daily");

                return {
                    id: index,
                    name: name,
                    originalText: `${name} ${dosage} ${med.dosage_form || ''} ${timing}`.trim(),
                    timing: timing,
                    dosage: dosage
                };
            });
        }
        return [];
    } catch (error) {
        console.error("AI Parsing Error:", error);
        return [];
    }
};
