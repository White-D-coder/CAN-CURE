import { NextResponse } from 'next/server';

// Mock user database - in production, this would be a real database
const users = [
  {
    id: '1',
    name: 'Dr. Emily Richards',
    email: 'doctor@cancure.com',
    password: 'password123', // In production, this would be hashed
    role: 'doctor',
    specialization: 'Oncology',
    licenseNumber: 'MD12345',
    approved: true,
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@cancure.com',
    password: 'admin123', // In production, this would be hashed
    role: 'admin',
  },
  {
    id: '3',
    name: 'John Patient',
    email: 'patient@cancure.com',
    password: 'patient123', // In production, this would be hashed
    role: 'user',
  },
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password (in production, use bcrypt or similar)
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if doctor is approved
    if (user.role === 'doctor' && !user.approved) {
      return NextResponse.json(
        { message: 'Your doctor account is pending approval' },
        { status: 403 }
      );
    }

    // Create token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
