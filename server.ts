import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));

// Server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Applicant evaluation endpoint
app.post("/api/evaluate", async (req, res) => {
  try {
    const { eventContext, applicant } = req.body;

    if (!applicant || !applicant.name) {
      return res.status(400).json({ error: "申請人資料不完整，至少需提供姓名或稱呼。" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
你是一位專業的「品牌活動申請人評估與風險分析專家」（Brand Event Risk & Fit Engine）。
你的任務是協助品牌活動主辦方、商務拓展（BD）與社群管理者，對報名資料進行客觀、結構化且具洞察力的分析。

【嚴格遵守的倫理與評估準則】：
1. 嚴禁偏見：絕對不要根據申請人的姓名、性別、外貌、年齡、國籍、種族、宗教、性傾向等敏感或非專業維度進行評分或歧視。
2. 忠於資料：Trust Signals（可信度訊號）必須基於使用者實際提供的資料，嚴禁捏造、腦補或臆測不存在的事實。
3. 嚴謹識別風險：Risk Signals 用於找出需要主辦方「人工進一步確認」的異常（如：身分模糊、自我介紹與申請目的不符、語意前後矛盾、純推銷或罐頭內容、與活動主題缺乏實質連結等）。
4. 輔助決策定位：你的推薦行動（Recommended Action）僅作為人工決策的輔助參考，永遠不要代替主辦方做出自動封鎖或不可撤回的拒絕決定。
5. 輸出語言：請使用清晰、精準、具備商務水準的繁體中文，避免晦澀空洞的行話。

【評估架構】：
1. Event Fit（活動適配度）：分析申請人與本次活動主題、產業、目標受眾的匹配程度。
2. Intent（報名目的）：評估目的之清晰度、合理性、與活動規劃是否相符。
3. Professional Relevance（專業背景關聯）：分析其職稱、公司、產業經驗與專業深度。
4. Trust Signals（正面可信度訊號）：條列具體的真實性證據（如明確公司與職稱、完整 LinkedIn、合理過去活動記錄、社群活躍歷史等）。
5. Risk Signals（需人工確認的風險或疑點）：條列具體的疑點或警訊；若資料充分且正常，亦請客觀註明「無顯著異常訊號」。
6. Collaboration Value（合作與品牌價值）：探討產業連結、專業分享、內容共創、媒體影響力、社群擴散或潛在商務合作價值。
7. Overall Assessment（綜合決策輔助）：
   - eventFitScore: 0 ~ 100
   - collaborationScore: 0 ~ 100
   - riskLevel: "LOW" (低風險) | "MODERATE" (中等需注意) | "HIGH" (高度需人工確認)
   - recommendedAction: 必須為下列四者之一：
     - "適合參與"
     - "建議人工確認"
     - "需要更多資料"
     - "與本次活動關聯較低"
   - executiveSummary: 2-3 句精華結論，指出最核心的優勢或疑慮
   - actionAdvice: 具體給主辦方的建議操作步驟（例如建議邀請交流、建議發信索取作品集、建議電話核對身分等）
   - suggestedQuestions: 3 個建議主辦方可向申請人進一步了解或驗證的問題
`;

    const userPrompt = `
【本次活動背景資訊】：
- 活動名稱：${eventContext?.title || "未指定"}
- 活動類型：${eventContext?.type || "品牌交流/研討活動"}
- 主題領域與產業：${eventContext?.targetIndustry || "未指定"}
- 目標受眾與期望背景：${eventContext?.targetAudience || "產業專業人士、合作夥伴、社群成員"}
- 活動關鍵要求/期望：${eventContext?.specialRequirements || "無特殊限制"}

【申請人報名資料】：
- 姓名／暱稱：${applicant.name || "未填寫"}
- 職稱：${applicant.title || "未填寫"}
- 公司或組織：${applicant.company || "未填寫"}
- 產業：${applicant.industry || "未填寫"}
- 自我介紹：${applicant.bio || "未填寫"}
- LinkedIn／社群資訊：${applicant.socialUrl || "未填寫"}
- 報名目的：${applicant.intent || "未填寫"}
- 過往活動參與：${applicant.pastEvents || "未填寫"}
- 與本次活動的關聯：${applicant.relevance || "未填寫"}
- 是否為既有社群成員：${applicant.isCommunityMember ? "是" : "否/未標記"}
- 其他補充資訊：${applicant.notes || "未填寫"}

請依照要求輸出結構化的評估 JSON 結果。
`;

    // Execution with fallback on transient 503 spikes
    let response;
    const generateConfig = {
      systemInstruction,
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallAssessment: {
            type: Type.OBJECT,
            properties: {
              eventFitScore: { type: Type.INTEGER, description: "0到100分" },
              collaborationScore: { type: Type.INTEGER, description: "0到100分" },
              riskLevel: {
                type: Type.STRING,
                enum: ["LOW", "MODERATE", "HIGH"],
                description: "風險等級"
              },
              recommendedAction: {
                type: Type.STRING,
                enum: ["適合參與", "建議人工確認", "需要更多資料", "與本次活動關聯較低"],
                description: "推薦處理方針"
              },
              executiveSummary: { type: Type.STRING, description: "簡明總結摘要" },
              actionAdvice: { type: Type.STRING, description: "給主辦方的具體執行建議" },
              suggestedQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "建議主辦方核對或面談問題"
              }
            },
            required: [
              "eventFitScore",
              "collaborationScore",
              "riskLevel",
              "recommendedAction",
              "executiveSummary",
              "actionAdvice",
              "suggestedQuestions"
            ]
          },
          eventFitAnalysis: {
            type: Type.OBJECT,
            properties: {
              rating: { type: Type.STRING, description: "極高 / 高 / 中等 / 偏低" },
              details: { type: Type.STRING, description: "深入分析說明" },
              keyMatchPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "與活動主題相符的亮點"
              }
            },
            required: ["rating", "details", "keyMatchPoints"]
          },
          intentAnalysis: {
            type: Type.OBJECT,
            properties: {
              clarity: { type: Type.STRING, description: "清晰 / 普通 / 模糊" },
              alignment: { type: Type.STRING, description: "高度一致 / 部分相符 / 關聯微弱 / 疑似非目標" },
              details: { type: Type.STRING, description: "動機與目的分析說明" }
            },
            required: ["clarity", "alignment", "details"]
          },
          professionalRelevance: {
            type: Type.OBJECT,
            properties: {
              relevanceLevel: { type: Type.STRING, description: "高度相關 / 中度相關 / 跨領域 / 缺乏關聯" },
              details: { type: Type.STRING, description: "專業背景與產業經驗分析" },
              highlightSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "關鍵專業能力或領域"
              }
            },
            required: ["relevanceLevel", "details", "highlightSkills"]
          },
          trustSignals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, description: "例如：真實職涯足跡、社群歷史、明確動機、可驗證鏈結" },
                description: { type: Type.STRING, description: "訊號詳細描述，絕不可捏造" }
              },
              required: ["category", "description"]
            },
            description: "支持可信度的正面訊號清單"
          },
          riskSignals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                severity: { type: Type.STRING, enum: ["INFO", "WARNING", "HIGH_ATTENTION"], description: "警訊程度" },
                category: { type: Type.STRING, description: "如：資訊模糊、動機矛盾、缺乏活動關聯、可疑重複" },
                description: { type: Type.STRING, description: "需人工查證的具體疑點" }
              },
              required: ["severity", "category", "description"]
            },
            description: "可能需要人工進一步確認的異常或風險訊號"
          },
          collaborationValue: {
            type: Type.OBJECT,
            properties: {
              potentialValueLevel: { type: Type.STRING, description: "極高 / 顯著 / 一般 / 有限" },
              details: { type: Type.STRING, description: "綜合價值分析" },
              valueDimensions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dimension: { type: Type.STRING, description: "如：產業連結、內容共創、媒體社群價值、技術專業、潛在商務合作" },
                    explanation: { type: Type.STRING, description: "該維度的具體效益分析" }
                  },
                  required: ["dimension", "explanation"]
                }
              }
            },
            required: ["potentialValueLevel", "details", "valueDimensions"]
          }
        },
        required: [
          "overallAssessment",
          "eventFitAnalysis",
          "intentAnalysis",
          "professionalRelevance",
          "trustSignals",
          "riskSignals",
          "collaborationValue"
        ]
      }
    };

    const modelsToTry = ["gemini-3.8-flash", "gemini-flash-latest"];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: generateConfig
        });
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt with ${modelName} failed, trying next fallback:`, err.message || err);
        // Small delay before trying next model
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("無法從 AI 服務取得有效結構化評估結果");
    }

    const rawText = response.text?.trim() || "{}";
    const parsedData = JSON.parse(rawText);

    return res.json({
      success: true,
      data: parsedData,
      analyzedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Evaluation error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "處理申請人評估時發生未預期的伺服器錯誤"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Brand Event Risk & Fit Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
