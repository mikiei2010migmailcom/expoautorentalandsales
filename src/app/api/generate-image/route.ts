import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

const execAsync = promisify(exec);

// Set max duration for this API route
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Generating image for prompt:', prompt);
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `ai-${timestamp}.png`;
    const outputPath = path.join(uploadDir, filename);
    
    // Use CLI tool to generate image
    const fullPrompt = `${prompt}, professional car dealership photo, clean background, high quality`;
    const { stdout, stderr } = await execAsync(
      `z-ai-generate -p "${fullPrompt.replace(/"/g, '\\"')}" -o "${outputPath}" -s 1024x1024`,
      { timeout: 60000 }
    );
    
    console.log('CLI stdout:', stdout);
    if (stderr) console.log('CLI stderr:', stderr);
    
    // Check if file was created
    if (existsSync(outputPath)) {
      const publicUrl = `/uploads/${filename}`;
      console.log('Successfully generated image:', publicUrl);
      return NextResponse.json({ url: publicUrl });
    }
    
    return NextResponse.json({ error: 'Failed to generate image - file not created' }, { status: 500 });
  } catch (error: any) {
    console.error('Image generation error:', error);
    console.error('Error message:', error?.message);
    return NextResponse.json({ 
      error: 'Failed to generate image', 
      details: error?.message || 'Unknown error' 
    }, { status: 500 });
  }
}
