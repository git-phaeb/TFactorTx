'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface DetailedGeneData {
  [key: string]: any;
}

export default function GeneDetailPage() {
  const params = useParams();
  const router = useRouter();
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
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Database
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{geneSymbol}</h1>
        </div>
      </div>

      {/* TFactorTx IDs and Classification Section - Side by Side */}
      <div className="grid grid-cols-2 gap-6">
        {/* TFactorTx IDs Section */}
        <Card>
          <CardHeader className="bg-blue-50 p-4">
            <CardTitle className="text-blue-900 text-lg">TFactorTx IDs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Column Headers Row - Grey */}
            <div className="grid grid-cols-2 divide-x bg-gray-100">
              <div className="p-4">
                <div className="font-semibold text-gray-700">TFactorTx ID</div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-700">TFactorTx Gene Name</div>
              </div>
            </div>
            {/* Data Row - White */}
            <div className="grid grid-cols-2 divide-x bg-white">
              <div className="p-4">
                <div className="text-gray-900">{geneData.basic_tfactortx_id || 'N/A'}</div>
              </div>
              <div className="p-4">
                <div className="text-gray-900">{geneData.basic_gene_symbol || 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classification Section */}
        <Card>
          <CardHeader className="bg-blue-50 p-4">
            <CardTitle className="text-blue-900 text-lg">Classification (based on TFClass)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Column Headers Row - Grey */}
            <div className="grid grid-cols-3 divide-x bg-gray-100">
              <div className="p-4">
                <div className="font-semibold text-gray-700">Superclass</div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-700">Class</div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-700">Family</div>
              </div>
            </div>
            {/* Data Row - White */}
            <div className="grid grid-cols-3 divide-x bg-white">
              <div className="p-4">
                <div className="text-gray-900">{geneData.basic_tf_superclass || 'N/A'}</div>
              </div>
              <div className="p-4">
                <div className="text-gray-900">{geneData.basic_tf_class || 'N/A'}</div>
              </div>
              <div className="p-4">
                <div className="text-gray-900">{geneData.basic_tf_family || 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* External Database Links Section */}
      <Card>
        <CardHeader className="bg-blue-50 p-4">
          <CardTitle className="text-blue-900 text-lg">External Database IDs and Linkouts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column Headers Row - Grey */}
          <div className="grid grid-cols-6 divide-x bg-gray-100">
            <div className="p-4">
              <div className="font-semibold text-gray-700 text-sm">Ensembl Gene ID and Linkout</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-700 text-sm">HGNC ID and Linkout</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-700 text-sm">NCBI Gene ID and Linkout</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-700 text-sm">UniProt ID and Linkout</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-700 text-sm">JASPAR Linkout (via UniProt ID)</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-700 text-sm">Open Targets Linkout (via ENSG ID)</div>
            </div>
          </div>
          {/* Data Row - White */}
          <div className="grid grid-cols-6 divide-x bg-white">
            <div className="p-4">
              <div className="text-gray-900">
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
            <div className="p-4">
              <div className="text-gray-900">
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
            <div className="p-4">
              <div className="text-gray-900">
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
            <div className="p-4">
              <div className="text-gray-900">
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
            <div className="p-4">
              <div className="text-gray-900">
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
            <div className="p-4">
              <div className="text-gray-900">
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
        </CardContent>
      </Card>

      {/* Target-Disease Module (based on Open Targets) Section */}
      <Card>
        <CardHeader className="bg-blue-50 p-4">
          <CardTitle className="text-blue-900 text-lg">
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
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Single Grid Container for all rows */}
          <div className="grid grid-cols-7 divide-x">
            {/* Column 1: Linkout header (Row 1 only) */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-4">
                <div className="font-semibold text-gray-700 text-xs">Linkout</div>
              </div>
            </div>

            {/* Column 2: Total Disease Associations */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-4">
                <div className="font-semibold text-gray-700 text-xs">Total Disease Associations Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 3: Low Confidence */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-4">
                <div className="font-semibold text-gray-700 text-xs">Low Confidence Associations Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 4: Medium Confidence */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-4">
                <div className="font-semibold text-gray-700 text-xs">Medium Confidence Assoc Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 5: High Confidence */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-4">
                <div className="font-semibold text-gray-700 text-xs">High Confidence Associations Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 6: Representative ARD */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-4">
                <div className="font-semibold text-gray-700 text-xs">Representative ARD Count (Normalized Value)</div>
              </div>
            </div>

            {/* Column 7: Best Evidenced Linked Representative ARD */}
            <div className="col-span-1 bg-gray-100">
              <div className="p-4">
                <div className="font-semibold text-gray-700 text-xs">Best Evidenced Linked Representative ARD</div>
              </div>
            </div>

            {/* Column 1: TP53 Disease Associations - spans rows 2-4 */}
            <div className="col-span-1 row-span-3 bg-white">
              <div className="p-4 h-full flex items-center justify-center">
                <div className="text-gray-900">
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
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_total_assoc_count && geneData.disease_ot_total_assoc_count_norm ? 
                    `${geneData.disease_ot_total_assoc_count} (${geneData.disease_ot_total_assoc_count_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_total_assoc_count] + [disease_ot_total_assoc_count_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 3: Low Confidence Associations Count data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_lowconf_count && geneData.disease_ot_lowconf_count_norm ? 
                    `${geneData.disease_ot_lowconf_count} (${geneData.disease_ot_lowconf_count_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_lowconf_count] + [disease_ot_lowconf_count_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 4: Medium Confidence Assoc Count data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_modconf_count && geneData.disease_ot_modconf_count_norm ? 
                    `${geneData.disease_ot_modconf_count} (${geneData.disease_ot_modconf_count_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_modconf_count] + [disease_ot_modconf_count_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 5: High Confidence Associations Count data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_hiconf_count && geneData.disease_ot_hiconf_count_norm ? 
                    `${geneData.disease_ot_hiconf_count} (${geneData.disease_ot_hiconf_count_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_hiconf_count] + [disease_ot_hiconf_count_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 6: Representative ARD Count data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_ard_disease_count && geneData.disease_ot_ard_disease_count_norm ? 
                    `${geneData.disease_ot_ard_disease_count} (${geneData.disease_ot_ard_disease_count_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_ard_disease_count] + [disease_ot_ard_disease_count_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 7: Best Evidenced Linked Representative ARD data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  Add Fields
                  <div className="text-xs text-gray-400 mt-1 text-center">[NEED_CSV_FIELD]</div>
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
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_total_assoc_score && geneData.disease_ot_total_assoc_score_norm ? 
                    `${geneData.disease_ot_total_assoc_score} (${geneData.disease_ot_total_assoc_score_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_total_assoc_score] + [disease_ot_total_assoc_score_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 3: Low Confidence Associations Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_lowconf_score && geneData.disease_ot_lowconf_score_norm ? 
                    `${geneData.disease_ot_lowconf_score} (${geneData.disease_ot_lowconf_score_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_lowconf_score] + [disease_ot_lowconf_score_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 4: Medium Confidence Assoc Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_modconf_score && geneData.disease_ot_modconf_score_norm ? 
                    `${geneData.disease_ot_modconf_score} (${geneData.disease_ot_modconf_score_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_modconf_score] + [disease_ot_modconf_score_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 5: High Confidence Associations Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_hiconf_score && geneData.disease_ot_hiconf_score_norm ? 
                    `${geneData.disease_ot_hiconf_score} (${geneData.disease_ot_hiconf_score_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_hiconf_score] + [disease_ot_hiconf_score_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 6: Representative ARD Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  {geneData.disease_ot_ard_total_score && geneData.disease_ot_ard_total_score_norm ? 
                    `${geneData.disease_ot_ard_total_score} (${geneData.disease_ot_ard_total_score_norm})` : 'N/A'
                  }
                  <div className="text-xs text-gray-400 mt-1 text-center">[disease_ot_ard_total_score] + [disease_ot_ard_total_score_norm]</div>
                </div>
              </div>
            </div>

            {/* Column 7: Best Evidenced Linked Representative ARD Score data */}
            <div className="col-span-1 bg-white">
              <div className="p-4">
                <div className="text-gray-900">
                  Add Fields
                  <div className="text-xs text-gray-400 mt-1 text-center">[NEED_CSV_FIELD]</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Level Section */}
      <Card>
        <CardHeader className="bg-blue-50 p-4">
          <CardTitle className="text-blue-900 text-lg">Development Level</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column Headers Row - Grey */}
          <div className="grid grid-cols-2 divide-x bg-gray-100">
            <div className="p-4">
              <div className="font-semibold text-gray-700">Development Level</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-700">Pharos TDL</div>
            </div>
          </div>
          {/* Data Row - White */}
          <div className="grid grid-cols-2 divide-x bg-white">
            <div className="p-4">
              <div className="text-gray-900">{geneData.sort_dev_summary_dev_level_category || 'N/A'}</div>
            </div>
            <div className="p-4">
              <div className="text-gray-900">{geneData.dev_pharos_tcrd_tdl || 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aging Summary Section */}
      <Card>
        <CardHeader className="bg-blue-50 p-4">
          <CardTitle className="text-blue-900 text-lg">Aging Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column Headers Row - Grey */}
          <div className="grid grid-cols-2 divide-x bg-gray-100">
            <div className="p-4">
              <div className="font-semibold text-gray-700">Total DB Entries</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-700">Human Influence</div>
            </div>
          </div>
          {/* Data Row - White */}
          <div className="grid grid-cols-2 divide-x bg-white">
            <div className="p-4">
              <div className="text-gray-900">{geneData.aging_summary_total_db_entries_count || 'N/A'}</div>
            </div>
            <div className="p-4">
              <div className="text-gray-900">{geneData.aging_summary_human || 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disease Associations Section */}
      <Card>
        <CardHeader className="bg-blue-50 p-4">
          <CardTitle className="text-blue-900 text-lg">Disease Associations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column Headers Row - Grey */}
          <div className="grid grid-cols-2 divide-x bg-gray-100">
            <div className="p-4">
              <div className="font-semibold text-gray-700">Total Association Count</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-700">Total Association Score</div>
            </div>
          </div>
          {/* Data Row - White */}
          <div className="grid grid-cols-2 divide-x bg-white">
            <div className="p-4">
              <div className="text-gray-900">{geneData.disease_ot_total_assoc_count || 'N/A'}</div>
            </div>
            <div className="p-4">
              <div className="text-gray-900">{geneData.disease_ot_total_assoc_score || 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information Section */}
      <Card>
        <CardHeader className="bg-blue-50 p-4">
          <CardTitle className="text-blue-900 text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column Headers Row - Grey */}
          <div className="grid grid-cols-2 divide-x bg-gray-100">
            <div className="p-4">
              <div className="font-semibold text-gray-700">Protein Name</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-700">UniProt ID</div>
            </div>
          </div>
          {/* Data Row - White */}
          <div className="grid grid-cols-2 divide-x bg-white">
            <div className="p-4">
              <div className="text-gray-900 text-sm">{geneData.basic_protein_name || 'N/A'}</div>
            </div>
            <div className="p-4">
              <div className="text-gray-900">{geneData.basic_uniprot_id || 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 