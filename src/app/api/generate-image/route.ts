import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const zai = await ZAI.create();
    
    const response = await zai.images.generations.create({
      prompt: `${prompt}, professional car dealership photo, clean background, high quality`,
      size: '1024x1024'
    });

    // The response returns base64 encoded image
    if (response.data && response.data[0]?.base64) {
      // Save the image and return URL
      const base64Data = response.data[0].base64;
      const timestamp = Date.now();
      const filename = `ai-${timestamp}.png`;
      
      // For now, we'll return the base64 data URL
      // In production, you'd save this to a file storage
      const dataUrl = `data:image/png;base64,${base64Data}`;
      
      return NextResponse.json({ url: dataUrl });
    }

    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
