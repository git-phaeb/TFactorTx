'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Clock, Wrench } from 'lucide-react';
import { TFactorTxData, getTDL } from '@/lib/csv-loader';

export default function GeneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [geneData, setGeneData] = useState<TFactorTxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const geneSymbol = decodeURIComponent(params.gene as string);

  useEffect(() => {
    const fetchGeneData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/csv-data?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        const gene = result.data.find((row: TFactorTxData) => row['TF Symbol'] === geneSymbol);
        
        if (gene) {
          setGeneData(gene);
        } else {
          setError('Gene not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gene data');
      } finally {
        setLoading(false);
      }
    };

    fetchGeneData();
  }, [geneSymbol]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading gene details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !geneData) {
    return (
      <div className="min-h-screen pt-20" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error || 'Gene not found'}</p>
              <Button onClick={() => router.push('/database')}>Back to Database</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Gene Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center">
              <Target className="w-8 h-8 mr-3 text-blue-600" />
              {geneData['TF Symbol']}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Target-Disease Module */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Target–Disease Module
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Overall Rank:</span>{' '}
                    {geneData['sort_disease_ot_ard_aging_overall_rank']}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Total Assoc. Score Rank:</span>{' '}
                    {geneData['sort_disease_ot_total_assoc_score_rank']}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Total Assoc. Count Rank:</span>{' '}
                    {geneData['sort_disease_ot_ard_total_assoc_count_score_rank']}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Top Disease:</span>{' '}
                    {geneData['disease_ot_ard_strongest_linked_disease'] === '#NA'
                      ? 'Unknown'
                      : geneData['disease_ot_ard_strongest_linked_disease']}
                  </p>
                </div>
              </div>

              {/* Aging Module */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Aging Module
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Total DB Entries Rank:</span>{' '}
                    {geneData['sort_aging_summary_total_db_entries_count_rank']}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Human:</span>{' '}
                    <Badge variant={geneData['aging_summary_human'] === 'Y' ? 'default' : 'secondary'}>
                      {geneData['aging_summary_human'] === 'Y' ? 'Yes' : 'No'}
                    </Badge>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">M. musculus Influence:</span>{' '}
                    <Badge
                      variant={
                        geneData['aging_summary_mm_influence'] === 'Pro-Longevity'
                          ? 'default'
                          : geneData['aging_summary_mm_influence'] === 'Anti-Longevity'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {geneData['aging_summary_mm_influence'] === '#NA'
                        ? 'Unknown'
                        : geneData['aging_summary_mm_influence']}
                    </Badge>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">C. elegans Influence:</span>{' '}
                    <Badge
                      variant={
                        geneData['aging_summary_ce_influence'] === 'Pro-Longevity'
                          ? 'default'
                          : geneData['aging_summary_ce_influence'] === 'Anti-Longevity'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {geneData['aging_summary_ce_influence'] === '#NA'
                        ? 'Unknown'
                        : geneData['aging_summary_ce_influence']}
                    </Badge>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">D. melanogaster Influence:</span>{' '}
                    <Badge
                      variant={
                        geneData['aging_summary_dm_influence'] === 'Pro-Longevity'
                          ? 'default'
                          : geneData['aging_summary_dm_influence'] === 'Anti-Longevity'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {geneData['aging_summary_dm_influence'] === '#NA'
                        ? 'Unknown'
                        : geneData['aging_summary_dm_influence']}
                    </Badge>
                  </p>
                </div>
              </div>

              {/* Development Module */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Wrench className="w-5 h-5 mr-2 text-purple-600" />
                  Development Module
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Dev Level Category:</span>{' '}
                    <Badge
                      variant={
                        geneData['dev_summary_dev_level_category'].includes('High')
                          ? 'default'
                          : geneData['dev_summary_dev_level_category'].includes('Medium')
                          ? 'outline'
                          : geneData['dev_summary_dev_level_category'].includes('Low')
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {geneData['dev_summary_dev_level_category']}
                    </Badge>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">TDL:</span>{' '}
                    <Badge
                      variant={
                        getTDL(geneData['dev_pharos_tcrd_tdl']) === 'Tclin'
                          ? 'default'
                          : getTDL(geneData['dev_pharos_tcrd_tdl']) === 'Tchem'
                          ? 'outline'
                          : getTDL(geneData['dev_pharos_tcrd_tdl']) === 'Tbio'
                          ? 'outline'
                          : 'outline'
                      }
                    >
                      {getTDL(geneData['dev_pharos_tcrd_tdl'])}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 