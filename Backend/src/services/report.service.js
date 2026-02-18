import { BaseService } from './BaseService.js';

export class ReportService extends BaseService {
    async createReport(data) {
        return await this.prisma.report.create({
            data: {
                reportName: data.reportName,
                reportUrl: data.reportUrl,
                userId: parseInt(data.userId),
                doctorId: data.doctorId ? parseInt(data.doctorId) : null
            }
        });
    }

    async getReportsByPatient(userId) {
        return await this.prisma.report.findMany({
            where: { userId: parseInt(userId) }
        });
    }

    async updateReport(id, data) {
        return await this.prisma.report.update({
            where: { reportId: parseInt(id) },
            data: {
                reportName: data.reportName,
                reportUrl: data.reportUrl
            }
        });
    }
}
