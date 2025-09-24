import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, Beaker, Database, FileJson } from "lucide-react";

// Local helpers replacing missing modules
function createPageUrl(page) { return `/${page || ''}`; }

const Card = ({ children, className = "" }) => (
    <div className={`rounded-xl bg-white shadow-lg border border-gray-200 ${className}`}>{children}</div>
);
const CardHeader = ({ children, className = "" }) => (
    <div className={`p-5 border-b border-gray-100 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
);
const CardContent = ({ children, className = "" }) => (
    <div className={`p-5 ${className}`}>{children}</div>
);
const Button = ({ children, className = "", variant = "solid", ...props }) => (
    <button
        className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border ${variant === 'outline' ? 'bg-white border-gray-300 text-gray-700' : 'bg-purple-600 border-purple-600 text-white'} ${className}`}
        {...props}
    >{children}</button>
);
const Badge = ({ children, className = "" }) => (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${className}`}>{children}</span>
);
const Skeleton = ({ className = "h-4 w-full bg-gray-200 animate-pulse rounded" }) => (
    <div className={className} />
);

// Minimal markdown renderer fallback (render as pre-wrapped text)
const Markdown = ({ children }) => (
    <div style={{ whiteSpace: 'pre-wrap' }}>{children}</div>
);

// Mock ResearchPaper.get
async function fetchResearchPaperById(id) {
    return {
        id,
        title: "Sample Research Paper",
        authors: ["Jane Doe", "John Smith"],
        created_date: new Date().toISOString(),
        tags: ["AI", "Marketing"],
        abstract: "This paper explores AI-driven campaign optimization techniques.",
        content: "# Introduction\n\nThis is a placeholder markdown body for the research paper.",
        experiment_config: {
            model_name: "gpt-4-class",
            dataset: "ad_variants_v2",
            metrics: { accuracy: 0.91, f1: 0.88 },
            hyperparameters: { temperature: 0.7, top_p: 0.9 }
        },
        reproducibility_artifacts: ["dataset", "hyperparameters"]
    };
}

const ArtifactCard = ({ title, description, icon: Icon, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg border border-gray-200 bg-white hover:border-purple-200 hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
                <Icon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    </a>
);

export default function ViewResearchPaper() {
    const location = useLocation();
    const [paper, setPaper] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("id") || "sample";
        const loadPaper = async () => {
            setIsLoading(true);
            try {
                const data = await fetchResearchPaperById(id);
                setPaper(data);
            } catch (error) {
                console.error("Error loading paper:", error);
            }
            setIsLoading(false);
        };
        loadPaper();
    }, [location.search]);

    const handlePrint = () => { window.print(); };

    if (isLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-4 pt-8">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>
        );
    }
    
    if (!paper) {
        return (
            <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500">Paper Not Found</h3>
                <Link to={createPageUrl("ResearchPapers")}>
                    <Button variant="link">Back to Library</Button>
                </Link>
            </div>
        );
    }

    const createdDateStr = new Date(paper.created_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-white p-6 md:p-10">
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #print-area, #print-area * { visibility: visible; }
                    #print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none; }
                }
            `}</style>
            <div id="print-area" className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8 no-print">
                    <Link to={createPageUrl("ResearchPapers")}>
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Library
                        </Button>
                    </Link>
                    <Button className="gap-2" onClick={handlePrint}>
                        <Download className="w-4 h-4" /> Export to PDF
                    </Button>
                </div>

                <header className="mb-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {paper.tags?.map(tag => (
                            <Badge key={tag} className="bg-purple-100 text-purple-700">{tag}</Badge>
                        ))}
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">{paper.title}</h1>
                    <p className="text-lg text-gray-600">
                        By {paper.authors?.join(', ')} on {createdDateStr}
                    </p>
                </header>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">Abstract</h2>
                    <p className="text-gray-700 leading-relaxed italic">{paper.abstract}</p>
                </section>

                <article className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-a:text-purple-600 hover:prose-a:text-purple-800">
                    <Markdown>{paper.content}</Markdown>
                </article>

                {paper.experiment_config && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-200 pb-2 mb-6 flex items-center gap-2">
                            <Beaker className="w-6 h-6" /> Reproducible Experiment
                        </h2>
                        <Card className="glass-card border-0 shadow-md">
                            <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold">Model</h4>
                                        <p>{paper.experiment_config.model_name}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Dataset</h4>
                                        <p>{paper.experiment_config.dataset}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Metrics</h4>
                                        <pre className="text-sm bg-gray-100 p-3 rounded-md overflow-x-auto">
                                            {JSON.stringify(paper.experiment_config.metrics, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Hyperparameters</h4>
                                    <pre className="text-sm bg-gray-100 p-3 rounded-md overflow-x-auto">
                                        {JSON.stringify(paper.experiment_config.hyperparameters, null, 2)}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}
                
                {paper.reproducibility_artifacts && paper.reproducibility_artifacts.length > 0 && (
                     <section className="mt-12">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Artifacts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ArtifactCard title="Dataset" description="Download sample data" icon={Database} href="#" />
                            <ArtifactCard title="Hyperparameters" description="hyperparams.json" icon={FileJson} href="#" />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
