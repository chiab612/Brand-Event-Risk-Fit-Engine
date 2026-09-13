# Brand Event Risk & Fit Engine

> 專為品牌、活動主辦方、商務拓展（BD）及社群管理者打造的活動申請人 AI 結構化評估與風險識別引擎。

---

## 📌 核心理念與設計目的

本專案非一般對話式聊天機器人，而是針對**品牌閉門會、創辦人交流沙龍、VIP 研討會、技術論壇**等高品質活動的專屬決策輔助工具。

收到大量活動報名後，主辦方往往難以快速辨識每位申請者的真偽、參與動機與活動適配度。本工具從六大核心維度進行多角度結構化評估：

1. **Event Fit（活動適配度）**：申請人與本次活動主題、產業領域及目標族群的契合程度。
2. **Intent（報名動機實質性）**：分析報名動機是否合理、具體，或疑似無關商業推銷。
3. **Professional Relevance（專業背景關聯）**：其職稱、公司、產業經驗與專業深度。
4. **Trust Signals（正面可信度訊號）**：提取具體驗證事實（如 LinkedIn、具體職務成果、過去社群參與）。**嚴格遵循不虛構事實原則**。
5. **Risk Signals（風險與待查訊號）**：識別身份模糊、前後矛盾、缺乏活動關聯或罐頭文字等異常，提醒主辦方人工查證。
6. **Collaboration Value（品牌與合作價值）**：評估可能帶來的產業連結、專業分享、內容共創、媒體社群擴散或潛在商務綜效。
7. **Overall Assessment（綜合決策輔助）**：
   - Event Fit Score (0-100)
   - Collaboration Value Score (0-100)
   - Risk Level（低風險／中度需注意／高度需查核）
   - Recommended Action（適合參與／建議人工確認／需要更多資料／與本次活動關聯較低）
   - 總結摘要與主辦方查核提問清單

> **倫理與反歧視規範**：本工具嚴格禁止根據姓名、性別、外貌、年齡、國籍、種族或宗教等敏感個人特徵進行評分或歧視；推薦行動僅作為輔助，決不自動執行最終拒絕。

---

## 🛠️ 技術架構

- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + Motion
- **Backend**: Node.js + Express 4.x + Vite Middleware (Dev) / CommonJS Bundle (Prod)
- **AI Engine**: Google GenAI SDK (`@google/genai`) with `gemini-3.8-flash`
- **Data Schema**: Structured JSON response schema validation

---

## 📁 專案目錄結構

```
brand-event-risk-fit-engine/
├── .env.example             # 環境變數範本 (GEMINI_API_KEY)
├── metadata.json            # 平台能力聲明與元數據
├── package.json             # 依賴套件與建置指令
├── tsconfig.json            # TypeScript 編譯設定
├── vite.config.ts           # Vite 與 Tailwind 配置
├── server.ts                # Express API 伺服器與 Gemini AI 評估端點
├── index.html               # 應用程式 HTML 進入點
└── src/
    ├── main.tsx             # React 渲染入口
    ├── index.css            # Tailwind 全域樣式
    ├── types.ts             # 評估模型、申請人資料與審查狀態介面
    ├── constants/
    │   └── presets.ts       # 預設活動範本與 4 組真實測試案例
    ├── components/
    │   ├── Header.tsx               # 頂部導覽列與倫理說明橫幅
    │   ├── EventContextCard.tsx     # 活動基準設定與多活動範本切換
    │   ├── ApplicantForm.tsx        # 11 欄位申請人輸入表單與快速帶入
    │   ├── EvaluationResultView.tsx # 結構化評估結果報告與人工覆核工具
    │   ├── TrustRiskSignals.tsx     # 可信度 vs 風險訊號對照卡
    │   └── HistoryDrawer.tsx        # 歷史審查紀錄抽屜與匯出功能
    └── App.tsx              # 主應用狀態與互動流程
```

---

## 🚀 快速開始

### 1. 安裝相依套件

```bash
npm install
```

### 2. 配置環境變數

複製 `.env.example` 為 `.env` 並填入 Google Gemini API Key：

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. 本地開發執行

```bash
npm run dev
```

在瀏覽器打開 `http://localhost:3000` 即可操作。

### 4. 正式生產建置

```bash
npm run build
npm start
```

---

## 📄 授權條款

Apache-2.0
