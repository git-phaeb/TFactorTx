'use client';

import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CSVUploaderProps {
  onDataLoaded: (data: any[], headers: string[]) => void;
}

export function CSVUploader({ onDataLoaded }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const data = lines.slice(1, 6).map(line => { // Preview first 5 rows
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return { headers, data };
  };

  const handleFileUpload = (file: File) => {
    console.log('Starting file upload for:', file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('File read successfully');
      const text = e.target?.result as string;
      console.log('File content preview:', text.substring(0, 200));
      const { headers, data } = parseCSV(text);
      
      console.log('Parsed headers:', headers);
      console.log('Parsed preview data:', data);
      
      setFileName(file.name);
      setHeaders(headers);
      setPreviewData(data);
      
      // Parse full data for the table
      const fullData = text.split('\n').slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      }).filter(row => Object.values(row).some(val => val !== '')); // Remove empty rows
      
      console.log('Full data length:', fullData.length);
      onDataLoaded(fullData, headers);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Accept CSV files and also files with .csv extension
      if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
        handleFileUpload(file);
      } else {
        alert('Please upload a CSV file (.csv)');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File select triggered');
    const files = e.target.files;
    console.log('Files selected:', files);
    if (files && files.length > 0) {
      console.log('Processing file:', files[0].name);
      handleFileUpload(files[0]);
    }
  };

  const clearData = () => {
    setFileName('');
    setHeaders([]);
    setPreviewData([]);
    onDataLoaded([], []);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Upload CSV Data</CardTitle>
      </CardHeader>
      <CardContent>
        {!fileName ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your CSV file here
            </p>
            <p className="text-gray-500 mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
              ref={(input) => {
                if (input) {
                  input.onclick = () => {
                    // Reset the input value so the same file can be selected again
                    input.value = '';
                  };
                }
              }}
            />
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="cursor-pointer"
                onClick={() => {
                  const input = document.getElementById('csv-upload') as HTMLInputElement;
                  if (input) {
                    input.click();
                  }
                }}
              >
                Choose CSV File
              </Button>
              
              {/* Alternative: Direct file input for debugging */}
              <div className="text-sm text-gray-500">
                <p>Or use direct file input:</p>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileSelect}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="font-medium">{fileName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearData}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Column Headers ({headers.length}):</h4>
              <div className="flex flex-wrap gap-2">
                {headers.map((header, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded border"
                  >
                    {header}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Data Preview (first 5 rows):</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      {headers.map((header, index) => (
                        <th key={index} className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b">
                        {headers.map((header, colIndex) => (
                          <td key={colIndex} className="px-3 py-2 text-sm text-gray-600">
                            {row[header] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 