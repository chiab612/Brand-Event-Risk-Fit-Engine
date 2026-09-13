import React from "react";
import { TrustSignal, RiskSignal, RiskSeverity } from "../types";
import { ShieldCheck, AlertTriangle, AlertCircle, Info, CheckCircle, ShieldAlert } from "lucide-react";

interface TrustRiskSignalsProps {
  trustSignals: TrustSignal[];
  riskSignals: RiskSignal[];
}

export const TrustRiskSignals: React.FC<TrustRiskSignalsProps> = ({
  trustSignals,
  riskSignals,
}) => {
  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case "HIGH_ATTENTION":
        return {
          label: "高度需人工確認",
          bg: "bg-rose-100 text-rose-800 border-rose-200",
          icon: ShieldAlert,
          dotColor: "bg-rose-600",
        };
      case "WARNING":
        return {
          label: "需查證警訊",
          bg: "bg-amber-100 text-amber-800 border-amber-200",
          icon: AlertTriangle,
          dotColor: "bg-amber-500",
        };
      case "INFO":
      default:
        return {
          label: "細節確認提示",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Info,
          dotColor: "bg-blue-500",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trust Signals Column */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col h-full">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                可信度訊號 (Trust Signals)
              </h3>
              <p className="text-[11px] text-slate-500">
                來自填報資料中的具體正面事實，絕無虛構
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {trustSignals.length} 項正面訊號
          </span>
        </div>

        {trustSignals.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50/50 rounded-lg">
            <Info className="w-6 h-6 mb-1 text-slate-300" />
            <p className="text-xs">未偵測到明確可信度佐證，建議要求補充更完整資料。</p>
          </div>
        ) : (
          <ul className="space-y-3 flex-1">
            {trustSignals.map((signal, index) => (
              <li
                key={index}
                className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100 flex items-start gap-2.5 transition-colors hover:bg-emerald-50/70"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-emerald-950 mb-0.5">
                    {signal.category}
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    {signal.description}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>正面訊號均嚴格對照申請人填寫之公司、職務、LinkedIn及實績。</span>
        </div>
      </div>

      {/* Risk Signals Column */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col h-full">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                異常與風險訊號 (Risk Signals)
              </h3>
              <p className="text-[11px] text-slate-500">
                提示主辦方需人工確認之疑點，非自動拒絕依據
              </p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
            riskSignals.length === 0 
              ? "bg-slate-100 text-slate-700 border-slate-200" 
              : "bg-amber-100 text-amber-800 border-amber-200"
          }`}>
            {riskSignals.length} 項待查項目
          </span>
        </div>

        {riskSignals.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-50/50 rounded-lg">
            <CheckCircle className="w-6 h-6 mb-1 text-emerald-500" />
            <p className="text-xs font-medium text-slate-700">未發現顯著異常或矛盾警訊</p>
            <p className="text-[11px] text-slate-400 mt-0.5">資料填寫完整度良好，動機與身份無明顯衝突。</p>
          </div>
        ) : (
          <ul className="space-y-3 flex-1">
            {riskSignals.map((signal, index) => {
              const meta = getSeverityBadge(signal.severity);
              const IconComponent = meta.icon;
              return (
                <li
                  key={index}
                  className="p-3 rounded-lg bg-rose-50/30 border border-rose-100 flex items-start gap-2.5 transition-colors hover:bg-rose-50/60"
                >
                  <IconComponent className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-rose-950">
                        {signal.category}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${meta.bg}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="text-slate-700 leading-relaxed">
                      {signal.description}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>合規聲明：絕不採用性別、年齡、國籍等歧視因子作為風險指標。</span>
        </div>
      </div>
    </div>
  );
};
