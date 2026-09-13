import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { EventContextCard } from "./components/EventContextCard";
import { ApplicantForm } from "./components/ApplicantForm";
import { EvaluationResultView } from "./components/EvaluationResultView";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { EventContext, ApplicantData, EvaluationResult, EvaluationRecord } from "./types";
import { SAMPLE_EVENTS, SAMPLE_APPLICANTS, EMPTY_APPLICANT } from "./constants/presets";
import { Sparkles, AlertCircle, ArrowLeft, RotateCcw, CheckCircle, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "brand_event_risk_fit_records_v1";

export default function App() {
  const [currentEvent, setCurrentEvent] = useState<EventContext>(SAMPLE_EVENTS[0]);
  const [applicantForm, setApplicantForm] = useState<ApplicantData>(EMPTY_APPLICANT);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyRecords, setHistoryRecords] = useState<EvaluationRecord[]>([]);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistoryRecords(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read history from localStorage", e);
    }
  }, []);

  // Save history to localStorage
  const saveRecordsToStorage = (records: EvaluationRecord[]) => {
    setHistoryRecords(records);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn("Failed to persist history to localStorage", e);
    }
  };

  const handleEvaluate = async () => {
    if (!applicantForm.name.trim()) {
      setError("請先填寫申請人姓名或稱呼。");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventContext: currentEvent,
          applicant: applicantForm,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "評估過程發生錯誤，請稍後重試。");
      }

      const result: EvaluationResult = resData.data;
      setEvaluationResult(result);

      // Create a new record in history
      const newRecordId = `rec_${Date.now()}`;
      const newRecord: EvaluationRecord = {
        id: newRecordId,
        createdAt: new Date().toISOString(),
        eventContext: currentEvent,
        applicant: { ...applicantForm },
        result,
        manualStatus: "UNREVIEWED",
        manualNotes: "",
      };

      setCurrentRecordId(newRecordId);
      const updatedHistory = [newRecord, ...historyRecords];
      saveRecordsToStorage(updatedHistory);

      // Scroll smoothly to results
      setTimeout(() => {
        const resultElem = document.getElementById("evaluation-result-container");
        if (resultElem) {
          resultElem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: any) {
      console.error("Evaluation request error:", err);
      setError(err.message || "無法完成評估，請確認網路連線或 API Key 設定。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecordFromHistory = (record: EvaluationRecord) => {
    setCurrentEvent(record.eventContext);
    setApplicantForm(record.applicant);
    setEvaluationResult(record.result);
    setCurrentRecordId(record.id);
    setError(null);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = historyRecords.filter((r) => r.id !== id);
    saveRecordsToStorage(updated);
    if (currentRecordId === id) {
      setCurrentRecordId(null);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("確定要清空所有評估紀錄嗎？此操作無法還原。")) {
      saveRecordsToStorage([]);
    }
  };

  const handleExportRecords = () => {
    if (historyRecords.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyRecords, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `brand-event-evaluations-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetForm = () => {
    setApplicantForm(EMPTY_APPLICANT);
    setEvaluationResult(null);
    setCurrentRecordId(null);
    setError(null);
  };

  const handleSaveManualStatus = (
    status: "APPROVED" | "FLAGGED" | "NEED_INFO" | "DECLINED",
    notes: string
  ) => {
    if (!currentRecordId) return;
    const updated = historyRecords.map((rec) => {
      if (rec.id === currentRecordId) {
        return {
          ...rec,
          manualStatus: status,
          manualNotes: notes,
        };
      }
      return rec;
    });
    saveRecordsToStorage(updated);
  };

  const currentRecord = historyRecords.find((r) => r.id === currentRecordId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <Header
        historyCount={historyRecords.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleResetForm}
        onExportAll={handleExportRecords}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Intro banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              活動申請人結構化適配度與風險評估
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              專為品牌活動主辦方、商務拓展（BD）及社群管理者設計。在收到活動報名後，自動從「活動適配度、動機真實性、專業深度、正面可信度訊號、潛在風險疑點、合作價值」六大維度進行多角分析，輔助主辦方做出明智的篩選與分群決策。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setApplicantForm(SAMPLE_APPLICANTS[0].applicant);
                setCurrentEvent(SAMPLE_EVENTS[0]);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              一鍵示範：高適配創辦人
            </button>
            <button
              type="button"
              onClick={() => {
                setApplicantForm(SAMPLE_APPLICANTS[1].applicant);
                setCurrentEvent(SAMPLE_EVENTS[0]);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
            >
              一鍵示範：模糊推銷案例
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              <p className="text-rose-600 text-[11px] mt-0.5">
                請確認申請人資料齊全，若出現 API 授權問題請確認環境變數配置。
              </p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-700 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Event Context Card */}
        <EventContextCard
          currentEvent={currentEvent}
          onUpdateEvent={setCurrentEvent}
        />

        {/* Applicant Input Form */}
        <ApplicantForm
          formData={applicantForm}
          onChange={setApplicantForm}
          onSubmit={handleEvaluate}
          isLoading={isLoading}
          onClear={handleResetForm}
        />

        {/* Evaluation Result Area */}
        {evaluationResult ? (
          <EvaluationResultView
            result={evaluationResult}
            applicant={applicantForm}
            eventContext={currentEvent}
            onSaveStatus={handleSaveManualStatus}
            initialStatus={currentRecord?.manualStatus}
            initialNotes={currentRecord?.manualNotes}
          />
        ) : (
          !isLoading && (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 sm:p-12 text-center bg-white/50">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">
                尚未進行評估
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                請在上代表單中填寫申請人資訊，或點選上方範本案例，接著點擊「啟動 AI 結構化深度評估」即可查看完整分析報告。
              </p>
            </div>
          )
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={historyRecords}
        onSelectRecord={handleSelectRecordFromHistory}
        onDeleteRecord={handleDeleteRecord}
        onClearAll={handleClearAllHistory}
        onExportRecords={handleExportRecords}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Brand Event Risk & Fit Engine © {new Date().getFullYear()} · 品牌活動主辦方決策輔助引擎
          </span>
          <span className="text-[11px] text-slate-400">
            遵循負責任 AI 準則：不採用敏感個資歧視指標，保持客觀分析
          </span>
        </div>
      </footer>
    </div>
  );
}
