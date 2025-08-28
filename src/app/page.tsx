import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const featureBlocks = [
  {
    title: "Comprehensive Transcription Factor Database",
    description: "Access a manually curated database of human transcription factors with detailed annotations and cross-references.",
    image: "/placeholder-feature.svg",
  },
  {
    title: "Advanced Search and Filtering",
    description: "Find specific transcription factors using powerful search tools and apply multiple filters to narrow down results.",
    image: "/placeholder-feature.svg",
  },
  {
    title: "Disease and Aging Associations",
    description: "Explore connections between transcription factors and various diseases, with a focus on aging-related research.",
    image: "/placeholder-feature.svg",
  },
  {
    title: "Research and Therapeutic Insights",
    description: "Gain valuable insights for your research projects and identify potential therapeutic targets for drug development.",
    image: "/placeholder-feature.svg",
  },
  {
    title: "Open Source and Community Driven",
    description: "Contribute to the database and help improve our understanding of transcription factors in human biology.",
    image: "/placeholder-feature.svg",
  },
];

export default function Home() {
  return (
    <div className="h-full" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
      {/* Hero Section with debugging borders */}
      <section className="relative w-full py-2 md:py-4 lg:py-6" style={{ border: '' }}>
        <div className="container" style={{ border: '' }}>
          <div className="relative z-10 mx-auto max-w-3xl text-center" style={{ border: '' }}>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TFactorTx<br />
              <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800">
                An Open Source Database for Human Transcription Factors
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-[725px] text-muted-foreground md:text-xl">
              Accelerate your research with a manually curated, searchable, and
              filterable database of human transcription factors and their links to aging and
              disease. Explore this dataset to find your next research or therapeutic target.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/database">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/documentation">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lower Timeline Section with debugging borders */}
      <section className="w-full py-4" style={{ border: '' }}>
        <div className="container mx-auto px-4 max-w-4xl" style={{ border: '' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Discover the Power of Transcription Factor Research
          </h2>
          <div className="relative" style={{ border: '' }}>
            {/* Vertical line starts at subtitle and covers all feature blocks */}
            <div className="hidden md:block absolute left-0 top-0 h-full" style={{ width: '2px', backgroundColor: '#93c5fd', zIndex: 0 }} />
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              TFactorTx provides researchers with comprehensive tools to explore human transcription factors, understand their roles in disease, and accelerate scientific discovery through our curated database.
            </p>
            <div className="flex mt-8" style={{ border: '' }}>
              <div className="flex-1 space-y-8 relative" style={{ border: '' }}>
                {featureBlocks.map((block, idx) => (
                  <div key={block.title} className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-0 relative" style={{ border: '' }}>
                    {/* Curved branch and marker using SVG */}
                    <div className="hidden md:block absolute left-0" style={{ top: '12px', height: '32px', width: '32px' }}>
                      <svg width="32" height="32" style={{ position: 'absolute', left: 0, top: 0 }}>
                        <path
                          d="M0,0 Q16,16 32,16"
                          stroke="#93c5fd"
                          strokeWidth="1.5"
                          fill="none"
                        />
                      </svg>
                      <div
                        className="absolute"
                        style={{
                          left: '32px',
                          top: '16px',
                          width: '16px',
                          height: '16px',
                          transform: 'translate(-50%, -50%)',
                          background: 'white',
                          border: '4px solid #60a5fa',
                          borderRadius: '50%',
                          boxShadow: '0 0 2px #60a5fa',
                        }}
                      />
                    </div>
                    {/* Content and image: always text left, image right */}
                    <div className="flex-1 flex flex-col md:flex-row items-center md:items-start">
                      <div className="md:w-1/4 w-full flex flex-col justify-center px-4 md:pl-0 md:ml-[56px] md:pr-8 text-center md:text-left">
                        <h3 className="text-xl md:text-2xl font-semibold mb-2">{block.title}</h3>
                        <p className="text-base text-muted-foreground mb-4">{block.description}</p>
                      </div>
                      <div className="md:w-3/4 w-full flex justify-center items-center mb-6 md:mb-0">
                        <Image
                          src={block.image}
                          alt={block.title}
                          width={600}
                          height={375}
                          className="rounded-xl shadow-lg object-contain bg-white p-4"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Buttons at the end */}
        <div className="mt-16 flex justify-center gap-4">
          <Link href="/database">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/documentation">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
