'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Database, FileText, Activity } from 'lucide-react';

interface GeneEntry {
  id: string;
  name: string;
  organism: string;
  function: string;
  length: number;
  mass: number;
  status: 'reviewed' | 'unreviewed';
  lastUpdated: string;
  evidence: string[];
  pathways: string[];
}

interface GeneDetailsModalProps {
  gene: GeneEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GeneDetailsModal({ gene, isOpen, onClose }: GeneDetailsModalProps) {
  if (!gene) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="font-mono text-blue-600">{gene.id}</span>
            <Badge variant={gene.status === 'reviewed' ? 'default' : 'secondary'}>
              {gene.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Entry Name:</span>
                <p className="mt-1">{gene.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Organism:</span>
                <p className="mt-1">{gene.organism}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Length:</span>
                <p className="mt-1">{gene.length} amino acids</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Molecular Mass:</span>
                <p className="mt-1">{gene.mass.toLocaleString()} Da</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Last Updated:</span>
                <p className="mt-1">{new Date(gene.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Function */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Function
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{gene.function}</p>
          </div>

          <Separator />

          {/* Pathways */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Pathways</h3>
            <div className="flex flex-wrap gap-2">
              {gene.pathways.map((pathway, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {pathway}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Evidence */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Evidence ({gene.evidence.length})
            </h3>
            <div className="space-y-2">
              {gene.evidence.map((evidence, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded border">
                  <code className="text-blue-600">{evidence}</code>
                </div>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>View in UniProt</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>View in Ensembl</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>View in PubMed</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
