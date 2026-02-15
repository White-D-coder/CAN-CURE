import { extractTextFromImage, extractTextFromPdf, parseMedicines } from '../service/ocr.service.js';
import { createMedicineEvents } from '../service/calendar.service.js';

export const uploadReport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log(`Received file: ${req.file.originalname}, Type: ${req.file.mimetype}`);

        let text = '';
        if (req.file.mimetype === 'application/pdf') {
            text = await extractTextFromPdf(req.file.buffer);
        } else {
            text = await extractTextFromImage(req.file.buffer);
        }

        console.log("Extracted Text Length:", text.length);

        const medicines = parseMedicines(text);

        return res.status(200).json({
            message: "Report processed successfully",
            text,
            medicines
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ message: "Failed to process report", error: error.message });
    }
};

export const syncCalendar = async (req, res) => {
    try {
        const { medicines, userEmail } = req.body;
        if (!medicines || !Array.isArray(medicines)) {
            return res.status(400).json({ message: "Invalid medicines data" });
        }

        const result = await createMedicineEvents(medicines, userEmail);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Sync Error:", error);
        return res.status(500).json({ message: "Sync failed", error: error.message });
    }
};
