import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Pages/Dashboard";
import CampaignBuilder from "./Pages/CampaignBuilder";
import CampaignAnalytics from "./Pages/CampaignAnalytics";
import AgentChat from "./Pages/AgentChat";
import CreativePlayground from "./Pages/CreativePlayground";
import ABManager from "./Pages/ABManager";
import ModelOps from "./Pages/ModelOps";
import ResearchPapers from "./Pages/ResearchPapers";
import ViewResearchPaper from "./Pages/ViewResearchPaper";
import WorkflowVisualizer from "./Pages/WorkflowVisualizer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/CampaignBuilder" element={<CampaignBuilder />} />
          <Route path="/CampaignAnalytics" element={<CampaignAnalytics />} />
          <Route path="/AgentChat" element={<AgentChat />} />
          <Route path="/CreativePlayground" element={<CreativePlayground />} />
          <Route path="/ABManager" element={<ABManager />} />
          <Route path="/ModelOps" element={<ModelOps />} />
          <Route path="/ResearchPapers" element={<ResearchPapers />} />
          <Route path="/ViewResearchPaper" element={<ViewResearchPaper />} />
          <Route path="/WorkflowVisualizer" element={<WorkflowVisualizer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);

