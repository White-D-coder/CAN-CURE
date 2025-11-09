import { NextResponse } from 'next/server';

// Mock user database - in production, this would be a real database
const users = [
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

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Decode token (in production, verify JWT)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, email] = decoded.split(':');

    // Find user
    const user = users.find(u => u.id === userId && u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}
