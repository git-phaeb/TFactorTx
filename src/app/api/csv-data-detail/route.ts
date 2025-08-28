import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering for this route since it uses request.url
export const dynamic = 'force-dynamic';

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
    
    // Parse CSV properly handling quoted fields with semicolons
    function parseCSVLine(line: string): string[] {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ';' && !inQuotes) {
          result.push(cleanCSVValue(current));
          current = '';
        } else {
          current += char;
        }
      }
      
      // Add the last field
      result.push(cleanCSVValue(current));
      return result;
    }

    // Only treat a value as numeric if it is strictly a single number
    function isStrictNumber(value: string): boolean {
      return /^-?\d+(?:\.\d+)?$/.test(value.trim());
    }
    
    const headers = parseCSVLine(lines[0]);

    // Find the gene by symbol
    const geneLine = lines.slice(1).find(line => {
      const values = parseCSVLine(line);
      // basic_gene_symbol is the second column (index 1)
      return values[1] === geneSymbol;
    });

    if (!geneLine) {
      console.log(`Gene ${geneSymbol} not found in CSV`);
      return NextResponse.json({ error: `Gene ${geneSymbol} not found` }, { status: 404 });
    }

    const values = parseCSVLine(geneLine);
    
    // Create a comprehensive gene data object
    const geneData: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      let value = values[index] || '';

      // Convert numeric-looking values but preserve multi-valued fields (e.g., "4;2")
      if (header.includes('rank') || header.includes('count') || header.includes('score')) {
        if (value === '#N/A' || value === '') {
          value = '';
        } else if (isStrictNumber(value)) {
          const numValue = parseFloat(value);
          value = isNaN(numValue) ? value : numValue.toString();
        }
        // If not a strict number, leave the original string intact
      }

      geneData[header] = value;
    });

    return NextResponse.json(geneData);
  } catch (error) {
    console.error('Error loading detailed CSV data:', error);
    return NextResponse.json({ error: 'Failed to load detailed CSV data' }, { status: 500 });
  }
}
