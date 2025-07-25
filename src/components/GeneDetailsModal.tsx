"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dna,
  Award,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Database,
  FlaskConical,
  Microscope,
} from "lucide-react";

interface GeneData {
  basic_gene_symbol: string;
  basic_ensembl_gene_id: string;
  basic_hgnc_id: string;
  basic_ncbi_gene_id: string;
  basic_protein_name: string;
  basic_uniprot_id: string;
  basic_tf_superclass: string;
  basic_tf_class: string;
  basic_tf_family: string;
  sort_disease_ot_ard_aging_overall_rank: number;
  sort_disease_ot_total_assoc_score_rank: number;
  sort_aging_summary_total_db_entries_count_rank: number;
  disease_ot_ard_strongest_linked_disease: string;
  aging_summary_human: string;
  aging_summary_mm_influence: string;
  aging_summary_ce_influence: string;
  aging_summary_dm_influence: string;
  dev_summary_dev_level_category: string;
  dev_pharos_tcrd_tdl: string;
}

interface GeneDetailsModalProps {
  geneName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GeneDetailsModal({
  geneName,
  isOpen,
  onClose,
}: GeneDetailsModalProps) {
  const [geneData, setGeneData] = useState<GeneData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (geneName && isOpen) {
      fetchGeneData();
    }
  }, [geneName, isOpen]);

  const fetchGeneData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/master_table.json");
      const data = await response.json();
      const gene = data.find((g: GeneData) => g.basic_gene_symbol === geneName);
      setGeneData(gene || null);
    } catch (error) {
      console.error("Error fetching gene data:", error);
      setGeneData(null);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank <= 10) return "bg-red-500/10 text-red-700 border-red-200";
    if (rank <= 50) return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
    return "bg-green-500/10 text-green-700 border-green-200";
  };

  const getAgingIcon = (value: string) => {
    if (value === "Pro-Longevity")
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value === "Anti-Longevity")
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getDevelopmentColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "1_High": "bg-red-500/10 text-red-700 border-red-200",
      "2_Medium": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
      "3_Medium to Low": "bg-blue-500/10 text-blue-700 border-blue-200",
      "4_Low": "bg-green-500/10 text-green-700 border-green-200",
      "5_None": "bg-gray-500/10 text-gray-700 border-gray-200",
    };
    return colors[category] || "bg-gray-500/10 text-gray-700 border-gray-200";
  };

  const getTdlColor = (tdl: string) => {
    const colors: { [key: string]: string } = {
      Tclin: "bg-purple-500/10 text-purple-700 border-purple-200",
      Tchem: "bg-pink-500/10 text-pink-700 border-pink-200",
      Tbio: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
    };
    return colors[tdl] || "bg-gray-500/10 text-gray-700 border-gray-200";
  };

  if (!geneName) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <Dna className="w-8 h-8 text-blue-600" />
            {geneName}
            {geneData && (
              <Badge variant="outline" className="ml-2">
                {geneData.basic_tf_family}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : !geneData ? (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              Gene not found
            </h3>
            <p className="text-gray-500">
              The requested gene data could not be found.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rankings Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Award className="w-5 h-5 text-blue-600" />
                  Rankings & Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {geneData.sort_disease_ot_ard_aging_overall_rank}
                    </div>
                    <div className="text-sm text-gray-600">Overall Rank</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {geneData.sort_disease_ot_total_assoc_score_rank}
                    </div>
                    <div className="text-sm text-gray-600">Disease Rank</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {geneData.sort_aging_summary_total_db_entries_count_rank}
                    </div>
                    <div className="text-sm text-gray-600">Aging Rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-gray-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Ensembl Gene ID
                    </span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {geneData.basic_ensembl_gene_id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      HGNC ID
                    </span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {geneData.basic_hgnc_id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      NCBI Gene ID
                    </span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {geneData.basic_ncbi_gene_id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      UniProt ID
                    </span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {geneData.basic_uniprot_id}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm font-medium text-gray-600 block mb-1">
                      Protein Name
                    </span>
                    <span className="text-sm text-gray-800">
                      {geneData.basic_protein_name}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Classification */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-gray-600" />
                    Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">
                      TF Superclass
                    </span>
                    <Badge variant="outline" className="w-full justify-center">
                      {geneData.basic_tf_superclass}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">
                      TF Class
                    </span>
                    <Badge variant="outline" className="w-full justify-center">
                      {geneData.basic_tf_class}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">
                      TF Family
                    </span>
                    <Badge variant="outline" className="w-full justify-center">
                      {geneData.basic_tf_family}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Disease & Aging Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  Disease & Aging Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Disease Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">
                      Disease Associations
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Strongest Linked ARD
                        </span>
                        <Badge
                          className={getRankColor(
                            geneData.sort_disease_ot_total_assoc_score_rank
                          )}
                        >
                          {geneData.disease_ot_ard_strongest_linked_disease}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Aging Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">
                      Aging Research
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Human</span>
                        <div className="flex items-center gap-2">
                          {geneData.aging_summary_human === "Y" ? (
                            <Badge className="bg-green-500/10 text-green-700 border-green-200">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Linked
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500/10 text-gray-700 border-gray-200">
                              <Minus className="w-3 h-3 mr-1" />
                              No Data
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          M. musculus
                        </span>
                        <div className="flex items-center gap-2">
                          {getAgingIcon(geneData.aging_summary_mm_influence)}
                          <span className="text-sm">
                            {geneData.aging_summary_mm_influence === "#NA"
                              ? "No Data"
                              : geneData.aging_summary_mm_influence}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          C. elegans
                        </span>
                        <div className="flex items-center gap-2">
                          {getAgingIcon(geneData.aging_summary_ce_influence)}
                          <span className="text-sm">
                            {geneData.aging_summary_ce_influence === "#NA"
                              ? "No Data"
                              : geneData.aging_summary_ce_influence}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          D. melanogaster
                        </span>
                        <div className="flex items-center gap-2">
                          {getAgingIcon(geneData.aging_summary_dm_influence)}
                          <span className="text-sm">
                            {geneData.aging_summary_dm_influence === "#NA"
                              ? "No Data"
                              : geneData.aging_summary_dm_influence}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Development & Pharos */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-gray-600" />
                  Development & Drug Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">
                      Development Category
                    </span>
                    <Badge
                      className={getDevelopmentColor(
                        geneData.dev_summary_dev_level_category
                      )}
                    >
                      {geneData.dev_summary_dev_level_category}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">
                      Pharos TDL
                    </span>
                    <Badge
                      className={getTdlColor(geneData.dev_pharos_tcrd_tdl)}
                    >
                      {geneData.dev_pharos_tcrd_tdl}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
