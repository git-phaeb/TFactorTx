import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const featureBlocks = [
  {
    title: "TFs as Drug Targets",
    description: "Nuclear receptors, a specific TF class, are highly succesful as drug targets. Unlike most other TFs, nuclear receptors can be targeted directly with small molecules.",
    image: "/placeholder-feature.svg",
  },
      {
      title: "Unexplored TF\nTarget Space",
      description: "While most TFs are traditionally considered 'undruggable,' this paradigm is rapidly changing with the advancement of new modalities and improved small molecules.<br/><br/>This unlocks many new opportunities for targeting TFs linked to aging and disease.",
      image: "/placeholder-feature.svg",
    },
  {
    title: "TFactorTx Database",
    description: "The TFactorTx database provides an entry point to identify research and therapeutic targets from the space of all 1,600+ human TFs.",
    image: "/placeholder-feature.svg",
  },
  {
    title: "Aging, Disease, and Drug Associations",
         description: "Information from several other databases (see <a href='/documentation' style='color: #60a5fa; text-decoration: underline;' onMouseOver=\"this.style.color='#93c5fb'\" onMouseOut=\"this.style.color='#60a5fa'\">documentation</a>) is aggregated to provide a convenient overview of TFs links to aging across several species, relevance for human disease, and current drug development states.",
    image: "/placeholder-feature.svg",
  },
  {
    title: "Searching, Filtering, and Exploring",
    description: "Use the intuitive searching and filtering options to narrow in on targets of interest. Check detailed TF cards to better understand your targets and explore linked databases to dive deeper.",
    image: "/placeholder-feature.svg",
  },
];

export default function Home() {
  return (
    <div className="h-full" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)', border: '3px solid red' }}>
      {/* Hero Section */}
      <section className="relative w-full py-2 md:py-4 lg:py-6" style={{ border: '2px solid blue' }}>
        <div className="container mx-auto px-4 max-w-5xl" style={{ border: '2px solid green' }}>
          <div className="relative z-10 text-center" style={{ border: '2px solid orange' }}>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{ border: '1px solid purple' }}>
              TFactorTx
            </h1>
            <h1 className="font-bold tracking-tighter" style={{ border: '1px solid olive' }}>
              <span className="block mt-2 text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tighter" style={{ border: '1px solid lime' }}>
                An Open Source Database for<br/>Human Transcription Factors
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground text-base px-2" style={{ border: '1px solid brown' }}>
              Accelerate your research with our manually curated database of
              human transcription factors and their links to aging, disease, and drug development.<br/><br/>
              Explore this database to find your next research or therapeutic target.
            </p>
            <div className="mt-10 flex justify-center gap-4" style={{ border: '2px solid cyan' }}>
              <Link href="/database" className="w-32" style={{ border: '1px solid darkgreen' }}>
                <Button size="lg" className="w-full h-10 !h-10">Get Started</Button>
              </Link>
              <Link href="/documentation" className="w-32" style={{ border: '1px solid darkgreen' }}>
                <Button size="lg" variant="outline" className="w-full h-10 !h-10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lower Timeline Section */}
      <section className="w-full py-4" style={{ border: '2px solid navy' }}>
        <div className="container mx-auto px-4 max-w-5xl" style={{ border: '2px solid teal' }}>
          <div className="mx-auto max-w-3xl text-center" style={{ border: '2px solid maroon' }}>
            <h1 className="font-bold tracking-tighter" style={{ border: '1px solid olive' }}>
              <span className="block mt-2 text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tighter" style={{ border: '1px solid lime' }}>
                Discover the Power of Transcription Factors (TFs)
              </span>
            </h1>
          </div>
          <div className="relative" style={{ border: '2px solid indigo' }}>
            {/* Vertical line starts at subtitle and covers all feature blocks */}
            <div className="hidden md:block absolute left-0 top-0 h-full" style={{ width: '2px', backgroundColor: '#93c5fd', zIndex: 0, border: '1px solid yellow' }} />
            
            {/* Top timeline circle */}
            <div className="hidden md:block absolute left-0" style={{ top: '-8px', left: '-8px', border: '1px solid gold' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: '#60a5fa',
                  borderRadius: '50%',
                  boxShadow: '0 0 4px rgba(96, 165, 250, 0.3)',
                  border: '1px solid silver',
                }}
              />
            </div>
            
            {/* Bottom timeline circle */}
            <div className="hidden md:block absolute left-0" style={{ bottom: '-8px', left: '-8px', border: '1px solid gold' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: '#60a5fa',
                  borderRadius: '50%',
                  boxShadow: '0 0 4px rgba(96, 165, 250, 0.3)',
                  border: '1px solid silver',
                }}
              />
            </div>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto px-2 text-base" style={{ border: '1px solid coral' }}>
              Did you know that humans have over 1,600 transcription factors, with hundreds linked to aging and disease, yet only 23 of them are targeted by approved drugs?
            </p>
            <div className="flex mt-8" style={{ border: '2px solid violet' }}>
              <div className="flex-1 space-y-8 relative" style={{ border: '2px solid tomato' }}>
                {featureBlocks.map((block, idx) => (
                  <div key={block.title} className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-0 relative" style={{ border: '2px solid darkorange' }}>
                    {/* Curved branch and marker using SVG */}
                    <div className="hidden md:block absolute left-0" style={{ top: '12px', height: '32px', width: '32px', border: '1px solid lightblue' }}>
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
                    <div className="flex-1 flex flex-col md:flex-row items-center md:items-start" style={{ border: '2px solid lightgreen' }}>
                      <div className="md:w-1/3 w-full flex flex-col justify-center px-2 md:pl-0 md:ml-[56px] md:pr-4 text-center md:text-left" style={{ border: '2px solid lightcoral' }}>
                        <h3 className="text-xl font-semibold mb-2" style={{ whiteSpace: 'pre-line', border: '1px solid lightyellow' }}>{block.title}</h3>
                                                 <p className="text-base text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: block.description }} style={{ border: '1px solid lightpink' }}></p>
                      </div>
                      <div className="md:w-3/4 w-full flex justify-center items-center mb-6 md:mb-0" style={{ border: '2px solid lightsteelblue' }}>
                        <Image
                          src={block.image}
                          alt={block.title}
                          width={600}
                          height={375}
                          className="rounded-xl shadow-lg object-contain bg-white p-4"
                          style={{ border: '2px solid lightseagreen' }}
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
        <div className="mt-16 flex justify-center gap-4" style={{ border: '2px solid darkviolet' }}>
          <Link href="/database" className="w-32" style={{ border: '1px solid darkturquoise' }}>
            <Button size="lg" className="w-full h-10">Get Started</Button>
          </Link>
          <Link href="/documentation" className="w-32" style={{ border: '1px solid darkturquoise' }}>
            <Button size="lg" variant="outline" className="w-full h-10">
              Learn More
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
