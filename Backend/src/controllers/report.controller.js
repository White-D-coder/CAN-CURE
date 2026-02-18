import { BaseController } from './BaseController.js';
import { ReportService } from '../services/report.service.js';

export class ReportController extends BaseController {
    constructor() {
        super();
        this.reportService = new ReportService();
    }

    createReport = async (req, res) => {
        try {
            const report = await this.reportService.createReport(req.body);
            return this.success(res, report, "Report created successfully", 201);
        } catch (err) {
            return this.error(res, "Failed to create report", 500, err);
        }
    };

    getReportsByPatient = async (req, res) => {
        try {
            const userId = req.params.userId;
            const reports = await this.reportService.getReportsByPatient(userId);
            return this.success(res, reports);
        } catch (err) {
            return this.error(res, "Failed to fetch reports", 500, err);
        }
    };

    updateReport = async (req, res) => {
        try {
            const { id } = req.params;
            const report = await this.reportService.updateReport(id, req.body);
            return this.success(res, report);
        } catch (err) {
            return this.error(res, "Failed to update report", 500, err);
        }
    };
}
