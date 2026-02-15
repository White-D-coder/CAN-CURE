import Tesseract from 'tesseract.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

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
        const data = await pdfParse(pdfBuffer);
        console.log("PDF extraction complete.");
        return data.text;
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Failed to extract text from PDF");
    }
};

export const parseMedicines = (text) => {
    // Basic heuristics to find medicine-like lines
    const lines = text.split('\n');
    const medicines = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        // Look for typical dosage units or keywords
        // Matches: "500mg", "10 ml", "Tablet", "Capsule", "1-0-1"
        const hasDosage = /\d+\s*(mg|g|ml|mcg)/i.test(trimmed);
        const hasForm = /(tablet|capsule|syrup|injection|pill)/i.test(trimmed);
        const hasFrequency = /(\d+-\d+-\d+|once|twice|thrice|daily)/i.test(trimmed);

        if ((hasDosage || hasForm || hasFrequency) && trimmed.length > 5) {
            medicines.push({
                id: index,
                name: trimmed.split(/\s\d/)[0].trim() || trimmed, // Try to grab name before numbers
                originalText: trimmed,
                timing: hasFrequency ? trimmed.match(/(\d+-\d+-\d+)/)?.[0] || 'Daily' : 'Daily',
                dosage: hasDosage ? trimmed.match(/\d+\s*(mg|g|ml|mcg)/i)?.[0] : 'As prescribed'
            });
        }
    });

    return medicines;
};
