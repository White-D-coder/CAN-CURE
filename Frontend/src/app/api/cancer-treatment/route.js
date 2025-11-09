import { NextResponse } from 'next/server';

// Mock AI responses for cancer treatment queries
const responses = {
  'symptoms': [
    'Based on the symptoms you\'ve described, I recommend consulting with an oncologist for proper evaluation. Early detection is crucial for effective treatment.',
    'These symptoms could indicate various conditions. Please schedule an appointment with a healthcare professional for accurate diagnosis.',
  ],
  'treatment': [
    'Cancer treatment options include surgery, chemotherapy, radiation therapy, immunotherapy, and targeted therapy. The best approach depends on the type and stage of cancer.',
    'Modern cancer treatments have significantly improved survival rates. Your oncologist will recommend the most appropriate treatment plan based on your specific case.',
  ],
  'support': [
    'We understand this is a difficult time. Our support groups and counseling services can help you and your family cope with the emotional aspects of cancer treatment.',
    'Don\'t hesitate to reach out to our patient support team. We\'re here to help with any questions or concerns you may have.',
  ],
  'default': [
    'I\'m here to help with your cancer-related questions. Could you please provide more specific information about what you\'d like to know?',
    'For the most accurate and personalized information, I recommend consulting directly with our medical professionals.',
    'Our team of specialists is available to provide comprehensive care and answer your questions in detail.',
  ],
};

function getResponseCategory(query) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('symptom') || lowerQuery.includes('pain') || lowerQuery.includes('feel')) {
    return 'symptoms';
  }
  if (lowerQuery.includes('treatment') || lowerQuery.includes('therapy') || lowerQuery.includes('chemotherapy')) {
    return 'treatment';
  }
  if (lowerQuery.includes('support') || lowerQuery.includes('help') || lowerQuery.includes('counseling')) {
    return 'support';
  }
  
  return 'default';
}

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { message: 'Please provide a query' },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const category = getResponseCategory(query);
    const categoryResponses = responses[category];
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

    return NextResponse.json({
      answer: randomResponse,
      category: category,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
