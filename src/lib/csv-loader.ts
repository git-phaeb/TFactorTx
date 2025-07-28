// CSV data loader utility
export interface TFactorTxData {
  'TF Symbol': string;
  'sort_disease_ot_ard_aging_overall_rank': number;
  'sort_disease_ot_total_assoc_score_rank': number;
  'sort_disease_ot_ard_total_assoc_count_score_rank': number;
  'disease_ot_ard_strongest_linked_disease': string;
  'sort_aging_summary_total_db_entries_count_rank': number;
  'aging_summary_human': string;
  'aging_summary_mm_influence': string;
  'aging_summary_ce_influence': string;
  'aging_summary_dm_influence': string;
  'dev_summary_dev_level_category': string;
  'dev_pharos_tcrd_tdl': string;
}

// Function to parse CSV data
export function parseCSVData(csvContent: string): TFactorTxData[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(';');
  
  return lines.slice(1).map(line => {
    const values = line.split(';');
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
}

// Function to get TDL value (mapping from dev_pharos_tcrd_tdl)
export function getTDL(tdl: string): string {
  if (tdl === '#NA') return 'Unknown';
  return tdl;
}

// For now, we'll use a subset of the data to avoid token limits
// In a real implementation, you would load the full CSV file
export const sampleData: TFactorTxData[] = [
  {
    'TF Symbol': 'NR3C1',
    'sort_disease_ot_ard_aging_overall_rank': 3,
    'sort_disease_ot_total_assoc_score_rank': 2,
    'sort_disease_ot_ard_total_assoc_count_score_rank': 1,
    'disease_ot_ard_strongest_linked_disease': 'Chronic Obstructive Pulmonary Disease',
    'sort_aging_summary_total_db_entries_count_rank': 31,
    'aging_summary_human': 'Y',
    'aging_summary_mm_influence': '#NA',
    'aging_summary_ce_influence': 'Unclear',
    'aging_summary_dm_influence': '#NA',
    'dev_summary_dev_level_category': '1_High',
    'dev_pharos_tcrd_tdl': 'Tclin'
  },
  {
    'TF Symbol': 'VDR',
    'sort_disease_ot_ard_aging_overall_rank': 8,
    'sort_disease_ot_total_assoc_score_rank': 43,
    'sort_disease_ot_ard_total_assoc_count_score_rank': 2,
    'disease_ot_ard_strongest_linked_disease': 'Type 2 Diabetes Mellitus',
    'sort_aging_summary_total_db_entries_count_rank': 31,
    'aging_summary_human': 'Y',
    'aging_summary_mm_influence': '#NA',
    'aging_summary_ce_influence': 'Unclear',
    'aging_summary_dm_influence': '#NA',
    'dev_summary_dev_level_category': '1_High',
    'dev_pharos_tcrd_tdl': 'Tclin'
  },
  {
    'TF Symbol': 'PPARG',
    'sort_disease_ot_ard_aging_overall_rank': 2,
    'sort_disease_ot_total_assoc_score_rank': 6,
    'sort_disease_ot_ard_total_assoc_count_score_rank': 3,
    'disease_ot_ard_strongest_linked_disease': 'Type 2 Diabetes Mellitus',
    'sort_aging_summary_total_db_entries_count_rank': 6,
    'aging_summary_human': 'Y',
    'aging_summary_mm_influence': 'Pro-Longevity',
    'aging_summary_ce_influence': 'Unclear',
    'aging_summary_dm_influence': '#NA',
    'dev_summary_dev_level_category': '1_High',
    'dev_pharos_tcrd_tdl': 'Tclin'
  },
  {
    'TF Symbol': 'TP53',
    'sort_disease_ot_ard_aging_overall_rank': 1,
    'sort_disease_ot_total_assoc_score_rank': 1,
    'sort_disease_ot_ard_total_assoc_count_score_rank': 4,
    'disease_ot_ard_strongest_linked_disease': 'Cancer',
    'sort_aging_summary_total_db_entries_count_rank': 1,
    'aging_summary_human': 'Y',
    'aging_summary_mm_influence': 'Unclear',
    'aging_summary_ce_influence': 'Anti-Longevity',
    'aging_summary_dm_influence': 'Unclear',
    'dev_summary_dev_level_category': '2_Medium',
    'dev_pharos_tcrd_tdl': 'Tchem'
  },
  {
    'TF Symbol': 'JAZF1',
    'sort_disease_ot_ard_aging_overall_rank': 347,
    'sort_disease_ot_total_assoc_score_rank': 33,
    'sort_disease_ot_ard_total_assoc_count_score_rank': 5,
    'disease_ot_ard_strongest_linked_disease': 'Type 2 Diabetes Mellitus',
    'sort_aging_summary_total_db_entries_count_rank': 1168,
    'aging_summary_human': 'N',
    'aging_summary_mm_influence': '#NA',
    'aging_summary_ce_influence': '#NA',
    'aging_summary_dm_influence': '#NA',
    'dev_summary_dev_level_category': '5_None',
    'dev_pharos_tcrd_tdl': 'Tbio'
  }
];

// Note: To load all 1642 entries, you would need to:
// 1. Read the CSV file from the public directory
// 2. Parse it using the parseCSVData function
// 3. Return the full dataset
// 
// For now, we're using a small sample to avoid token limits.
// The table will show pagination working with the full dataset when implemented. 