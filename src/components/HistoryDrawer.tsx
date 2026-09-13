import React, { useState } from "react";
import { EvaluationRecord } from "../types";
import { X, Trash2, Download, Search, CheckCircle, AlertTriangle, UserCheck, ExternalLink, Calendar } from "lucide-react";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  records: EvaluationRecord[];
  onSelectRecord: (record: EvaluationRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onExportRecords: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  records,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
  onExportRecords,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("ALL");

  if (!isOpen) return null;

  const filtered = records.filter((r) => {
    const matchSearch =
      r.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.applicant.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.applicant.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterAction === "ALL") return matchSearch;
    return matchSearch && r.result.overallAssessment.recommendedAction === filterAction;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              已評估申請人歷史清單
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              共計 {records.length} 筆評估紀錄
            </p>
          </div>
          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <button
                type="button"
                onClick={onExportRecords}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                title="匯出紀錄"
              >
                <Download className="w-3.5 h-3.5" />
                匯出
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋姓名、公司或職稱..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterAction("ALL")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterAction === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              全部 ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterAction("適合參與")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterAction === "適合參與"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              適合參與
            </button>
            <button
              type="button"
              onClick={() => setFilterAction("建議人工確認")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterAction === "建議人工確認"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              建議確認
            </button>
            <button
              type="button"
              onClick={() => setFilterAction("需要更多資料")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterAction === "需要更多資料"
                  ? "bg-sky-600 text-white"
                  : "bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100"
              }`}
            >
              需更多資料
            </button>
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-xs">
                {records.length === 0 ? "目前尚無評估記錄。" : "沒有符合篩選條件的申請人。"}
              </p>
            </div>
          ) : (
            filtered.map((record) => {
              const { overallAssessment } = record.result;
              return (
                <div
                  key={record.id}
                  onClick={() => {
                    onSelectRecord(record);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs bg-white transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {record.applicant.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {record.applicant.title || ""} {record.applicant.company ? `@ ${record.applicant.company}` : ""}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.createdAt).toLocaleString("zh-TW")}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(record.id);
                      }}
                      className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                      title="刪除此筆記錄"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">
                      {overallAssessment.recommendedAction}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">
                        適配度: <strong className="text-slate-800">{overallAssessment.eventFitScore}</strong>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-500">
                        合作分: <strong className="text-slate-800">{overallAssessment.collaborationScore}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {records.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onClearAll}
              className="text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              清空全部記錄
            </button>
            <span className="text-slate-400 text-[11px]">
              點擊任一項目即可在主畫面檢視與修改
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
