import Tesseract from 'tesseract.js';
<<<<<<< HEAD
import { PDFParse } from 'pdf-parse';
=======
import { createRequire } from 'module';
import { google } from 'googleapis';
import fs from 'fs';
import { prisma } from '../db/prisma.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
>>>>>>> 892150e (Update: Backend/src/service/ocr.service.js, Frontend/src/components/MedicinalRecord.jsx and 1 others)

// --- GOOGLE DRIVE CONFIGURATION ---
// Note: This requires a service_account_key.json file in the root/config
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: './config/service_account_key.json', // Path to your service account key
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

export const uploadToDrive = async (filePath, fileName) => {
    try {
        const fileMetadata = {
            name: fileName,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Ensure this is in .env
        };
        const media = {
            mimeType: 'application/pdf',
            body: fs.createReadStream(filePath),
        };
        const res = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });
        return res.data.webViewLink;
    } catch (error) {
        console.error("Google Drive Upload Error:", error);
        return null; // Fallback or handle accordingly
    }
};

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
import fs from 'fs';
dotenv.config();

<<<<<<< HEAD
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

        console.log("=== GEMINI RAW TEXT RESPONSE ===");
        console.log(response.text);

        const parsedData = JSON.parse(response.text);

        console.log("=== GEMINI PARSED JSON ===");
        console.log(JSON.stringify(parsedData, null, 2));

        try {
            fs.writeFileSync('debug_gemini.txt', response.text);
        } catch (e) {
            console.error("Failed to write log", e);
=======
    // Expanded Regex Patterns
    const DOSE_REGEX = /\b\d+(\.\d+)?\s*(mg|g|ml|mcg|iu|unit|%|units)\b/i;
    const FREQ_REGEX = /\b(\d+-\d+-\d+|od|bd|bid|tds|tid|qid|sos|hs|prn|stat|daily|weekly|once|twice|thrice|every\s+\d+\s+hours?|thrice\s+daily|twice\s+daily)\b/i;
    const FORM_REGEX = /\b(tab|cap|inj|syp|syrup|sol|susp|drop|oint|crm|gel|neb|pill|capsule|tablet|injection|strip)\b/i;
    const ROUTE_REGEX = /\b(oral|iv|im|sc|po|topical|local|sublingual)\b/i;
    const STRIP_QTY_REGEX = /[\d×x*]\s*(\d+)\b/; // Matches "x 10" or "× 10"
    const IGNORE_KEYWORDS = /(test|hemoglobin|rbc|wbc|platelet|count|examination|date|diagnosis|patient|age|sex|ref|dr\.|doctor|report|clinic|hospital)/i;

    lines.forEach((line, index) => {
        let trimmed = line.trim();
        if (!trimmed || trimmed.length < 4 || IGNORE_KEYWORDS.test(trimmed)) return;

        // Cleanup: Normalization
        trimmed = trimmed.replace(/^[\d\.\-\)\>]+\s*/, '') // Remove bullets/numbers
                        .replace(/[^\w\s\-\.\(\)\/]/g, ' ') // Remove weird symbols but keep basics
                        .replace(/\s+/g, ' ')
                        .trim();

        const hasForm = FORM_REGEX.test(trimmed);
        const hasDose = DOSE_REGEX.test(trimmed);
        const hasFreq = FREQ_REGEX.test(trimmed);
        const hasQty = STRIP_QTY_REGEX.test(trimmed);

        // Core logic: If it has at least two medicine markers, it's likely a medicine
        if (hasForm || (hasDose && hasFreq)) {
            const doseMatch = trimmed.match(DOSE_REGEX);
            const freqMatch = trimmed.match(FREQ_REGEX);
            const routeMatch = trimmed.match(ROUTE_REGEX);
            const formMatch = trimmed.match(FORM_REGEX);
            const qtyMatch = trimmed.match(STRIP_QTY_REGEX);

            let splitIndex = trimmed.length;
            if (doseMatch && doseMatch.index < splitIndex) splitIndex = doseMatch.index;
            if (formMatch && formMatch.index < splitIndex) splitIndex = formMatch.index;

            let nameCandidate = trimmed.substring(0, splitIndex).trim();
            
            // Further clean name
            nameCandidate = nameCandidate
                .replace(/rx\s*:?/i, '')
                .replace(/\.*$/, '') // Remove trailing dots
                .trim();

            if (nameCandidate.length > 2 && !seenNames.has(nameCandidate.toLowerCase())) {
                seenNames.add(nameCandidate.toLowerCase());
                
                // Confidence Scoring
                let confidence = 0.5;
                if (hasForm) confidence += 0.2;
                if (hasDose) confidence += 0.2;
                if (hasFreq) confidence += 0.1;

                medicines.push({
                    name: nameCandidate,
                    dosage: doseMatch ? doseMatch[0] : "As directed",
                    frequency: freqMatch ? freqMatch[0] : "Once daily",
                    route: routeMatch ? routeMatch[0] : "Oral",
                    quantity: qtyMatch ? qtyMatch[1] : null,
                    confidence: Math.min(confidence, 1.0),
                    needsReview: confidence < 0.7,
                    originalText: trimmed
                });
            }
>>>>>>> 892150e (Update: Backend/src/service/ocr.service.js, Frontend/src/components/MedicinalRecord.jsx and 1 others)
        }

        // Map the detailed medicines back to the format expected by the frontend
        if (parsedData && Array.isArray(parsedData.medicines)) {
            console.log(`Found ${parsedData.medicines.length} medicines in JSON.`);
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
