import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const featureBlocks = [
  {
    title: "Collaborate and build in a git-based workflow",
    description: "Sync your docs to GitHub or GitLab and collaborate in GitBook’s WYSIWYG editor or your IDE.",
    image: "/file.svg",
  },
  {
    title: "Publish beautiful, hosted docs in one click",
    description: "Add your own branding and publish. Docs are automatically optimized for SEO and AI data ingestion.",
    image: "/globe.svg",
  },
  {
    title: "Create a seamless experience between your docs and product",
    description: "Connect your docs and product more deeply, and give users a personalized experience with adaptive content.",
    image: "/window.svg",
  },
  {
    title: "Measure and improve KPIs with testing and analytics",
    description: "Use built-in insights to track your docs’ success and focus on improving conversion, signups and more.",
    image: "/vercel.svg",
  },
  {
    title: "Get started for free",
    description: "Play around with GitBook and set up your docs for free. Add your team and pay when you’re ready.",
    image: "/next.svg",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative w-full py-12 md:py-24 lg:py-32">
        <div className="container">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Beta
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Intelligent Database for Transcription Factor Research
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-muted-foreground md:text-xl">
              Accelerate your research with a curated, searchable, and
              filterable database of transcription factors linked to aging and
              disease. Explore our comprehensive data and find your next
              therapeutic target.
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
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </section>

      <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
        <div className="container mx-auto">
          <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Our Data
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Comprehensive and Curated
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our database is meticulously curated from hundreds of publicly
                available datasets and scientific publications. We provide a
                comprehensive resource for transcription factor research.
              </p>
            </div>
            <Image
              alt="Data"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="310"
              src="/file.svg"
              width="550"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto grid items-center justify-center gap-4 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Discover Your Next Breakthrough
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our powerful search and filtering capabilities allow you to
              quickly find the information you need. Start exploring our
              database today.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <div className="flex justify-center gap-4">
              <Link href="/database">
                <Button size="lg">Explore Database</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Simplify your docs workflow and help your users succeed
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            GitBook gives your teams everything you need to create unbeatable docs — with a workflow that your whole team will recognize, and insights to measure success.
          </p>
          {/* Vertical timeline line */}
          <div className="hidden md:block absolute left-0 top-0 h-full w-12">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-gray-300" style={{ transform: 'translateX(-50%)' }} />
          </div>
          <div className="space-y-20 relative">
            {featureBlocks.map((block, idx) => (
              <div key={block.title} className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-0 relative">
                {/* Branch and circle */}
                <div className="hidden md:block absolute left-0" style={{ top: `calc(50% - 1.5rem)` }}>
                  <div className="flex items-center h-12">
                    <div className="w-6 h-0.5 bg-blue-200" />
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-500 ml-[-8px] shadow" />
                  </div>
                </div>
                {/* Content and image: always text left, image right */}
                <div className="flex-1 flex flex-col md:flex-row items-center md:items-start">
                  <div className="md:w-1/2 w-full flex flex-col justify-center px-4 md:pl-20 md:pr-8 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">{block.title}</h3>
                    <p className="text-base text-muted-foreground mb-4">{block.description}</p>
                    <Button variant="outline" className="w-fit mx-auto md:mx-0" disabled>
                      Learn More
                    </Button>
                  </div>
                  <div className="md:w-1/2 w-full flex justify-center items-center mb-6 md:mb-0">
                    <Image
                      src={block.image}
                      alt={block.title}
                      width={340}
                      height={220}
                      className="rounded-xl shadow-lg object-contain bg-white p-4"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
