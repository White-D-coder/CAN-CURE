import { NextResponse } from 'next/server';

// Mock user database - in production, this would be a real database
let users = [
  {
    id: '1',
    name: 'Dr. Emily Richards',
    email: 'doctor@cancure.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Oncology',
    licenseNumber: 'MD12345',
    approved: true,
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@cancure.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '3',
    name: 'John Patient',
    email: 'patient@cancure.com',
    password: 'patient123',
    role: 'user',
  },
];

export async function POST(request) {
  try {
    const { name, email, password, role, specialization, licenseNumber } = await request.json();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password, // In production, hash this password
      role,
      approved: role !== 'doctor', // Doctors need approval, users don't
    };

    // Add role-specific fields
    if (role === 'doctor') {
      newUser.specialization = specialization;
      newUser.licenseNumber = licenseNumber;
    }

    // Add to users array (in production, save to database)
    users.push(newUser);

    // Send email notification for doctor approval (in production, use real email service)
    if (role === 'doctor') {
      console.log(`Doctor registration: ${name} (${email}) needs approval`);
      // In production: send email to admin about new doctor registration
    }

    return NextResponse.json({
      message: role === 'doctor' 
        ? 'Registration successful! Your doctor account is pending admin approval.'
        : 'Registration successful! You can now login.',
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
