import { BaseController } from './BaseController.js';
import { MedicinalService } from '../services/medicinal.service.js';

export class MedicinalController extends BaseController {
    constructor() {
        super();
        this.medicinalService = new MedicinalService();
    }

    uploadReport = (upload) => async (req, res) => {
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Multer Error / Unknown Error:', err);
                return res.status(500).json({ success: false, message: err.message || 'Unknown error occurred' });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            console.log('req.file:', req.file);
            console.log('req.body:', req.body);

            try {
                // Keep the exact business logic for processing OCR if it was there
                const result = await this.medicinalService.processReport(req.file);

                return res.status(200).json({
                    success: true,
                    filename: req.file.filename,
                    filepath: req.file.path,
                    size: req.file.size,
                    text: result.text,
                    medicines: result.medicines
                });
            } catch (serviceError) {
                console.error("Service Error:", serviceError);
                return res.status(500).json({ success: false, message: "Failed to process report" });
            }
        });
    };

    syncCalendar = async (req, res) => {
        try {
            const { medicines, userEmail } = req.body;
            if (!medicines || !Array.isArray(medicines)) {
                return this.error(res, "Invalid medicines data", 400);
            }

            const result = await this.medicinalService.syncCalendar(medicines, userEmail);
            return this.success(res, result);
        } catch (error) {
            console.error("Sync Error:", error);
            return this.error(res, "Sync failed", 500, error);
        }
    };

    predictRisk = async (req, res) => {
        try {
            const result = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body)
            });

            if (!result.ok) {
                const err = await result.text();
                throw new Error(err);
            }

            const data = await result.json();
            return this.success(res, data);
        } catch (error) {
            console.error("Risk Prediction Error:", error);
            return this.error(res, "Failed to predict risk", 500, error);
        }
    };
}
