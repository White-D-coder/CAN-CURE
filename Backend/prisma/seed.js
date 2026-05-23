import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const doctorsData = [
    {
      name: 'Dr. Sarah Wilson',
      specialist: 'Oncologist',
      experience: 15,
      email: 'sarah.wilson@medcan.com',
      password: 'password123'
    },
    {
      name: 'Dr. James Chen',
      specialist: 'Hematologist',
      experience: 12,
      email: 'james.chen@medcan.com',
      password: 'password123'
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialist: 'Radiation Oncologist',
      experience: 10,
      email: 'emily.rodriguez@medcan.com',
      password: 'password123'
    },
    {
      name: 'Dr. Michael Chang',
      specialist: 'Surgical Oncologist',
      experience: 20,
      email: 'michael.chang@medcan.com',
      password: 'password123'
    },
    {
      name: 'Dr. Lisa Patel',
      specialist: 'Pediatric Oncologist',
      experience: 8,
      email: 'lisa.patel@medcan.com',
      password: 'password123'
    }
  ];

  // Helper to generate next 7 days dates
  const getNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };
  
  const dates = getNext7Days();
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  for (const doc of doctorsData) {
    const doctor = await prisma.doctor.upsert({
      where: { email: doc.email },
      update: {},
      create: doc,
    });
    console.log(`Created/Updated doctor: ${doctor.name}`);

    // Create slots for the next 7 days
    for (const date of dates) {
        for (const time of times) {
            // Check if slot exists to avoid duplicates
            const existingSlot = await prisma.timeSlot.findFirst({
                where: {
                    doctorId: doctor.doctorId,
                    date: date,
                    time: time
                }
            });

            if (!existingSlot) {
                await prisma.timeSlot.create({
                    data: {
                        date: date,
                        time: time,
                        status: 'AVAILABLE',
                        doctorId: doctor.doctorId
                    }
                });
            }
        }
    }
    console.log(`Seeded slots for ${doctor.name}`);
  }

  // Seed Admins
  const admins = [
    { username: 'admin@canqure.com', password: 'admin123', role: 'admin' },
    { username: 'hospital@canqure.com', password: 'hospital123', role: 'hospital_admin' }
  ];

  for (const adminData of admins) {
    await prisma.admin.upsert({
      where: { username: adminData.username },
      update: { role: adminData.role },
      create: adminData,
    });
  }
  console.log('Seeded demo admins');

  // Seed Patient
  const patientData = {
    username: 'patient_demo',
    email: 'patient@canqure.com',
    password: await bcrypt.hash('patient123', 10),
    name: 'John Patient'
  };

  const patient = await prisma.user.upsert({
    where: { email: patientData.email },
    update: {},
    create: patientData,
  });
  console.log('Seeded demo patient');

  // Seed Mock Appointments for Routing Dashboard
  const docForApt = await prisma.doctor.findFirst();
  if (docForApt && patient) {
    const mockAppointments = [
      { date: '2026-06-01', time: '10:00', patientName: 'James Morrison', userId: patient.id, doctorId: docForApt.doctorId, urgencyLevel: 'URGENT', status: 'PENDING' },
      { date: '2026-06-02', time: '11:00', patientName: 'Clara Oswald', userId: patient.id, doctorId: docForApt.doctorId, urgencyLevel: 'NORMAL', status: 'ACCEPTED' },
      { date: '2026-06-03', time: '14:00', patientName: 'Robert Baratheon', userId: patient.id, doctorId: docForApt.doctorId, urgencyLevel: 'NORMAL', status: 'PENDING' },
    ];

    for (const appt of mockAppointments) {
      await prisma.appointment.create({ data: appt }).catch(e => console.log("Appointment exist or err", e.message));
    }
    console.log('Seeded mock appointments');
  }

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
