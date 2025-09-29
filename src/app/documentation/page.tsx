import React from "react";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "columns", label: "Data Columns" },
  { id: "methodology", label: "Methodology" },
  { id: "sources", label: "Sources" },
  { id: "license", label: "License" },
];

// Removed placeholder lorem content; only real documentation text remains.

export default function DocumentationPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden md:block md:w-64 w-full mb-6 md:mb-0">
            <nav className="sticky top-16 bg-white rounded-lg pt-4 px-6 text-base shadow-lg">
              <div className="font-semibold text-gray-700 mb-6 tracking-wide text-sm uppercase">Sections</div>
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
              <div className="font-semibold text-gray-700 mb-4 tracking-wide text-sm uppercase">Sections</div>
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
          <main className="flex-1 bg-white rounded-lg pt-0 md:pt-16 pr-8 pb-8 pl-8 shadow-lg">
            <section id="intro" className="mb-12 scroll-mt-24">
              <h1 className="text-2xl font-bold mb-4 text-gray-900">Documentation</h1>
              <p className="leading-relaxed text-gray-700 mb-3">Website Last Updated: 25.09.2025 | Documentation Last Updated: In Progress <span id="docs-last-updated"></span></p>
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Introduction</h2>
              <p className="leading-relaxed text-gray-700">
                Welcome to the TFactorTx documentation. Here you’ll find information about the data columns, methodology, and sources used in this project. This section is currently being updated.
              </p>
              
            </section>
            <section id="columns" className="mb-12 scroll-mt-24">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Data Columns</h2>
              <p className="leading-relaxed text-gray-700">
                Each row in the database contains the following columns. Details are currently being updated.
              </p>
              <ul className="list-disc ml-6 mt-2 text-gray-700">
                <li><b>Column 1</b>: ADD DESCRIPTION</li>
                <li><b>Column 2</b>: ADD DESCRIPTION</li>
                <li><b>Column 3</b>: ADD DESCRIPTION</li>
                <li><b>Column 4</b>: ADD DESCRIPTION</li>
                <li><b>Column 5</b>: ADD DESCRIPTION</li>
              </ul>
              
            </section>
            <section id="methodology" className="mb-12 scroll-mt-24">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Methodology</h2>
              <p className="leading-relaxed text-gray-700">
                Transcription factors were ranked and selected based on a combination of manual curation, literature review, and integration of public datasets.
                Criteria included relevance to aging, disease, and experimental validation. Details are currently being updated.
              </p>
              
              
            </section>
            <section id="sources" className="mb-12 scroll-mt-24">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Sources</h2>
              <p className="leading-relaxed text-gray-700">
                All data was compiled from publicly available and openly licensed sources. Details are currently being updated.
              </p>
              <ul className="list-disc ml-6 mt-2 text-gray-700">
                <li><b>Database 1</b>: ADD DESCRIPTION</li>
                <li><b>Database 2</b>: ADD DESCRIPTION</li>
                <li><b>Database 3</b>: ADD DESCRIPTION</li>
                <li><b>Database 4</b>: ADD DESCRIPTION</li>
                <li><b>Database 5</b>: ADD DESCRIPTION</li>
              </ul>
              
            </section>
            <section id="license" className="mb-12 scroll-mt-24">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">License</h2>
              <p className="leading-relaxed text-gray-700">
              This project is dedicated to the public domain under the terms of the <a href="https://creativecommons.org/publicdomain/zero/1.0/?ref=chooser-v1" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">Creative Commons Zero v1.0 Universal Public Domain Dedication (CC0 1.0)</a>. TFactorTx was created and is maintained by Dr. Fabian Fischer <a href="https://orcid.org/0000-0002-4159-3178" target="_blank" rel="noopener noreferrer" className="inline-block ml-1"><img src="https://orcid.org/sites/default/files/images/orcid_16x16.png" alt="ORCID" width="16" height="16" className="inline-block" /></a> <a href="https://www.linkedin.com/in/dr-fabian-fischer/" target="_blank" rel="noopener noreferrer" className="inline-block ml-1"><img src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg" alt="LinkedIn" width="16" height="16" className="inline-block" /></a><br/><br/>
              All content has been compiled exclusively from publicly available and openly licensed sources, which are cited in the above project documentation. No proprietary or confidential materials have been used.
              </p>
              
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
