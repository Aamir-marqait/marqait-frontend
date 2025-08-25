import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, ChevronRight } from "lucide-react";
import { SocialLinks } from "@/components/social-links";
import { getSupportCardById } from "@/data/supportCards";
import Header from "@/components/help-and-support/help-support-header";

export default function SupportArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const supportCard = id ? getSupportCardById(id) : undefined;

  if (!supportCard) {
    return (
      <div className="min-h-screen min-w-[95rem] mx-auto bg-background">
        <Header />
        <nav className="border-b border-border px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center text-sm text-muted-foreground">
            <button
              onClick={() => navigate("/help-support")}
              className="hover:text-foreground transition-colors"
            >
              Standard Support
            </button>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-foreground">Article Not Found</span>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The support article you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/help-support")}>
              Back to Support
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-24 flex flex-col gap-5">
        <nav className="">
          <div className="flex items-center text-sm text-muted-foreground">
            <button
              onClick={() => navigate("/help-support")}
              className="hover:text-foreground transition-colors"
            >
              Standard Support
            </button>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-foreground">{supportCard.title}</span>
          </div>
        </nav>
        <div className="">
          {/* Header Section */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-foreground">
              {supportCard.title}
            </h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Copy className="h-4 w-4" />
                Copy Page
              </Button>
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-700"
              >
                All FAQs
              </Button>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {/* Overview Section */}
                <section id="overview">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {supportCard.content.overview}
                  </p>
                </section>

                {/* Content Sections */}
                {supportCard.content.sections.map((section, index) => (
                  <section key={index} id={`section-${index}`}>
                    <h2 className="mb-4 text-xl font-semibold text-foreground">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </section>
                ))}

                {/* FAQ Section */}
                {supportCard.content.faq &&
                  supportCard.content.faq.length > 0 && (
                    <section id="faq">
                      <h2 className="mb-4 text-xl font-semibold text-foreground">
                        Frequently Asked Questions
                      </h2>
                      <div className="space-y-6">
                        {supportCard.content.faq.map((faq, index) => (
                          <div key={index}>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                              {faq.question}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
              </div>

              {/* Have a Question Section */}
            </div>

            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-4 text-sm font-medium text-foreground">
                    On this Page
                  </h3>
                  <nav className="space-y-2">
                    <a
                      href="#overview"
                      className="block text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Overview
                    </a>
                    {supportCard.content.sections.map((section, index) => (
                      <a
                        key={index}
                        href={`#section-${index}`}
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                    {supportCard.content.faq &&
                      supportCard.content.faq.length > 0 && (
                        <a
                          href="#faq"
                          className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Frequently Asked Questions
                        </a>
                      )}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Have a Question?
            </h2>
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
