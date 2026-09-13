import React, { useState } from "react";
import { EventContext } from "../types";
import { SAMPLE_EVENTS } from "../constants/presets";
import { Calendar, ChevronDown, ChevronUp, Sliders, CheckCircle2 } from "lucide-react";

interface EventContextCardProps {
  currentEvent: EventContext;
  onUpdateEvent: (updated: EventContext) => void;
}

export const EventContextCard: React.FC<EventContextCardProps> = ({
  currentEvent,
  onUpdateEvent
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  const handleSelectPreset = (eventId: string) => {
    const selected = SAMPLE_EVENTS.find(e => e.id === eventId);
    if (selected) {
      onUpdateEvent(selected);
      setIsCustomizing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs mb-6 overflow-hidden">
      {/* Top Banner Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 mt-0.5">
            <Calendar className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded">
                當前評估基準活動
              </span>
              <span className="text-xs text-slate-300">
                {currentEvent.type}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              {currentEvent.title}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            id="event-preset-select"
            value={SAMPLE_EVENTS.some(e => e.id === currentEvent.id) ? currentEvent.id : "custom"}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setIsCustomizing(true);
                setIsExpanded(true);
              } else {
                handleSelectPreset(e.target.value);
              }
            }}
            className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
          >
            {SAMPLE_EVENTS.map(ev => (
              <option key={ev.id} value={ev.id}>
                範本：{ev.title.slice(0, 24)}...
              </option>
            ))}
            <option value="custom">自訂活動條件...</option>
          </select>

          <button
            id="toggle-event-details-btn"
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
            title={isExpanded ? "收合活動詳情" : "展開活動詳情"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsed Brief Summary */}
      {!isExpanded && (
        <div className="px-5 py-2.5 bg-slate-50/70 border-t border-slate-200/80 flex flex-wrap items-center gap-y-1 gap-x-6 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-700">目標領域：</span>{" "}
            {currentEvent.targetIndustry}
          </div>
          <div>
            <span className="font-semibold text-slate-700">期望受眾：</span>{" "}
            {currentEvent.targetAudience}
          </div>
        </div>
      )}

      {/* Expanded Customizer / Inspector */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              活動評估基準設定
            </h3>
            <span className="text-xs text-slate-500">
              AI 將依據此活動設定，客觀評估申請人適配度與合作價值
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                活動名稱
              </label>
              <input
                id="edit-event-title"
                type="text"
                value={currentEvent.title}
                onChange={(e) => onUpdateEvent({ ...currentEvent, title: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例如：2026 AI Product & Founder 私享交流閉門會"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                活動性質／類型
              </label>
              <input
                id="edit-event-type"
                type="text"
                value={currentEvent.type}
                onChange={(e) => onUpdateEvent({ ...currentEvent, type: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例如：邀請制閉門會 (30人上限)、產業沙龍、公開論壇"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                目標領域與產業
              </label>
              <input
                id="edit-event-industry"
                type="text"
                value={currentEvent.targetIndustry}
                onChange={(e) => onUpdateEvent({ ...currentEvent, targetIndustry: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例如：生成式 AI、SaaS、企業架構"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                目標受眾與期望背景
              </label>
              <input
                id="edit-event-audience"
                type="text"
                value={currentEvent.targetAudience}
                onChange={(e) => onUpdateEvent({ ...currentEvent, targetAudience: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例如：創辦人、CTO、早期投資人"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                特定要求或品牌防範規則
              </label>
              <textarea
                id="edit-event-requirements"
                rows={2}
                value={currentEvent.specialRequirements}
                onChange={(e) => onUpdateEvent({ ...currentEvent, specialRequirements: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例如：嚴禁純推銷拉客行為、注重實質技術案例分享"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
            <button
              id="confirm-event-settings-btn"
              type="button"
              onClick={() => setIsExpanded(false)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              套用活動設定並收合
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
