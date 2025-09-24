import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs.jsx";
import { Badge } from "@/Components/ui/badge.jsx";
import { Skeleton } from "@/Components/ui/skeleton.jsx";
import { BarChart3, Bot, Users } from "lucide-react";
import JudgeBotAnalyzer from "../Components/analytics/JudgeBotAnalyzer.jsx";
import SurveyManager from "../Components/analytics/SurveyManager.jsx";

const InfoCard = ({ title, value, badgeText }) => (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-lg font-semibold text-white mt-1">{value}</p>
        {badgeText && <Badge className="mt-3 text-xs border-white/20 text-gray-300">{badgeText}</Badge>}
    </div>
);

async function listCampaigns() {
    return [
        { id: "c1", name: "Autumn Launch", status: "active", budget: 25000, target_audience: "Gen Z" },
        { id: "c2", name: "Holiday Promo", status: "draft", budget: 15000, target_audience: "Families" }
    ];
}
async function filterCampaignJudgement(q) {
    return [
        { id: "j1", campaign_id: q.campaign_id, judge_type: "ai_bot", score: 78 }
    ];
}
async function filterSurveyRequest(q) {
    return [
        { id: "s1", campaign_id: q.campaign_id, respondents: 120 }
    ];
}

export default function CampaignAnalytics() {
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [judgements, setJudgements] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        setIsLoadingCampaigns(true);
        listCampaigns().then(data => {
            setCampaigns(data);
            if (data.length > 0) setSelectedCampaignId(data[0].id);
            setIsLoadingCampaigns(false);
        });
    }, []);

    useEffect(() => {
        if (!selectedCampaignId) return;
        setIsLoadingData(true);
        Promise.all([
            filterCampaignJudgement({ campaign_id: selectedCampaignId }),
            filterSurveyRequest({ campaign_id: selectedCampaignId })
        ]).then(([judgementData, surveyData]) => {
            setJudgements(judgementData);
            setSurveys(surveyData);
            setIsLoadingData(false);
        });
    }, [selectedCampaignId]);

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
    const botAnalysis = judgements.find(j => j.judge_type === "ai_bot");

    const handleAnalysisComplete = (analysis) => setJudgements(prev => [...prev, analysis]);
    const handleSurveyCreated = (survey) => setSurveys(prev => [...prev, survey]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white">Campaign Analytics Center</h1>
                    <p className="text-gray-400 mt-2">Get feedback from AI Judge Bot and human surveys.</p>
                </div>
                {isLoadingCampaigns ? <Skeleton className="h-12 w-80 bg-white/10" /> : (
                    <Select onValueChange={setSelectedCampaignId} value={selectedCampaignId}>
                        <SelectTrigger className="w-full md:w-[320px] bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select a campaign..." /></SelectTrigger>
                        <SelectContent className="bg-[#2a2a2a] border-white/20 text-white">{campaigns.map(c => <SelectItem key={c.id} value={c.id} className="focus:bg-orange-500/30">{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                )}
            </div>

            {selectedCampaign ? (
                <div className="grid lg:grid-cols-3 gap-8">
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-4">Campaign Overview</h3>
                            <div className="space-y-4">
                                <InfoCard title="Campaign Name" value={selectedCampaign.name} />
                                <InfoCard title="Status" value={<span className="capitalize">{selectedCampaign.status}</span>} />
                                <InfoCard title="Budget" value={`$${(selectedCampaign.budget || 0).toLocaleString()}`} />
                                <InfoCard title="Target Audience" value={selectedCampaign.target_audience || 'N/A'} />
                            </div>
                        </div>
                    </aside>

                    <main className="lg:col-span-2">
                        <Tabs defaultValue="judge-bot" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10 p-1.5 rounded-xl">
                                <TabsTrigger value="judge-bot" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"><Bot className="w-4 h-4 mr-2" /> AI Judge Bot</TabsTrigger>
                                <TabsTrigger value="human-survey" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"><Users className="w-4 h-4 mr-2" /> Human Surveys</TabsTrigger>
                            </TabsList>
                            <TabsContent value="judge-bot" className="mt-6">
                                {isLoadingData ? <Skeleton className="h-96 w-full bg-white/5"/> : <JudgeBotAnalyzer campaign={selectedCampaign} onAnalysisComplete={handleAnalysisComplete} />}
                            </TabsContent>
                            <TabsContent value="human-survey" className="mt-6">
                                {isLoadingData ? <Skeleton className="h-96 w-full bg-white/5"/> : <SurveyManager campaign={selectedCampaign} onSurveyCreated={handleSurveyCreated} />}
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500"><BarChart3 className="w-16 h-16 mx-auto mb-4" /><h3 className="text-xl font-semibold">Select a Campaign</h3><p>Choose a campaign to view its analytics.</p></div>
            )}
        </div>
    );
}
