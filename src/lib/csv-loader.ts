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

// Sample data for testing - this matches the actual CSV structure
export const sampleData: TFactorTxData[] = [
  {
    'TF Symbol': 'TP53',
    'sort_disease_ot_ard_aging_overall_rank': 1,
    'sort_disease_ot_total_assoc_score_rank': 1,
    'sort_disease_ot_ard_total_assoc_count_score_rank': 4,
    'disease_ot_ard_strongest_linked_disease': 'Cancer',
    'sort_aging_summary_total_db_entries_count_rank': 1,
    'aging_summary_human': 'Yes',
    'aging_summary_mm_influence': 'Unclear',
    'aging_summary_ce_influence': 'Anti-Longevity',
    'aging_summary_dm_influence': 'Unclear',
    'dev_summary_dev_level_category': 'Medium',
    'dev_pharos_tcrd_tdl': 'Tchem'
  },
  {
    'TF Symbol': 'PPARG',
    'sort_disease_ot_ard_aging_overall_rank': 2,
    'sort_disease_ot_total_assoc_score_rank': 6,
    'sort_disease_ot_ard_total_assoc_count_score_rank': 3,
    'disease_ot_ard_strongest_linked_disease': 'Type 2 Diabetes Mellitus',
    'sort_aging_summary_total_db_entries_count_rank': 6,
    'aging_summary_human': 'Yes',
    'aging_summary_mm_influence': 'Pro-Longevity',
    'aging_summary_ce_influence': 'Unclear',
    'aging_summary_dm_influence': 'None',
    'dev_summary_dev_level_category': 'High',
    'dev_pharos_tcrd_tdl': 'Tclin'
  },
  {
    'TF Symbol': 'NR3C1',
    'sort_disease_ot_ard_aging_overall_rank': 3,
    'sort_disease_ot_total_assoc_score_rank': 2,
    'sort_disease_ot_ard_total_assoc_count_score_rank': 1,
    'disease_ot_ard_strongest_linked_disease': 'Chronic Obstructive Pulmonary Disease',
    'sort_aging_summary_total_db_entries_count_rank': 31,
    'aging_summary_human': 'Yes',
    'aging_summary_mm_influence': 'None',
    'aging_summary_ce_influence': 'Unclear',
    'aging_summary_dm_influence': 'None',
    'dev_summary_dev_level_category': 'High',
    'dev_pharos_tcrd_tdl': 'Tclin'
  }
];

// Note: The actual CSV file contains 1642 entries with the following structure:
// Gene Name;Overall Rank;All Diseases Rank;ARDs Rank;Strongest Linked ARD;Aging Rank;Human Link Y/N;M. musculus Link;C. elegans Link;D. melanogaster Link;Development Level;Pharos TDL
// 
// The API route maps these to the expected interface names for compatibility. 