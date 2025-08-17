import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper function to clean CSV values by removing carriage returns and trimming whitespace
function cleanCSVValue(value: string): string {
  return value.replace(/\r?\n/g, '').trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const geneSymbol = searchParams.get('gene');
    
    if (!geneSymbol) {
      return NextResponse.json({ error: 'Gene symbol is required' }, { status: 400 });
    }

    const csvPath = path.join(process.cwd(), 'src', 'data', '250725_TFactorTx_Master_Table_nf.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(';').map(cleanCSVValue);

    // Find the gene by symbol
    const geneLine = lines.slice(1).find(line => {
      const values = line.split(';').map(cleanCSVValue);
      // basic_gene_symbol is the second column (index 1)
      return values[1] === geneSymbol;
    });

    if (!geneLine) {
      console.log(`Gene ${geneSymbol} not found in CSV`);
      return NextResponse.json({ error: `Gene ${geneSymbol} not found` }, { status: 404 });
    }

    const values = geneLine.split(';').map(cleanCSVValue);
    
    // Create a comprehensive gene data object
    const geneData: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Convert numeric values but ensure they're stored as strings for consistency
      if (header.includes('rank') || header.includes('count') || header.includes('score')) {
        if (value === '#N/A' || value === '') {
          value = '';
        } else {
          const numValue = parseFloat(value);
          value = isNaN(numValue) ? value : numValue.toString();
        }
      }
      
      geneData[header] = value;
    });

    return NextResponse.json(geneData);
  } catch (error) {
    console.error('Error loading detailed CSV data:', error);
    return NextResponse.json({ error: 'Failed to load detailed CSV data' }, { status: 500 });
  }
}
