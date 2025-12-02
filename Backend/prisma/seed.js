import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Clear existing data
    await prisma.report.deleteMany();
    await prisma.medicine.deleteMany();
    await prisma.cancerType.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.admin.deleteMany();

    console.log('Deleted existing data.');

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
        data: {
            username: 'admin',
            password: adminPassword,
        },
    });

    // Create Doctors
    const doctorPassword = await bcrypt.hash('doctor123', 10);

    const drSmith = await prisma.doctor.create({
        data: {
            name: 'Dr. Sarah Smith',
            specialist: 'Oncologist',
            experience: 15,
            email: 'sarah.smith@cancure.com',
            password: doctorPassword,
        },
    });

    const drJones = await prisma.doctor.create({
        data: {
            name: 'Dr. Michael Jones',
            specialist: 'Radiologist',
            experience: 10,
            email: 'michael.jones@cancure.com',
            password: doctorPassword,
        },
    });

    const drPatel = await prisma.doctor.create({
        data: {
            name: 'Dr. Anika Patel',
            specialist: 'Hematologist',
            experience: 8,
            email: 'anika.patel@cancure.com',
            password: doctorPassword,
        },
    });

    // Create Patients
    const patientPassword = await bcrypt.hash('patient123', 10);

    const bhavya = await prisma.user.create({
        data: {
            name: 'Bhavya Jain',
            email: 'bhavya.jain@example.com',
            password: patientPassword,
            CancerType: {
                create: [
                    {
                        name: 'Lung Cancer',
                        stage: 2,
                        description: 'Non-small cell lung cancer detected in right lobe.',
                        symptoms: 'Persistent cough, chest pain.',
                        treatments: 'Chemotherapy, Radiation Therapy',
                    },
                ],
            },
            medicines: {
                create: [
                    {
                        medName: 'Cisplatin',
                        description: 'Chemotherapy drug',
                        dose: '50mg',
                        frequency: 'Once every 3 weeks',
                        startDate: new Date('2023-01-01'),
                        endDate: new Date('2023-06-01'),
                    },
                    {
                        medName: 'Ondansetron',
                        description: 'Anti-nausea medication',
                        dose: '8mg',
                        frequency: 'Twice daily',
                        startDate: new Date('2023-01-01'),
                        endDate: new Date('2023-06-01'),
                    },
                ],
            },
            Reports: {
                create: [
                    {
                        reportName: 'Initial CT Scan',
                        reportUrl: 'https://example.com/ct-scan.pdf',
                        date: new Date('2022-12-15'),
                        doctorId: drJones.doctorId,
                    },
                    {
                        reportName: 'Blood Work - Jan',
                        reportUrl: 'https://example.com/blood-jan.pdf',
                        date: new Date('2023-01-15'),
                        doctorId: drSmith.doctorId,
                    },
                ],
            },
        },
    });

    const deeptanu = await prisma.user.create({
        data: {
            name: 'Deeptanu',
            email: 'deeptanu@example.com',
            password: patientPassword,
            CancerType: {
                create: [
                    {
                        name: 'Breast Cancer',
                        stage: 1,
                        description: 'Invasive ductal carcinoma.',
                        symptoms: 'Lump in breast.',
                        treatments: 'Lumpectomy, Hormone Therapy',
                    },
                ],
            },
            medicines: {
                create: [
                    {
                        medName: 'Tamoxifen',
                        description: 'Hormone therapy',
                        dose: '20mg',
                        frequency: 'Daily',
                        startDate: new Date('2023-02-01'),
                        endDate: new Date('2028-02-01'),
                    },
                ],
            },
            Reports: {
                create: [
                    {
                        reportName: 'Mammogram',
                        reportUrl: 'https://example.com/mammogram.pdf',
                        date: new Date('2023-01-20'),
                        doctorId: drJones.doctorId,
                    },
                ],
            },
        },
    });

    const shaurya = await prisma.user.create({
        data: {
            name: 'Shaurya',
            email: 'shaurya@example.com',
            password: patientPassword,
            CancerType: {
                create: [
                    {
                        name: 'Prostate Cancer',
                        stage: 2,
                        description: 'Adenocarcinoma.',
                        symptoms: 'Urinary issues.',
                        treatments: 'Observation',
                    },
                ],
            },
            medicines: [],
            Reports: [],
        },
    });

    // Create Appointments
    await prisma.appointment.createMany({
        data: [
            {
                date: '2023-10-25',
                time: '10:00 AM',
                patientName: bhavya.name,
                doctorId: drSmith.doctorId,
                userId: bhavya.id,
            },
            {
                date: '2023-10-26',
                time: '02:00 PM',
                patientName: deeptanu.name,
                doctorId: drSmith.doctorId,
                userId: deeptanu.id,
            },
            {
                date: '2023-10-27',
                time: '11:00 AM',
                patientName: shaurya.name,
                doctorId: drPatel.doctorId,
                userId: shaurya.id,
            },
        ],
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
