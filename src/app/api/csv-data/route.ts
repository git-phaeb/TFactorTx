import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper function to clean CSV values by removing carriage returns and trimming whitespace
function cleanCSVValue(value: string): string {
  return value.replace(/\r?\n/g, '').trim();
}

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'src', 'data', '250726_TFactorTx_Master_Table_nf_Overview_for_CSV.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(';').map(cleanCSVValue);

    const data = lines.slice(1).map(line => {
      const values = line.split(';').map(cleanCSVValue);
      return {
        'TF Symbol': values[0] || '',
        'sort_disease_ot_ard_aging_overall_rank': parseInt(values[1]) || 0,
        'sort_disease_ot_total_assoc_score_rank': parseInt(values[2]) || 0,
        'sort_disease_ot_ard_total_assoc_count_score_rank': parseInt(values[3]) || 0,
        'disease_ot_ard_strongest_linked_disease': values[4] || '',
        'sort_aging_summary_total_db_entries_count_rank': parseInt(values[5]) || 0,
        'aging_summary_human': values[6] || '',
        'aging_summary_mm_influence': values[7] || '',
        'aging_summary_ce_influence': values[8] || '',
        'aging_summary_dm_influence': values[9] || '',
        'dev_summary_dev_level_category': values[10] || '',
        'dev_pharos_tcrd_tdl': values[11] || '',
      };
    });

    return NextResponse.json({ 
      data, 
      total: data.length,
      columnNames: headers 
    });
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return NextResponse.json({ error: 'Failed to load CSV data' }, { status: 500 });
  }
} 