'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DetailedGeneData {
  [key: string]: any;
}

export default function GeneDetailPage() {
  const params = useParams();
  const [geneData, setGeneData] = useState<DetailedGeneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const geneSymbol = params.gene as string;

  useEffect(() => {
    const fetchGeneData = async () => {
      try {
        const response = await fetch(`/api/csv-data-detail?gene=${geneSymbol}`);
        if (!response.ok) {
          throw new Error('Failed to fetch gene data');
        }
        const data = await response.json();
        setGeneData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (geneSymbol) {
      fetchGeneData();
    }
  }, [geneSymbol]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span>Loading gene data...</span>
        </div>
      </div>
    );
  }

  if (error || !geneData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Gene data not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-3 space-y-3 flex-grow">
      {/* Header */}
      <div className="flex items-center justify-between -mt-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {geneData.basic_protein_name ? 
              geneData.basic_protein_name.split('(')[0].trim() : 
              geneSymbol
            }
          </h1>
        </div>
      </div>



      {/* TFactorTx IDs and Classification Section - Side by Side */}
      <div className="grid grid-cols-3 gap-3">
        {/* TFactorTx IDs Section - 1/3 width */}
        <div className="col-span-1">
          <div className="rounded-lg overflow-hidden border-2 border-gray-300">
            {/* Header Row - spans full width */}
            <div className="bg-blue-100 border-b border-gray-200">
              <div className="text-blue-900 text-sm font-semibold px-2 py-1">TFactorTx IDs</div>
            </div>
            {/* Content - Table structure */}
            <div>
              {/* Column Headers Row - Grey */}
              <div className="grid grid-cols-2 divide-x bg-gray-100">
                <div className="p-2">
                  <div className="font-semibold text-gray-700 text-xs">TFactorTx ID</div>
                </div>
                <div className="p-2">
                  <div className="font-semibold text-gray-700 text-xs">TFactorTx Gene Name</div>
                </div>
              </div>
              {/* Data Row - White */}
              <div className="grid grid-cols-2 divide-x bg-white">
                <div className="p-2">
                  <div className="text-gray-900 text-xs">{geneData.basic_tfactortx_id || 'N/A'}</div>
                </div>
                <div className="p-2">
                  <div className="text-gray-900 text-xs">{geneData.basic_gene_symbol || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Classification Section - 2/3 width */}
        <div className="col-span-2">
          <div className="rounded-lg overflow-hidden border-2 border-gray-300">
            {/* Header Row - spans full width */}
            <div className="bg-blue-100 border-b border-gray-200">
              <div className="text-blue-900 text-sm font-semibold px-2 py-1">
                Classification (based on{' '}
                <a 
                  href="http://tfclass.bioinf.med.uni-goettingen.de/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  TFClass
                </a>
                )
              </div>
            </div>
            {/* Content - Table structure */}
            <div>
              {/* Column Headers Row - Grey */}
              <div className="grid grid-cols-3 divide-x bg-gray-100">
                <div className="p-2">
                  <div className="font-semibold text-gray-700 text-xs">Superclass</div>
                </div>
                <div className="p-2">
                  <div className="font-semibold text-gray-700 text-xs">Class</div>
                </div>
                <div className="p-2">
                  <div className="text-gray-900 text-xs">Family</div>
                </div>
              </div>
              {/* Data Row - White */}
              <div className="grid grid-cols-3 divide-x bg-white">
                <div className="p-2">
                  <div className="text-gray-900 text-xs">{geneData.basic_tf_superclass || 'N/A'}</div>
                </div>
                <div className="p-2">
                  <div className="text-gray-900 text-xs">{geneData.basic_tf_class || 'N/A'}</div>
                </div>
                <div className="p-2">
                  <div className="text-gray-900 text-xs">{geneData.basic_tf_family || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Database Links Section */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-300">
        {/* Header Row - spans full width */}
        <div className="bg-blue-100 border-b border-gray-200">
          <div className="text-blue-900 text-sm font-semibold px-2 py-1">External Database IDs and Linkouts</div>
        </div>
        {/* Content - Table structure */}
        <div>
          {/* Column Headers Row - Grey */}
          <div className="grid grid-cols-6 divide-x bg-gray-100">
            <div className="p-2">
              <div className="font-semibold text-gray-700 text-xs">Ensembl Gene ID and Linkout</div>
            </div>
            <div className="p-2">
              <div className="font-semibold text-gray-700 text-xs">HGNC ID and Linkout</div>
            </div>
            <div className="p-2">
              <div className="font-semibold text-gray-700 text-xs">NCBI Gene ID and Linkout</div>
            </div>
            <div className="p-2">
              <div className="font-semibold text-gray-700 text-xs">UniProt ID and Linkout</div>
            </div>
            <div className="p-2">
              <div className="font-semibold text-gray-700 text-xs">JASPAR Linkout (via UniProt ID)</div>
            </div>
            <div className="p-2">
              <div className="font-semibold text-gray-700 text-xs">Open Targets Linkout (via ENSG ID)</div>
            </div>
          </div>
          {/* Data Row - White */}
          <div className="grid grid-cols-6 divide-x bg-white">
            <div className="p-2">
              <div className="text-gray-900 text-xs">
                {geneData.basic_ensembl_gene_id && geneData.basic_ensembl_gene_id !== '#N/A' ? (
                  <a 
                    href={`https://ensembl.org/Homo_sapiens/Gene/Summary?g=${geneData.basic_ensembl_gene_id}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {geneData.basic_ensembl_gene_id}
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
            <div className="p-2">
              <div className="text-gray-900 text-xs">
                {geneData.basic_hgnc_id && geneData.basic_hgnc_id !== '#N/A' ? (
                  <a 
                    href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${geneData.basic_hgnc_id}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {geneData.basic_hgnc_id}
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
            <div className="p-2">
              <div className="text-gray-900 text-xs">
                {geneData.basic_ncbi_gene_id && geneData.basic_ncbi_gene_id !== '#N/A' ? (
                  <a 
                    href={`https://www.ncbi.nlm.nih.gov/gene/${geneData.basic_ncbi_gene_id}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {geneData.basic_ncbi_gene_id}
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
            <div className="p-2">
              <div className="text-gray-900 text-xs">
                {geneData.basic_uniprot_id && geneData.basic_uniprot_id !== '#N/A' ? (
                  <a 
                    href={`https://www.uniprot.org/uniprot/${geneData.basic_uniprot_id}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {geneData.basic_uniprot_id}
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
            <div className="p-2">
              <div className="text-gray-900 text-xs">
                {geneData.basic_jaspar_url && geneData.basic_jaspar_url !== '#N/A' ? (
                  <a 
                    href={geneData.basic_jaspar_url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                    title={geneData.basic_jaspar_url}
                  >
                    JASPAR
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
            <div className="p-2">
              <div className="text-gray-900 text-xs">
                {geneData.basic_open_targets_url && geneData.basic_open_targets_url !== '#N/A' ? (
                  <a 
                    href={geneData.basic_open_targets_url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                    title={geneData.basic_open_targets_url}
                  >
                    Open Targets
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target-Disease Module (based on Open Targets) Section */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-300">
        {/* Header Row - spans full width */}
        <div className="bg-blue-100 border-b border-gray-200">
          <div className="text-blue-900 text-sm font-semibold px-2 py-1">
            Target-Disease Module (based on{' '}
            <a 
              href="https://platform.opentargets.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Open Targets
            </a>
            )
          </div>
        </div>
        {/* Content - Table structure */}
        <div>
          {/* Single Grid Container for all rows */}
          <div className="grid grid-cols-7 divide-x">
            {/* Column 1: Linkout header (Row 1 only) */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-2">
                <div className="font-semibold text-gray-700 text-xs">Linkout</div>
              </div>
            </div>

            {/* Column 2: Total Disease Associations */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-2">
                <div className="font-semibold text-gray-700 text-xs">Total Disease Associations Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 3: Low Confidence */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-2">
                <div className="font-semibold text-gray-700 text-xs">Low Confidence Associations Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 4: Medium Confidence */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-2">
                <div className="font-semibold text-gray-700 text-xs">Medium Confidence Assoc Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 5: High Confidence */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-2">
                <div className="font-semibold text-gray-700 text-xs">High Confidence Associations Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 6: Representative ARD */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-2">
                <div className="font-semibold text-gray-700 text-xs">Representative ARD Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 7: Best Evidenced Linked Representative ARD */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-2">
                <div className="font-semibold text-gray-700 text-xs">Best Evidenced Linked Representative ARD</div>
              </div>
            </div>

            {/* Column 1: TP53 Disease Associations - spans rows 2-4 */}
            <div className="col-span-1 row-span-3 bg-white">
              <div className="p-2 h-full flex items-center">
                <div className="text-gray-900 text-xs">
                  <a 
                    href={`https://platform.opentargets.org/target/${geneData.basic_ensembl_gene_id}/associations`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {geneSymbol} Disease Associations
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Total Disease Associations Count data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_total_assoc_count && geneData.disease_ot_total_assoc_count_norm ? 
                    `${geneData.disease_ot_total_assoc_count} (${geneData.disease_ot_total_assoc_count_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 3: Low Confidence Associations Count data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_lowconf_count && geneData.disease_ot_lowconf_count_norm ? 
                    `${geneData.disease_ot_lowconf_count} (${geneData.disease_ot_lowconf_count_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 4: Medium Confidence Assoc Count data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_modconf_count && geneData.disease_ot_modconf_count_norm ? 
                    `${geneData.disease_ot_modconf_count} (${geneData.disease_ot_modconf_count_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 5: High Confidence Associations Count data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_hiconf_count && geneData.disease_ot_hiconf_count_norm ? 
                    `${geneData.disease_ot_hiconf_count} (${geneData.disease_ot_hiconf_count_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 6: Representative ARD Count data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_ard_disease_count && geneData.disease_ot_ard_disease_count_norm ? 
                    `${geneData.disease_ot_ard_disease_count} (${geneData.disease_ot_ard_disease_count_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 7: Best Evidenced Linked Representative ARD data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_ard_strongest_linked_disease && geneData.disease_ot_ard_strongest_linked_disease !== '#N/A' ? 
                    geneData.disease_ot_ard_strongest_linked_disease : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 2: Secondary header for Total Disease Associations */}
            <div className="col-span-1 bg-gray-50">
              <div className="p-2">
                <div className="text-xs text-gray-600 font-medium">Aggregated Association Score (Normalized Value)</div>
              </div>
            </div>

            {/* Column 3: Secondary header for Low Confidence */}
            <div className="col-span-1 bg-gray-50">
              <div className="p-2">
                <div className="text-xs text-gray-600 font-medium">Aggregated Association Score (Normalized Value)</div>
              </div>
            </div>

            {/* Column 4: Secondary header for Medium Confidence */}
            <div className="col-span-1 bg-gray-50">
              <div className="p-2">
                <div className="text-xs text-gray-600 font-medium">Aggregated Association Score (Normalized Value)</div>
              </div>
            </div>

            {/* Column 5: Secondary header for High Confidence */}
            <div className="col-span-1 bg-gray-50">
              <div className="p-2">
                <div className="text-xs text-gray-600 font-medium">Aggregated Association Score (Normalized Value)</div>
              </div>
            </div>

            {/* Column 6: Secondary header for Representative ARD */}
            <div className="col-span-1 bg-gray-50">
              <div className="p-2">
                <div className="text-xs text-gray-600 font-medium">Aggregated Association Score (Normalized Value)</div>
              </div>
            </div>

            {/* Column 7: Secondary header for Best Evidenced Linked Representative ARD */}
            <div className="col-span-1 bg-gray-50">
              <div className="p-2">
                <div className="text-xs text-gray-600 font-medium">Association Score (Normalized Value)</div>
              </div>
            </div>

            {/* Column 2: Total Disease Associations Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_total_assoc_score && geneData.disease_ot_total_assoc_score_norm ? 
                    `${geneData.disease_ot_total_assoc_score} (${geneData.disease_ot_total_assoc_score_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 3: Low Confidence Associations Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_lowconf_score && geneData.disease_ot_lowconf_score_norm ? 
                    `${geneData.disease_ot_lowconf_score} (${geneData.disease_ot_lowconf_score_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 4: Medium Confidence Assoc Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_modconf_score && geneData.disease_ot_modconf_score_norm ? 
                    `${geneData.disease_ot_modconf_score} (${geneData.disease_ot_modconf_score_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 5: High Confidence Associations Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_hiconf_score && geneData.disease_ot_hiconf_score_norm ? 
                    `${geneData.disease_ot_hiconf_score} (${geneData.disease_ot_hiconf_score_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 6: Representative ARD Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {geneData.disease_ot_ard_total_score && geneData.disease_ot_ard_total_score_norm ? 
                    `${geneData.disease_ot_ard_total_score} (${geneData.disease_ot_ard_total_score_norm})` : 'N/A'
                  }

                </div>
              </div>
            </div>

            {/* Column 7: Best Evidenced Linked Representative ARD Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-2">
                <div className="text-gray-900 text-xs">
                  {(() => {
                    // Get the strongest linked disease
                    const strongestDisease = geneData.disease_ot_ard_strongest_linked_disease;
                    
                    if (!strongestDisease || strongestDisease === '#N/A' || strongestDisease === 'NA') {
                      return 'N/A';
                    }
                    
                    // Find the corresponding rank and normalized value fields
                    // For TP53, it would be "Cancer" so we need to look for disease_cancer and disease_cancer_rank
                    const diseaseKey = strongestDisease.toLowerCase().replace(/\s+/g, '_');
                    
                    // Try to find the exact field names by checking common patterns
                    let rankValue = null;
                    let normValue = null;
                    
                    // Check for exact match first
                    const exactRankField = `disease_${strongestDisease}_rank`;
                    const exactNormField = `disease_${strongestDisease}`;
                    
                    if (geneData[exactRankField as keyof typeof geneData] && 
                        geneData[exactNormField as keyof typeof geneData]) {
                      rankValue = geneData[exactRankField as keyof typeof geneData];
                      normValue = geneData[exactNormField as keyof typeof geneData];
                    } else {
                      // Try to find by searching through all disease fields
                      const diseaseFields = Object.keys(geneData).filter(key => 
                        key.startsWith('disease_') && !key.endsWith('_rank')
                      );
                      
                      for (const field of diseaseFields) {
                        const diseaseName = field.replace('disease_', '');
                        if (diseaseName === strongestDisease || 
                            diseaseName.toLowerCase() === strongestDisease.toLowerCase()) {
                          const rankField = `${field}_rank`;
                          if (geneData[rankField as keyof typeof geneData]) {
                            rankValue = geneData[rankField as keyof typeof geneData];
                            normValue = geneData[field as keyof typeof geneData];
                            break;
                          }
                        }
                      }
                    }
                    
                    // Return the formatted values
                    if (rankValue && normValue && 
                        rankValue !== '#N/A' && rankValue !== 'NA' &&
                        normValue !== '#N/A' && normValue !== 'NA') {
                      // Format normalized value to 2 decimal places and put it first, then rank in parentheses
                      const formattedNormValue = parseFloat(normValue.toString()).toFixed(2);
                      return `${formattedNormValue} (${rankValue})`;
                    }
                    
                    return 'N/A';
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target-Aging Module Section */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-300">
        {/* Header Row - spans full width */}
        <div className="bg-blue-100 border-b border-gray-200">
          <div className="text-blue-900 text-sm font-semibold px-2 py-1">
            Target-Aging Module (based on{' '}
            <a 
              href="https://pubmed.ncbi.nlm.nih.gov/35343830/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              PMID35343830
            </a>
            {' '}/{' '}
            <a 
              href="https://genomics.senescence.info/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              HAGR
            </a>
            {' '}/{' '}
            <a 
              href="https://open-genes.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Open Genes
            </a>
            {' '}/{' '}
            <a 
              href="https://bio.liclab.net/Aging-ReG/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              AgingReG
            </a>
            {' '}/{' '}
            <a 
              href="https://senequest.net/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              SeneQuest
            </a>
            ). Mapping of orthologous genes in non-human species, where required, via{' '}
            <a 
              href="https://www.flyrnai.org/diopt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              DIOPT
            </a>
            .
          </div>
        </div>
        {/* Content - Table structure */}
        <div>
          {/* Helper function to render aging influence badges */}
          {(() => {
            const renderAgingBadge = (value: string | undefined) => {
              if (!value || value === '#N/A' || value === '') {
                return (
                  <span className="text-xs text-gray-400 font-normal text-center w-full">
                    None
                  </span>
                );
              }
              
              if (value === 'Pro-Longevity') {
                return (
                  <span className="text-xs bg-[#440154] text-white px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap w-[100px] flex items-center justify-center">
                    {value}
                  </span>
                );
              }
              
              if (value === 'Anti-Longevity') {
                return (
                  <span className="text-xs bg-[#FDE725] text-gray-800 px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap w-[100px] flex items-center justify-center">
                    {value}
                  </span>
                );
              }
              
              if (value === 'Unclear') {
                return (
                  <span className="text-xs bg-[#1f9e89] text-white px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap w-[100px] flex items-center justify-center">
                    {value}
                  </span>
                );
              }
              
              // For any other values, display them as-is
              return (
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap w-[100px] flex items-center justify-center">
                  {value}
                </span>
              );
            };

            const renderHumanBadge = (value: string | undefined) => {
              // Show "Yes" for any value other than #N/A, "No" for #N/A or empty values
              if (value && value !== '#N/A' && value !== 'NA' && value.trim() !== '') {
                return (
                  <span className="text-xs bg-[#440154] text-white px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap">
                    Yes
                  </span>
                );
              } else {
                return (
                  <span className="text-xs bg-[#FDE725] text-gray-800 px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap">
                    No
                  </span>
                );
              }
            };

            const renderMultiValue = (value: string | undefined) => {
              if (!value || value === '#N/A' || value === 'NA' || value.trim() === '') {
                return <span className="text-gray-400">None</span>;
              }
              
              const cleanValue = value.replace(/"/g, '');
              
              // Check if the value contains semicolons (multiple values)
              if (cleanValue.includes(';')) {
                const values = cleanValue.split(';').map(v => v.trim()).filter(v => v);
                return (
                  <div className="space-y-1">
                    {values.map((val, index) => (
                      <div key={index} className="text-gray-900 text-xs">
                        {val}
                      </div>
                    ))}
                  </div>
                );
              }
              
              // Single value
              return <span className="text-gray-900 text-xs">{cleanValue}</span>;
            };

            return (
              <div>
                {/* Header Row */}
                <div className="grid grid-cols-5 divide-x">
                  {/* Database header */}
                  <div className="bg-gray-100" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center h-full">
                      <div className="font-bold text-gray-700 text-xs">Database</div>
                    </div>
                  </div>
                  
                  {/* Column Headers */}
                  <div className="bg-gray-100" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      <div className="font-bold text-center text-gray-700 text-xs">H. sapiens</div>
                    </div>
                  </div>
                  <div className="bg-gray-100" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      <div className="font-bold text-center text-gray-700 text-xs">M. musculus</div>
                    </div>
                  </div>
                  <div className="bg-gray-100" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      <div className="font-bold text-center text-gray-700 text-xs">C. elegans</div>
                    </div>
                  </div>
                  <div className="bg-gray-100" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      <div className="font-bold text-center text-gray-700 text-xs">D. melanogaster</div>
                    </div>
                  </div>
                </div>
                
                {/* Data Rows */}
                <div className="grid grid-cols-5 divide-x">
                  {/* Row 1: PMID35343830 */}
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center h-full">
                      <div className="text-gray-700 text-xs">
                        <a 
                          href="https://pubmed.ncbi.nlm.nih.gov/35343830/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          PMID35343830
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderHumanBadge(geneData.aging_PMID35343830_human)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderAgingBadge(geneData.aging_PMID35343830_mm)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderAgingBadge(geneData.aging_PMID35343830_ce)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderAgingBadge(geneData.aging_PMID35343830_dm)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 divide-x">
                  {/* Row 2: HAGR */}
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center h-full">
                      <div className="text-gray-700 text-xs">
                        <a 
                          href="https://genomics.senescence.info/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          HAGR
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderHumanBadge(geneData.aging_hagr_genage_human_inclusion)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderAgingBadge(geneData.aging_hagr_genage_mm_influence)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderAgingBadge(geneData.aging_hagr_genage_ce_influence)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderAgingBadge(geneData.aging_hagr_genage_dm_influence)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 divide-x">
                  {/* Row 3: Open Genes */}
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center h-full">
                      <div className="text-gray-700 text-xs">
                        <a 
                          href="https://open-genes.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Open Genes
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderHumanBadge(geneData.aging_opengenes_human_longevity_assoc)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderAgingBadge(geneData.aging_opengenes_mm_influence)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderAgingBadge(geneData.aging_opengenes_ce_influence)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderAgingBadge(geneData.aging_opengenes_dm_influence)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 divide-x">
                  {/* Row 4: AgingReG */}
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center h-full">
                      <div className="text-gray-700 text-xs">
                        <a 
                          href="https://bio.liclab.net/Aging-ReG/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          AgingReG
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderHumanBadge(geneData.aging_agingreg_human_influence)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {/* AgingReG has no mouse data - empty cell */}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {/* AgingReG has no worm data - empty cell */}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {/* AgingReG has no fly data - empty cell */}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 divide-x">
                  {/* Row 5: SeneQuest */}
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center h-full">
                      <div className="text-gray-700 text-xs">
                        <a 
                          href="https://senequest.net/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          SeneQuest
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {renderHumanBadge(geneData.aging_senequest_total_entries)}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {/* SeneQuest has no mouse data - empty cell */}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {/* SeneQuest has no mouse data - empty cell */}
                    </div>
                  </div>
                  <div className="bg-white" style={{ padding: '4px 6px', height: '32px' }}>
                    <div className="flex items-center justify-center h-full">
                      {/* SeneQuest has no fly data - empty cell */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>



      {/* Target-Development Module (based on Pharos / DGIdb / TTD / ChEMBL) Section */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-300">
        {/* Header Row - spans full width */}
        <div className="bg-blue-100 border-b border-gray-200">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="text-blue-900 text-sm font-semibold">
              Target-Development Module (based on{' '}
              <a 
                href="https://pharos.nih.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Pharos
              </a>
              {' '}/{' '}
              <a 
                href="https://www.dgidb.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                DGIdb
              </a>
              {' '}/{' '}
              <a 
                href="https://db.idrblab.net/ttd/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                TTD
              </a>
              {' '}/{' '}
              <a 
                href="https://www.ebi.ac.uk/chembl/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
                >
                ChEMBL
              </a>
              )
            </div>
            {/* Development Level Badge */}
            {geneData.dev_summary_dev_level_category && geneData.dev_summary_dev_level_category !== '#N/A' && geneData.dev_summary_dev_level_category !== 'NA' && (
              <div className="flex items-center space-x-2">
                <span className="text-blue-900 text-sm font-semibold">Development Level</span>
                {(() => {
                  const category = geneData.dev_summary_dev_level_category;
                  // Extract the text part after the underscore (e.g., "High" from "1_High")
                  const displayText = category.includes('_') ? category.split('_')[1] : category;
                  
                  // Use same viridis colors as main database page: purple for high, teal for medium, green for medium to low, yellow for low
                  const getVariant = (cat: string) => {
                    if (cat.includes('High')) return 'bg-[#440154] text-white';
                    if (cat.includes('Medium to Low')) return 'bg-[#35b779] text-white';
                    if (cat.includes('Medium')) return 'bg-[#1f9e89] text-white';
                    if (cat.includes('Low')) return 'bg-[#fde725] text-gray-800';
                    return 'bg-[#fde725] text-gray-800';
                  };
                  
                  return (
                    <span className={`text-xs ${getVariant(category)} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`} title={category}>
                      {displayText}
                    </span>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
        {/* Content - Table structure */}
        <div>
          <div>
                {/* Row 1: Database Names */}
                <div className="grid grid-cols-8 divide-x">
                  {/* Column 1: Pharos */}
                  <div className="col-span-1 bg-gray-100 p-2">
                    <div className="font-semibold text-gray-700 text-xs">Pharos</div>
                  </div>
                  
                  {/* Column 2: DGIdb (spans 2 columns) */}
                  <div className="col-span-2 bg-gray-100 p-2">
                    <div className="font-semibold text-gray-700 text-xs">DGIdb</div>
                  </div>
                  
                  {/* Column 3: TTD */}
                  <div className="col-span-1 bg-gray-100 p-2">
                    <div className="font-semibold text-gray-700 text-xs">TTD</div>
                  </div>
                  
                  {/* Column 4-7: ChEMBL (spans 4 columns) */}
                  <div className="col-span-4 bg-gray-100 p-2">
                    <div className="font-semibold text-gray-700 text-xs">ChEMBL</div>
                  </div>
                </div>

                {/* Row 2: Specific Metrics */}
                <div className="grid grid-cols-8 divide-x">
                  {/* Column 1: Pharos - Target Development Level (TDL) */}
                  <div className="col-span-1 bg-gray-50 p-2">
                    <div className="text-xs text-gray-600 font-medium">Target Development Level (TDL)</div>
                  </div>
                  
                  {/* Column 2: DGIdb - All Drugs Count */}
                  <div className="col-span-1 bg-gray-50 p-2">
                    <div className="text-xs text-gray-600 font-medium">All Drugs Count</div>
                  </div>
                  
                  {/* Column 3: DGIdb - Drugs MOA Count */}
                  <div className="col-span-1 bg-gray-50 p-2">
                    <div className="text-xs text-gray-600 font-medium">Drugs MOA Count</div>
                  </div>
                  
                  {/* Column 4: TTD - Approved Drugs Count */}
                  <div className="col-span-1 bg-gray-50 p-2">
                    <div className="text-xs text-gray-600 font-medium">Approved Drugs Count</div>
                  </div>
                  
                  {/* Column 5: ChEMBL - Target ID */}
                  <div className="col-span-1 bg-gray-50 p-2">
                    <div className="text-xs text-gray-600 font-medium">Target ID</div>
                  </div>
                  
                  {/* Column 6: ChEMBL - Approved Drugs and Clinical Candidates Count */}
                  <div className="col-span-1 bg-gray-50 p-2">
                    <div className="text-xs text-gray-600 font-medium">Approved Drugs and Clinical Candidates Count</div>
                  </div>
                  
                  {/* Column 7: ChEMBL - Approved Drugs and Clinical Candidates Max Phase */}
                  <div className="col-span-1 bg-gray-50 p-2">
                    <div className="text-xs text-gray-600 font-medium">Approved Drugs and Clinical Candidates Max Phase</div>
                  </div>
                  
                  {/* Column 8: ChEMBL - Approved Drugs and Clinical Candidates First Approval */}
                  <div className="col-span-1 bg-gray-50 p-2">
                    <div className="text-xs text-gray-600 font-medium">Approved Drugs and Clinical Candidates First Approval</div>
                  </div>
                </div>

                {/* Helper function for rendering multi-value ChEMBL entries */}
                {(() => {
                  const renderMultiValue = (value: string | undefined, isTargetId: boolean = false) => {
                    if (!value || value === '#N/A' || value === 'NA' || value.trim() === '') {
                      return <span className="text-gray-400 text-xs">None</span>;
                    }
                    
                    const cleanValue = value.replace(/"/g, '');
                    
                    // Check if the value contains semicolons (multiple values)
                    if (cleanValue.includes(';')) {
                      const values = cleanValue.split(';').map(v => v.trim()).filter(v => v);
                      return (
                        <div className="space-y-1">
                          {values.map((val, index) => (
                            <div key={index} className="text-gray-900 text-xs">
                              {isTargetId ? (
                                <a 
                                  href={`https://www.ebi.ac.uk/chembl/explore/target/${val}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  {val}
                                </a>
                              ) : (
                                val
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    }
                    
                    // Single value
                    if (isTargetId) {
                      return (
                        <a 
                          href={`https://www.ebi.ac.uk/chembl/explore/target/${cleanValue}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          <span className="text-gray-900 text-xs">{cleanValue}</span>
                        </a>
                      );
                    }
                    
                    return <span className="text-gray-900 text-xs">{cleanValue}</span>;
                  };

                  return (
                    <div className="grid grid-cols-8 divide-x">
                  {/* Column 1: Pharos - Target Development Level (TDL) */}
                  <div className="col-span-1 bg-white p-2">
                    <div className="text-gray-900 text-xs">
                      {geneData.dev_pharos_tcrd_tdl && geneData.dev_pharos_tcrd_tdl !== '#N/A' ? 
                        geneData.dev_pharos_tcrd_tdl.replace(/"/g, '') : 'None'}
                    </div>
                  </div>
                  
                  {/* Column 2: DGIdb - All Drugs Count */}
                  <div className="col-span-1 bg-white p-2">
                    <div className="text-gray-900 text-xs">
                      {geneData.dev_dgidb_all_drugs && geneData.dev_dgidb_all_drugs !== '#N/A' ? 
                        geneData.dev_dgidb_all_drugs.replace(/"/g, '') : 'None'}
                    </div>
                  </div>
                  
                  {/* Column 3: DGIdb - Drugs MOA Count */}
                  <div className="col-span-1 bg-white p-2">
                    <div className="text-gray-900 text-xs">
                      {geneData.dev_dgidb_MOA_drugs && geneData.dev_dgidb_MOA_drugs !== '#N/A' ? 
                        geneData.dev_dgidb_MOA_drugs.replace(/"/g, '') : 'None'}
                    </div>
                  </div>
                  
                  {/* Column 4: TTD - Approved Drugs Count */}
                  <div className="col-span-1 bg-white p-2">
                    <div className="text-gray-900 text-xs">
                      {geneData.dev_ttd_approved_drugs && geneData.dev_ttd_approved_drugs !== '#N/A' ? 
                        geneData.dev_ttd_approved_drugs.replace(/"/g, '') : 'None'}
                    </div>
                  </div>
                  
                  {/* Column 5: ChEMBL - Target ID */}
                  <div className="col-span-1 bg-white p-2">
                    {renderMultiValue(geneData.dev_chembl_target_id, true)}
                  </div>
                  
                  {/* Column 6: ChEMBL - Approved Drugs and Clinical Candidates Count */}
                  <div className="col-span-1 bg-white p-2">
                    {renderMultiValue(geneData.dev_chembl_drug_count)}
                  </div>
                  
                  {/* Column 7: ChEMBL - Approved Drugs and Clinical Candidates Max Phase */}
                  <div className="col-span-1 bg-white p-2">
                    {renderMultiValue(geneData.dev_chembl_max_phase)}
                  </div>
                  
                  {/* Column 8: ChEMBL - Approved Drugs and Clinical Candidates First Approval */}
                  <div className="col-span-1 bg-white p-2">
                    {renderMultiValue(geneData.dev_chembl_first_approval_min)}
                  </div>
                </div>
                  );
                })()}
              </div>
        </div>
      </div>
      </div>
    </div>
  );
} 