import React from "react";
import { ApplicantData } from "../types";
import { SAMPLE_APPLICANTS, SampleApplicantProfile, EMPTY_APPLICANT } from "../constants/presets";
import { User, Building2, Briefcase, Globe, FileText, Link2, Target, History, Sparkles, Check, Users, AlertCircle, Trash2 } from "lucide-react";

interface ApplicantFormProps {
  formData: ApplicantData;
  onChange: (updated: ApplicantData) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onClear: () => void;
}

export const ApplicantForm: React.FC<ApplicantFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  onClear,
}) => {
  const handleFieldChange = (field: keyof ApplicantData, value: any) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const handleSelectSample = (sample: SampleApplicantProfile) => {
    onChange({ ...sample.applicant });
  };

  const isFormValid = Boolean(formData.name.trim() && (formData.company.trim() || formData.title.trim() || formData.bio.trim() || formData.intent.trim()));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 mb-8">
      {/* Form Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              活動申請人資料輸入
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            輸入報名資料以啟動適配度、動機實質性、可信度訊號與潛在合作價值結構化分析
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            快速載入典型案例：
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {SAMPLE_APPLICANTS.map((sample) => (
              <button
                key={sample.id}
                id={`sample-btn-${sample.id}`}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 transition-colors"
                title={`${sample.description} (${sample.categoryTag})`}
              >
                {sample.nameBadge}
              </button>
            ))}
            <button
              id="clear-form-btn"
              type="button"
              onClick={onClear}
              className="p-1 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              title="清空表單資料"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Input Grid */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid && !isLoading) {
            onSubmit();
          }
        }}
        className="space-y-4"
      >
        {/* Row 1: Basic Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="applicant-name"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              姓名／暱稱 <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="applicant-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="例如：林宥安 (Eason)"
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="applicant-title"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              職稱
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="applicant-title"
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="例如：Co-Founder & CTO"
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="applicant-company"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              公司或組織
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="applicant-company"
                type="text"
                value={formData.company}
                onChange={(e) => handleFieldChange("company", e.target.value)}
                placeholder="例如：NexusFlow AI 新創"
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="applicant-industry"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              產業
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="applicant-industry"
                type="text"
                value={formData.industry}
                onChange={(e) => handleFieldChange("industry", e.target.value)}
                placeholder="例如：企業級 AI / 自動化"
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Social Links & Community Member Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="applicant-social-url"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              LinkedIn／個人網站／社群資訊
            </label>
            <div className="relative">
              <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="applicant-social-url"
                type="text"
                value={formData.socialUrl}
                onChange={(e) => handleFieldChange("socialUrl", e.target.value)}
                placeholder="例如：https://www.linkedin.com/in/username 或 GitHub / 作品集"
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              是否為既有社群／生態系成員？
            </label>
            <div className="h-9 flex items-center">
              <label
                id="applicant-community-toggle"
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-medium transition-all ${
                  formData.isCommunityMember
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.isCommunityMember}
                  onChange={(e) => handleFieldChange("isCommunityMember", e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Users className={`w-3.5 h-3.5 ${formData.isCommunityMember ? "text-emerald-600" : "text-slate-400"}`} />
                <span>{formData.isCommunityMember ? "是既有社群成員" : "非社群成員 / 新朋友"}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Row 3: Bio & Background */}
        <div>
          <label
            htmlFor="applicant-bio"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            自我介紹／專業經歷背景
          </label>
          <textarea
            id="applicant-bio"
            rows={2}
            value={formData.bio}
            onChange={(e) => handleFieldChange("bio", e.target.value)}
            placeholder="請簡述個人背景、目前負責主要業務、專業專長或過去成果..."
            className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
          />
        </div>

        {/* Row 4: Intent & Relevance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="applicant-intent"
              className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between"
            >
              <span>報名目的</span>
              <span className="text-[10px] text-slate-400 font-normal">評估目的合理性與是否有非目標行為</span>
            </label>
            <textarea
              id="applicant-intent"
              rows={2}
              value={formData.intent}
              onChange={(e) => handleFieldChange("intent", e.target.value)}
              placeholder="例如：希望與同業交流 AI 系統落地架構挑戰、尋找生態系夥伴、學習最新模型實務..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="applicant-relevance"
              className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between"
            >
              <span>與本次活動的關聯</span>
              <span className="text-[10px] text-slate-400 font-normal">申請人自述與本活動主題契合點</span>
            </label>
            <textarea
              id="applicant-relevance"
              rows={2}
              value={formData.relevance}
              onChange={(e) => handleFieldChange("relevance", e.target.value)}
              placeholder="例如：目前正在開發的產品與活動主題直接相關，能提供一線落地案例分享..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
            />
          </div>
        </div>

        {/* Row 5: Past Events & Other Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="applicant-past-events"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              過往活動參與／社群經歷
            </label>
            <input
              id="applicant-past-events"
              type="text"
              value={formData.pastEvents}
              onChange={(e) => handleFieldChange("pastEvents", e.target.value)}
              placeholder="例如：曾擔任 PyCon 講者、參加過前次技術茶會..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="applicant-notes"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              其他補充資訊／備註
            </label>
            <input
              id="applicant-notes"
              type="text"
              value={formData.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="例如：願意提供閃電短講、可攜帶樣品展示、有特定飲食限制..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
            />
          </div>
        </div>

        {/* Action Trigger Banner */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              AI 將多維度檢索可信度訊號與需查核疑點，並依據活動標準給出推薦行動建議。
            </span>
          </div>

          <button
            id="start-ai-evaluation-btn"
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all ${
              !isFormValid || isLoading
                ? "bg-slate-300 cursor-not-allowed text-slate-500"
                : "bg-slate-900 hover:bg-indigo-600 active:scale-[0.99] cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                AI 正在結構化分析中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-300" />
                啟動 AI 結構化深度評估
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
