import React, { useState } from "react";
import { EvaluationResult, ApplicantData, EventContext, RecommendedActionType } from "../types";
import { TrustRiskSignals } from "./TrustRiskSignals";
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  Share2,
  Copy,
  Check,
  Award,
  Sparkles,
  Target,
  Briefcase,
  TrendingUp,
  MessageSquare,
  FileCheck,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers
} from "lucide-react";

interface EvaluationResultViewProps {
  result: EvaluationResult;
  applicant: ApplicantData;
  eventContext: EventContext;
  onSaveStatus?: (status: "APPROVED" | "FLAGGED" | "NEED_INFO" | "DECLINED", notes: string) => void;
  initialStatus?: "UNREVIEWED" | "APPROVED" | "FLAGGED" | "DECLINED" | "NEED_INFO";
  initialNotes?: string;
}

export const EvaluationResultView: React.FC<EvaluationResultViewProps> = ({
  result,
  applicant,
  eventContext,
  onSaveStatus,
  initialStatus = "UNREVIEWED",
  initialNotes = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [organizerStatus, setOrganizerStatus] = useState<string>(initialStatus);
  const [organizerNotes, setOrganizerNotes] = useState<string>(initialNotes);
  const [activeTab, setActiveTab] = useState<"overview" | "signals" | "collaboration" | "details">("overview");

  const { overallAssessment, eventFitAnalysis, intentAnalysis, professionalRelevance, trustSignals, riskSignals, collaborationValue } = result;

  const getActionBadge = (action: RecommendedActionType) => {
    switch (action) {
      case "適合參與":
        return {
          label: "適合參與 (Recommended for Admission)",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-200",
          icon: CheckCircle2,
          textColor: "text-emerald-700",
          dotColor: "bg-emerald-500",
        };
      case "建議人工確認":
        return {
          label: "建議人工確認 (Manual Verification Advised)",
          bg: "bg-amber-50 text-amber-900 border-amber-300 ring-amber-200",
          icon: AlertCircle,
          textColor: "text-amber-700",
          dotColor: "bg-amber-500",
        };
      case "需要更多資料":
        return {
          label: "需要更多資料 (More Information Needed)",
          bg: "bg-sky-50 text-sky-900 border-sky-300 ring-sky-200",
          icon: HelpCircle,
          textColor: "text-sky-700",
          dotColor: "bg-sky-500",
        };
      case "與本次活動關聯較低":
      default:
        return {
          label: "與本次活動關聯較低 (Low Relevance to This Event)",
          bg: "bg-slate-100 text-slate-800 border-slate-300 ring-slate-200",
          icon: XCircle,
          textColor: "text-slate-600",
          dotColor: "bg-slate-400",
        };
    }
  };

  const getRiskBadge = (level: "LOW" | "MODERATE" | "HIGH") => {
    switch (level) {
      case "LOW":
        return {
          text: "低風險 (Low Risk)",
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "MODERATE":
        return {
          text: "中度需注意 (Moderate Risk)",
          bg: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "HIGH":
      default:
        return {
          text: "高度需人工查驗 (High Risk)",
          bg: "bg-rose-100 text-rose-800 border-rose-200",
        };
    }
  };

  const actionMeta = getActionBadge(overallAssessment.recommendedAction);
  const riskMeta = getRiskBadge(overallAssessment.riskLevel);
  const ActionIcon = actionMeta.icon;

  const handleCopyReport = () => {
    const report = `【Brand Event Risk & Fit Engine 評估報告】
評估對象：${applicant.name} (${applicant.title || "無職稱"} @ ${applicant.company || "未指定公司"})
評估基準活動：${eventContext.title} (${eventContext.type})

■ 綜合評估摘要
- 活動適配度分數：${overallAssessment.eventFitScore} / 100
- 潛在合作價值分數：${overallAssessment.collaborationScore} / 100
- 風險等級：${riskMeta.text}
- 建議行動方針：${overallAssessment.recommendedAction}
- 結論摘要：${overallAssessment.executiveSummary}
- 主辦方操作建議：${overallAssessment.actionAdvice}

■ 活動適配度 (Event Fit)：${eventFitAnalysis.rating}
${eventFitAnalysis.details}
核心契合點：
${eventFitAnalysis.keyMatchPoints.map(p => `• ${p}`).join("\n")}

■ 報名目的分析 (Intent)：
- 清晰度：${intentAnalysis.clarity} | 與活動一致性：${intentAnalysis.alignment}
${intentAnalysis.details}

■ 專業背景關聯 (Professional Relevance)：${professionalRelevance.relevanceLevel}
${professionalRelevance.details}
專業亮點：${professionalRelevance.highlightSkills.join(", ")}

■ 可信度訊號 (Trust Signals)：
${trustSignals.map(s => `[${s.category}] ${s.description}`).join("\n") || "無顯著正面記錄"}

■ 待查證風險訊號 (Risk Signals)：
${riskSignals.map(s => `[${s.severity} - ${s.category}] ${s.description}`).join("\n") || "無顯著異常訊號"}

■ 合作價值評估 (Collaboration Value)：${collaborationValue.potentialValueLevel}
${collaborationValue.details}
各維度剖析：
${collaborationValue.valueDimensions.map(v => `• ${v.dimension}：${v.explanation}`).join("\n")}

■ 建議主辦方跟進查核問題：
${overallAssessment.suggestedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

*聲明：本報告由 AI 結構化分析生成，僅作為主辦方人工決策輔助，不構成自動排他裁決。`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleStatusChange = (status: "APPROVED" | "FLAGGED" | "NEED_INFO" | "DECLINED") => {
    setOrganizerStatus(status);
    if (onSaveStatus) {
      onSaveStatus(status, organizerNotes);
    }
  };

  return (
    <div id="evaluation-result-container" className="space-y-6">
      {/* 1. Top Executive Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                  AI 結構化評估結果
                </span>
                <span className="text-xs text-slate-300">
                  基準：{eventContext.title.slice(0, 30)}...
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                {applicant.name}
                <span className="text-sm font-normal text-slate-300">
                  {applicant.title ? `${applicant.title} · ` : ""}
                  {applicant.company || ""}
                </span>
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                id="copy-report-btn"
                type="button"
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-xs border border-white/10"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    已複製完整評估報告
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    複製評估報告
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Executive Highlights Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 border-b border-slate-200/80">
          {/* Recommended Action Card */}
          <div className="md:col-span-2 p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                主辦方推薦行動 (Decision Aid)
              </span>
              <div className="mt-2 flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${actionMeta.bg}`}>
                  <ActionIcon className={`w-5 h-5 ${actionMeta.textColor}`} />
                </div>
                <div>
                  <div className={`text-base font-bold ${actionMeta.textColor}`}>
                    {overallAssessment.recommendedAction}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    僅供主辦方輔助參考，請結合現場配額做最終裁決
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
              建議步驟：{overallAssessment.actionAdvice}
            </div>
          </div>

          {/* Event Fit Score */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              活動適配度 (Event Fit)
            </span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {overallAssessment.eventFitScore}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {eventFitAnalysis.rating}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, overallAssessment.eventFitScore))}%` }}
              />
            </div>
          </div>

          {/* Collaboration Value & Risk */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  合作價值分數
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${riskMeta.bg}`}>
                  {riskMeta.text}
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {overallAssessment.collaborationScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
                <span className="ml-auto text-xs font-semibold text-slate-600">
                  {collaborationValue.potentialValueLevel}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, overallAssessment.collaborationScore))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-5 sm:p-6 bg-white">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                評估摘要結論 (Executive Summary)
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {overallAssessment.executiveSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-5 border-t border-slate-200 bg-slate-50 flex gap-1 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            1. 適配度與報名動機
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signals")}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === "signals"
                ? "border-indigo-600 text-indigo-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            2. 可信度與風險訊號 ({trustSignals.length}/{riskSignals.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("collaboration")}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === "collaboration"
                ? "border-indigo-600 text-indigo-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            3. 合作價值多維分析
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === "details"
                ? "border-indigo-600 text-indigo-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            4. 主辦方查核提問建議
          </button>
        </div>
      </div>

      {/* 2. Tab Contents */}
      {/* Tab 1: Overview - Event Fit, Intent, Professional Relevance */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Fit Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    活動適配度深入剖析 (Event Fit)
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  契合等級：{eventFitAnalysis.rating}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                {eventFitAnalysis.details}
              </p>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                  關鍵契合點 (Key Match Points)
                </span>
                <ul className="space-y-1.5">
                  {eventFitAnalysis.keyMatchPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Intent Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    報名目的與真實動機 (Intent Analysis)
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                    清晰度：{intentAnalysis.clarity}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                    一致性：{intentAnalysis.alignment}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                {intentAnalysis.details}
              </p>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">申請人填報之報名目的：</span>
                <p className="text-slate-600 italic">"{applicant.intent || "未詳細填寫"}"</p>
              </div>
            </div>
          </div>

          {/* Professional Relevance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  專業背景與產業經驗 (Professional Relevance)
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {professionalRelevance.relevanceLevel}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              {professionalRelevance.details}
            </p>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                專業亮點技能與領域 (Highlighted Domain & Skills)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {professionalRelevance.highlightSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Inline Trust & Risk Signals preview in Overview */}
          <TrustRiskSignals
            trustSignals={trustSignals}
            riskSignals={riskSignals}
          />
        </div>
      )}

      {/* Tab 2: Full Signals */}
      {activeTab === "signals" && (
        <div className="space-y-4">
          <TrustRiskSignals
            trustSignals={trustSignals}
            riskSignals={riskSignals}
          />
        </div>
      )}

      {/* Tab 3: Collaboration Value */}
      {activeTab === "collaboration" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  合作價值與品牌綜效評估 (Collaboration Value)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                分析申請人為品牌、主辦方及其他與會者帶來的正面價值
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">潛在價值評級：</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                {collaborationValue.potentialValueLevel}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {collaborationValue.details}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {collaborationValue.valueDimensions.map((val, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4 className="text-xs font-bold text-slate-900">
                    {val.dimension}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {val.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Questions & Action Advice */}
      {activeTab === "details" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                主辦方跟進查核與提問建議 (Suggested Verification Checklist)
              </h3>
              <p className="text-xs text-slate-500">
                若需進一步確認，可於行前信件、電話或現場交流中詢問以下問題
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {overallAssessment.suggestedQuestions.map((question, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-indigo-50/40 border border-indigo-100 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {question}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="font-semibold text-slate-900 block mb-1">
              主辦方決策小撇步：
            </span>
            <p className="leading-relaxed">
              若該申請人被標註為「需要更多資料」或「建議人工確認」，建議可直接回覆系統信請其補充 LinkedIn 個人履歷連結、近期主要負責專案或明確的現場交流期待，通常能於 24 小時內快速釐清意向。
            </p>
          </div>
        </div>
      )}

      {/* 3. Human Decision Marker & Notes (人工覆核決策留存) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              主辦方人工決策覆核註記 (Organizer Review)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            記錄將保存在瀏覽器本地歷史中
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-slate-700 mr-1">
            人工審查標記：
          </span>
          <button
            type="button"
            onClick={() => handleStatusChange("APPROVED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              organizerStatus === "APPROVED"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            ✓ 核准通過 (Approved)
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("NEED_INFO")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              organizerStatus === "NEED_INFO"
                ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                : "bg-white text-sky-700 border-sky-300 hover:bg-sky-50"
            }`}
          >
            ? 待補件確認 (Need Info)
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("FLAGGED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              organizerStatus === "FLAGGED"
                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                : "bg-white text-amber-700 border-amber-300 hover:bg-amber-50"
            }`}
          >
            ! 標記疑慮 (Flagged)
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("DECLINED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              organizerStatus === "DECLINED"
                ? "bg-slate-700 text-white border-slate-700 shadow-xs"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            }`}
          >
            ✕ 婉拒名額 (Declined)
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            主辦方內部覆核備忘錄 (Internal Review Notes)
          </label>
          <textarea
            rows={2}
            value={organizerNotes}
            onChange={(e) => {
              setOrganizerNotes(e.target.value);
              if (onSaveStatus) {
                onSaveStatus(organizerStatus as any, e.target.value);
              }
            }}
            placeholder="記錄主辦方電話查核結論、座位安排、引薦對象或特別備註..."
            className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
};
