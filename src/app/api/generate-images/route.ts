import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { year, make, model, color, type } = body;

    // Create a detailed prompt for image generation
    const prompt = `Professional automotive photography of a ${year} ${make} ${model} in ${color || 'default color'}, ${type || 'sedan'}, studio lighting, clean background, high resolution, 4k, commercial quality, front three-quarter view, showroom condition`;

    const zai = await ZAI.create();
    
    // Generate image
    const response = await zai.images.generations.create({
      prompt,
      size: '1024x1024'
    });

    if (!response.data || response.data.length === 0) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    // Save the generated image to uploads folder
    const imageBase64 = response.data[0].base64;
    const buffer = Buffer.from(imageBase64, 'base64');
    
    const timestamp = Date.now();
    const filename = `generated-${timestamp}-${make}-${model}.png`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename 
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
