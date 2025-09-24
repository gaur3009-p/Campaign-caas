
import React, { useState, useEffect } from "react";
import { BarChart3, TestTube2 } from "lucide-react";
import VariantComparisonCard from "../Components/ab/VariantComparisonCard.jsx";
import PerformanceSummary from "../Components/ab/PerformanceSummary.jsx";
import CampaignScoreCard from "../Components/analytics/CampaignScoreCard.jsx";

// Lightweight UI primitives to replace missing '@/components/ui/*'
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
const Skeleton = ({ className = "h-4 w-full bg-gray-200 animate-pulse rounded" }) => (
    <div className={className} />
);

// Simple Select using native <select>
const Select = ({ value, onValueChange, children }) => (
    <select className="w-full md:w-[280px] bg-white shadow-sm border border-gray-300 rounded px-3 py-2" value={value || ''} onChange={(e) => onValueChange(e.target.value)}>
        {children}
    </select>
);
const SelectTrigger = ({ children }) => children;
const SelectValue = ({ placeholder }) => <option value="" disabled>{placeholder}</option>;
const SelectContent = ({ children }) => children;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

// Mocked data in place of '@/entities/all'
async function fetchCampaigns() {
    return [
        { id: "c1", name: "Autumn Launch" },
        { id: "c2", name: "Holiday Promo" }
    ];
}
async function fetchVariantsByCampaign(campaignId) {
    return [
        { id: "v1", campaign_id: campaignId, headline: "Save Big Today", ctr: 3.2 },
        { id: "v2", campaign_id: campaignId, headline: "Limited Time Offer", ctr: 4.1 }
    ];
}
async function fetchAnalyticsByCampaign(campaignId) {
    return { campaign_id: campaignId, score: 82, lift: 12, recommendations: ["Test stronger CTA", "Add urgency"] };
}

export default function ABManager() {
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [variants, setVariants] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);

    useEffect(() => {
        const loadCampaigns = async () => {
            setIsLoadingCampaigns(true);
            try {
                const campaignData = await fetchCampaigns();
                setCampaigns(campaignData);
                if (campaignData.length > 0) {
                    setSelectedCampaignId(campaignData[0].id);
                }
            } catch (error) {
                console.error("Error loading campaigns:", error);
            }
            setIsLoadingCampaigns(false);
        };
        loadCampaigns();
    }, []);

    useEffect(() => {
        if (selectedCampaignId) {
            const loadVariants = async () => {
                setIsLoadingVariants(true);
                try {
                    const [variantData, analyticsData] = await Promise.all([
                        fetchVariantsByCampaign(selectedCampaignId),
                        fetchAnalyticsByCampaign(selectedCampaignId)
                    ]);
                    setVariants(variantData);
                    setAnalytics([analyticsData]);
                } catch (error) {
                    console.error("Error loading data:", error);
                }
                setIsLoadingVariants(false);
            };
            loadVariants();
        }
    }, [selectedCampaignId]);

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
    const campaignAnalytics = analytics.find(a => a.campaign_id === selectedCampaignId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            A/B Test Manager
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">
                            Compare variant performance and optimize campaigns automatically.
                        </p>
                    </div>
                    {isLoadingCampaigns ? (
                        <Skeleton className="h-10 w-64" />
                    ) : (
                        <Select onValueChange={setSelectedCampaignId} value={selectedCampaignId}>
                                <SelectValue placeholder="Select a campaign to analyze..." />
                            <SelectContent>
                                {campaigns.map(campaign => (
                                    <SelectItem key={campaign.id} value={campaign.id}>
                                        {campaign.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {selectedCampaign ? (
                    <div className="grid lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1">
                            {isLoadingVariants ? (
                                <Card><CardContent className="p-4"><Skeleton className="h-64" /></CardContent></Card>
                            ) : campaignAnalytics ? (
                                <CampaignScoreCard 
                                    analytics={campaignAnalytics}
                                    onImprove={() => console.log("Improve campaign action")}
                                    onFinalize={() => console.log("Finalize campaign action")}
                                />
                            ) : (
                                <Card className="border-2 border-dashed border-gray-200">
                                    <CardContent className="p-6 text-center">
                                        <BarChart3 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">No analytics available</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        <div className="lg:col-span-3 space-y-6">
                            <PerformanceSummary variants={variants} isLoading={isLoadingVariants} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isLoadingVariants ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <Card key={i}><CardContent className="p-4"><Skeleton className="h-48" /></CardContent></Card>
                                    ))
                                ) : variants.length > 0 ? (
                                    variants.map(variant => (
                                        <VariantComparisonCard key={variant.id} variant={variant} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20">
                                        <TestTube2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-500">No Variants Found</h3>
                                        <p className="text-gray-400 mt-2">This campaign has no copy variants to compare.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500">Select a Campaign</h3>
                        <p className="text-gray-400 mt-2">Choose a campaign from the dropdown to start your analysis.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
