import React from "react";
import fs from "fs";
import path from "path";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "data-sources", label: "Data Sources" },
  { id: "methodology", label: "Methodology" },
  { id: "license", label: "License and Attribution" },
];

// Removed placeholder lorem content; only real documentation text remains.

export default function DocumentationPage() {
  // Load citations CSV (server-side)
  const citationsCsvPath = path.join(process.cwd(), "src", "data", "250915_Database_Citations.csv");
  let citationHeaders: string[] = [];
  let citationRows: string[][] = [];

  try {
    const raw = fs.readFileSync(citationsCsvPath, "utf8");
    const { headers, rows } = parseCsv(raw);
    citationHeaders = headers;
    citationRows = rows;
  } catch (e) {
    // If file missing or parse error, fall back to empty table
    citationHeaders = [];
    citationRows = [];
  }

  // Load methodology CSV (same rendering pattern as Data Sources)
  const methodologyCsvPath = path.join(process.cwd(), "src", "data", "251007_Documentation_Methodology_Database.csv");
  let methodologyHeaders: string[] = [];
  let methodologyRows: string[][] = [];
  try {
    const rawMeth = fs.readFileSync(methodologyCsvPath, "utf8");
    const parsedMeth = parseCsv(rawMeth);
    methodologyHeaders = parsedMeth.headers;
    methodologyRows = parsedMeth.rows;
  } catch (e) {
    methodologyHeaders = [];
    methodologyRows = [];
  }

  // Load TF Cards methodology CSV
  const tfCardsCsvPath = path.join(process.cwd(), "src", "data", "251007_Documentation_Methodology_TF_Card.csv");
  let tfCardsHeaders: string[] = [];
  let tfCardsRows: string[][] = [];
  try {
    const rawTfc = fs.readFileSync(tfCardsCsvPath, "utf8");
    const parsedTfc = parseCsv(rawTfc);
    tfCardsHeaders = parsedTfc.headers;
    tfCardsRows = parsedTfc.rows;
  } catch (e) {
    tfCardsHeaders = [];
    tfCardsRows = [];
  }
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden md:block md:w-64 w-full mb-6 md:mb-0">
            <nav className="sticky top-20 bg-white rounded-lg py-4 px-6 text-base shadow-lg">
              <ul className="space-y-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block px-2 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Mobile Sidebar Navigation */}
          <aside className="block md:hidden w-full mb-6 mt-16">
            <nav className="bg-white rounded-lg p-4 text-base shadow-lg">
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block px-2 py-1 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          {/* Main Content */}
          <main className="flex-1 bg-white rounded-lg pt-4 pr-8 pb-8 pl-8 shadow-lg mb-20">
            <section id="intro" className="mb-12 scroll-mt-24">
              <h1 className="text-2xl font-bold mb-4 text-gray-900">Documentation</h1>
              <p className="leading-relaxed text-gray-700 mb-3">Last Updated: October 10, 2025<span id="docs-last-updated"></span></p>
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Introduction</h2>
              <p className="leading-relaxed text-gray-700">
                This is the TFactorTx documentation. Here you’ll find information about the data sources and how the database and detailed TF cards are derived from them.
              </p>
              
            </section>

            
            <section id="data-sources" className="mb-12 scroll-mt-24">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Data Sources</h2>
              <p className="leading-relaxed text-gray-700">
                The data for the database and detailed TF cards was compiled from publicly available and openly licensed sources. The sources are listed in the table below, including links to the original sources and appropriate recent citations.
              </p>
              {/* Citations table from CSV */}
              {citationHeaders.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {citationHeaders.map((h) => (
                          <th key={h} className="px-3 py-2 border-b border-gray-200 text-gray-700 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {citationRows.map((cols, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          {cols.map((cell, colIdx) => (
                            <td key={colIdx} className="px-3 py-2 align-top border-b border-gray-100 text-gray-800">
                              {isUrl(cell) ? (
                                <a href={cell} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                  {cell}
                                </a>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
            </section>

            <section id="methodology" className="mb-12 scroll-mt-24">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Methodology</h2>
              <p className="leading-relaxed text-gray-700">
                This section summarizes how database and TF card elements are derived from the listed data sources.
                It provides a high-level description of the processing and mapping steps used to generate ranks and labels shown throughout TFactorTx.
              </p>
              {methodologyHeaders.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <div className="text-sm text-gray-700 font-semibold mb-2">Database</div>
                  <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {methodologyHeaders.map((h) => (
                          <th key={h} className="px-3 py-2 border-b border-gray-200 text-gray-700 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {methodologyRows.map((cols, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          {cols.map((cell, colIdx) => (
                            <td key={colIdx} className="px-3 py-2 align-top border-b border-gray-100 text-gray-800">
                              {isUrl(cell) ? (
                                <a href={cell} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                  {cell}
                                </a>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tfCardsHeaders.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                  <div className="text-sm text-gray-700 font-semibold mb-2">TF Cards</div>
                  <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {tfCardsHeaders.map((h) => (
                          <th key={h} className="px-3 py-2 border-b border-gray-200 text-gray-700 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tfCardsRows.map((cols, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          {cols.map((cell, colIdx) => (
                            <td key={colIdx} className="px-3 py-2 align-top border-b border-gray-100 text-gray-800">
                              {isUrl(cell) ? (
                                <a href={cell} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                  {cell}
                                </a>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section id="license" className="mb-12 scroll-mt-24">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">License and Attribution</h2>
              <p className="leading-relaxed text-gray-700">
              This project is dedicated to the public domain under the terms of the <a href="https://creativecommons.org/publicdomain/zero/1.0/?ref=chooser-v1" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">Creative Commons Zero v1.0 Universal Public Domain Dedication (CC0 1.0)</a>.
              <br/><br/>
              All content has been compiled exclusively from publicly available and openly licensed sources, which are cited in the above project documentation. No proprietary or confidential materials have been used.
              <br/><br/>
              TFactorTx was created and is maintained by Dr. Fabian Fischer <a href="https://orcid.org/0000-0002-4159-3178" target="_blank" rel="noopener noreferrer" className="inline-block ml-1"><img src="https://orcid.org/sites/default/files/images/orcid_16x16.png" alt="ORCID" width="16" height="16" className="inline-block" /></a> <a href="https://www.linkedin.com/in/dr-fabian-fischer/" target="_blank" rel="noopener noreferrer" className="inline-block ml-1"><img src="/LI-In-Bug.png" alt="LinkedIn" width="16" height="16" className="inline-block" /></a>
                            </p>
              
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

// Simple CSV parser that supports quoted fields with commas
function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]);
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    rows.push(parseCsvLine(lines[i]));
  }
  return { headers, rows };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') { // escaped quote
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ';') { // use semicolon as delimiter
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result.map(v => v.trim());
}

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}
