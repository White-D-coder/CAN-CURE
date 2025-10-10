import { NextResponse } from 'next/server'
import supabase from '@/supabaseClient'

// GET /api/doctors -> returns approved cancer specialists with coordinates
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('id,name,specialization,latitude,longitude,rating,experience,success_rate,available,next_available,address,city,country')
      .eq('approved', true)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ doctors: data || [] })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

