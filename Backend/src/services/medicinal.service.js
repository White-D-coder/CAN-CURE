import { BaseService } from './BaseService.js';
import { extractTextFromImage, extractTextFromPdf, parseMedicines } from '../service/ocr.service.js';
import { createMedicineEvents } from '../service/calendar.service.js';

export class MedicinalService extends BaseService {
    async processReport(file) {
        let text = '';
        if (file.mimetype === 'application/pdf') {
            text = await extractTextFromPdf(file.buffer);
        } else {
            text = await extractTextFromImage(file.buffer);
        }

        const medicines = parseMedicines(text);

        return {
            text,
            medicines
        };
    }

    async syncCalendar(medicines, userEmail) {
        return await createMedicineEvents(medicines, userEmail);
    }
}
