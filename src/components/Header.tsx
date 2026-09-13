import React from "react";
import { ShieldCheck, Sparkles, History, RotateCcw, Download, Info } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onReset: () => void;
  onExportAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onReset,
  onExportAll
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Brand Event Risk & Fit Engine
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                  AI 輔助評估
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  非自動裁定
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                活動申請人結構化分析・適配度・可信度訊號・風險識別・合作價值
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              id="header-history-btn"
              type="button"
              onClick={onOpenHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="查看已評估的申請人記錄"
            >
              <History className="w-3.5 h-3.5 text-slate-600" />
              評估歷史
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-slate-900 text-white rounded-full text-[10px] font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            {historyCount > 0 && (
              <button
                id="header-export-btn"
                type="button"
                onClick={onExportAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200"
                title="匯出所有已評估結果為 JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                匯出清單
              </button>
            )}

            <button
              id="header-reset-btn"
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="清空目前輸入"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              清空
            </button>
          </div>
        </div>
      </div>

      {/* Compliance / Ethics Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              <strong>倫理準則：</strong>AI 僅作為主辦方客觀參考依據，絕不以性別、年齡、外貌、國籍或敏感特徵評分，不捏造未提供資訊，不執行自動化拒絕。
            </span>
          </div>
          <span className="text-slate-400 hidden md:inline">
            專為品牌經理、主辦方、BD 與社群團隊設計
          </span>
        </div>
      </div>
    </header>
  );
};
