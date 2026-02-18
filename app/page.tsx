import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ChevronDown, FileText, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Viewport */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 relative overflow-hidden">
        {/* Adinkra symbols background */}
        <div
          className="absolute inset-0 z-0 bg-[#014d6d] dark:bg-[#FFCA06] opacity-[0.025]"
          style={{
            maskImage: "url(/adinkra/adinkra_background.svg)",
            WebkitMaskImage: "url(/adinkra/adinkra_background.svg)",
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-brand">
              Smart analytics
            </span>{" "}
            <span className="text-foreground">for a</span>{" "}
            <span className="text-foreground whitespace-nowrap">data-driven world</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            The ultimate data analytics hub to centralize, visualize, and streamline your insights — all in one powerful platform.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>

      {/* Section 2: Simple and Easy */}
      <section className="relative overflow-hidden px-4 py-12">
        {/* Adinkra pattern overlay fading downward */}
        <div
          className="absolute inset-0 z-0 bg-[#014d6d] dark:bg-[#FFCA06] opacity-[0.025]"
          style={{
            maskImage: `url(/adinkra/adinkra_background.svg), linear-gradient(to bottom, black 0%, transparent 95%)`,
            maskSize: "cover, 100% 100%",
            maskRepeat: "no-repeat, no-repeat",
            maskComposite: "intersect",
            WebkitMaskImage: `url(/adinkra/adinkra_background.svg), linear-gradient(to bottom, black 0%, transparent 95%)`,
            WebkitMaskSize: "cover, 100% 100%",
            WebkitMaskRepeat: "no-repeat, no-repeat",
            WebkitMaskComposite: "source-in",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black">
            Finally, a{" "}
            <span className="bg-secondary text-secondary-foreground dark:bg-primary dark:text-primary-foreground px-2 py-0.5 rounded">simple and easy</span>
            {" "}way to access all your dashboards in one place!
          </h2>
        </div>
      </section>

      {/* Section 3: Unlock insights */}
      <section className="px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Unlock insights, drive decisions
            </h2>
            <p className="text-lg text-muted-foreground">
              Track, analyze, and act on real-time data. Gain instant visibility into your operations and make informed choices without delays.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/features-1.svg"
              alt="Data visualization illustration"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Your data, visualized */}
      <section className="px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="flex justify-center order-2 md:order-1">
            <img
              src="/features-2.svg"
              alt="Team collaboration illustration"
              className="w-full max-w-md"
            />
          </div>
          <div className="space-y-4 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold">
              Your data, visualized & simplified
            </h2>
            <p className="text-lg text-muted-foreground">
              Transform complex datasets into clear, actionable insights. Beautiful dashboards that tell the story your data wants to share.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Data that speaks */}
      <section className="px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Data that speaks, analytics that work
            </h2>
            <p className="text-lg text-muted-foreground">
              No more guesswork. Get the answers you need, when you need them. Powerful analytics that drive real business outcomes.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/features-3.svg"
              alt="Analytics chart illustration"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Card className="w-full md:w-[calc(33.333%-1rem)] max-w-sm">
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-icon-momo mb-4">
                  <BarChart3 className="h-6 w-6 icon-momo-blue" />
                </div>
                <CardTitle>Power BI Dashboards</CardTitle>
                <CardDescription>
                  Access 7 categories of interactive dashboards including DAF, Digital, Home, MCS, Predictive Analysis, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="w-full md:w-[calc(33.333%-1rem)] max-w-sm">
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-icon-momo mb-4">
                  <FileText className="h-6 w-6 icon-momo-blue" />
                </div>
                <CardTitle>Request Analytics</CardTitle>
                <CardDescription>
                  Submit requests for new dashboards, custom reports, data analysis, and modifications with real-time tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="w-full md:w-[calc(33.333%-1rem)] max-w-sm">
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-icon-momo mb-4">
                  <Zap className="h-6 w-6 icon-momo-blue" />
                </div>
                <CardTitle>Fast & Efficient</CardTitle>
                <CardDescription>
                  Lightning-fast performance with modern architecture, and seamless user experience.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card text-card-foreground relative overflow-hidden">
        {/* Left Adinkra pattern */}
        <div
          className="absolute left-0 inset-y-0 w-1/2 z-0 bg-[#014d6d] dark:bg-[#FFCA06] opacity-[0.025]"
          style={{
            maskImage: "url(/adinkra/adinkra_background.svg), linear-gradient(to right, black 0%, transparent 70%)",
            WebkitMaskImage: "url(/adinkra/adinkra_background.svg), linear-gradient(to right, black 0%, transparent 70%)",
            maskSize: "cover, 100% 100%",
            WebkitMaskSize: "cover, 100% 100%",
            maskRepeat: "no-repeat, no-repeat",
            WebkitMaskRepeat: "no-repeat, no-repeat",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
        {/* Right Adinkra pattern */}
        <div
          className="absolute right-0 inset-y-0 w-1/2 z-0 bg-[#014d6d] dark:bg-[#FFCA06] opacity-[0.025]"
          style={{
            maskImage: "url(/adinkra/adinkra_background.svg), linear-gradient(to left, black 0%, transparent 70%)",
            WebkitMaskImage: "url(/adinkra/adinkra_background.svg), linear-gradient(to left, black 0%, transparent 70%)",
            maskSize: "cover, 100% 100%",
            WebkitMaskSize: "cover, 100% 100%",
            maskRepeat: "no-repeat, no-repeat",
            WebkitMaskRepeat: "no-repeat, no-repeat",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
        <div className="relative z-10 container px-4 py-8 mx-auto text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LynxSphynx Co. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with 💛 in Ghana 🇬🇭
          </p>
        </div>
      </footer>
    </div>
  );
}
