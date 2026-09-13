import { EventContext, ApplicantData } from "../types";

export const SAMPLE_EVENTS: EventContext[] = [
  {
    id: "event-ai-summit",
    title: "2026 AI Product & Founder 私享交流閉門會",
    type: "邀請制閉門閉門會 (30人上限)",
    targetIndustry: "人工智慧、生成式 AI、SaaS、企業軟體",
    targetAudience: "AI 創辦人、技術長 (CTO)、產品負責人、專注 AI 賽道的早期投資人",
    specialRequirements: "具備實質產品上線或工程落地經驗，嚴禁純銷售推銷或無關業務拉客行為。"
  },
  {
    id: "event-brand-salon",
    title: "高端品牌數位轉型與顧客體驗創新沙龍",
    type: "品牌 VIP 實體研討交流",
    targetIndustry: "精品零售、數位行銷、體驗設計、顧客忠誠計畫",
    targetAudience: "品牌行銷長 (CMO)、數位策略總監、D2C 品牌主理人",
    specialRequirements: "聚焦實踐案例深度分享與跨界品牌聯名商務洽談。"
  },
  {
    id: "event-community-meetup",
    title: "Developer & Creator 跨域開源社群年會",
    type: "實體社群技術盛會",
    targetIndustry: "軟體開發、Web3、開源專案、科技內容創作",
    targetAudience: "開源貢獻者、資深工程師、技術社群主理人、科技 KOL",
    specialRequirements: "鼓勵實務技術分享、互助社群精神與生態系協作。"
  }
];

export interface SampleApplicantProfile {
  id: string;
  nameBadge: string;
  categoryTag: string;
  description: string;
  applicant: ApplicantData;
}

export const SAMPLE_APPLICANTS: SampleApplicantProfile[] = [
  {
    id: "sample-high-fit",
    nameBadge: "高適配・AI 創辦人",
    categoryTag: "適合參與 / 高合作價值",
    description: "具有明確產品實績、清晰 LinkedIn 與合適動機的創辦人",
    applicant: {
      name: "林宥安 (Eason Lin)",
      title: "Co-Founder & CTO",
      company: "NexusFlow AI",
      industry: "企業級 AI 工作流程與自動化",
      bio: "前 Google 資深工程師，現為專注 Enterprise Agentic Workflow 的 AI 新創創辦人。團隊剛完成 Seed 輪募資，產品已有超過 20 家中大型跨國企業付費客戶採用。",
      socialUrl: "https://www.linkedin.com/in/eason-lin-nexusflow",
      intent: "希望與台灣頂尖 AI 創辦人交流企業端落地技術挑戰（特別是上下文快取與 Evaluation 框架），並尋找潛在企業生態系夥伴。",
      pastEvents: "曾擔任 2025 PyCon Taiwan 講者、參加過主辦方舉辦的 Q3 創業者技術茶會。",
      relevance: "我們的產品正是針對企業 AI 應用架構，與本次活動主題極度契合，樂於在會中分享實務部署經驗。",
      isCommunityMember: true,
      notes: "若有需要，我很樂意在活動中進行 5-10 分鐘的無商標乾貨技術閃電秀。"
    }
  },
  {
    id: "sample-risk-vague",
    nameBadge: "高度疑點・模糊推銷",
    categoryTag: "建議人工確認 / 風險警訊",
    description: "身份資料空泛、缺乏具體經驗、目的疑似大量推廣業務的申請人",
    applicant: {
      name: "Alex W.",
      title: "Senior Consultant / Director",
      company: "Global Growth Solutions",
      industry: "商業顧問 / 各領域投資諮詢",
      bio: "專注於提供全方位商務增長方案與跨國業務拓展諮詢，具備多年成功輔導經驗。",
      socialUrl: "https://twitter.com/alex_growth_guru_888",
      intent: "想在活動上認識更多高端客戶與企業高層，介紹我們最新推出的全球增長加速培訓課程與顧問服務。",
      pastEvents: "參加過許多國內外高峰論壇與商務社交晚宴。",
      relevance: "任何企業都需要業務增長，因此我和這場活動的所有人都很有關聯。",
      isCommunityMember: false,
      notes: "希望能索取現場所有來賓的名片或名冊以利後續拜訪洽談。"
    }
  },
  {
    id: "sample-need-info",
    nameBadge: "跨領域・需更多資料",
    categoryTag: "需要更多資料 / 潛在亮點",
    description: "傳統產業轉型主管，背景有潛力但報名資料簡短，需確認技術深度",
    applicant: {
      name: "陳雅婷 (Tiffany Chen)",
      title: "數位創新處 專案經理",
      company: "富聯生技醫療集團",
      industry: "生技醫療與健康照護",
      bio: "在生醫集團任職 6 年，目前負責集團內部的智慧醫療大模型評估專案，希望將臨床資料流透過本地端模型進行分析輔助。",
      socialUrl: "https://www.linkedin.com/in/tiffany-chen-medai",
      intent: "了解目前生成式 AI 在敏感資料處理與隱私合規的最佳實踐做法。",
      pastEvents: "主要參加醫療生醫領域年會，這是第一次申請跨界科技閉門活動。",
      relevance: "雖然是醫療背景，但我們正大規模評估導入 AI 解決方案，希望向純軟體業前輩請益架構經驗。",
      isCommunityMember: false,
      notes: "因為公司有嚴格保密規範，部分專案細節無法在報名表公開，但很希望能有交流機會。"
    }
  },
  {
    id: "sample-community-loyal",
    nameBadge: "既有社群・資深研究員",
    categoryTag: "高信任 / 專業連結",
    description: "主辦方社群長期活躍成員，學術與實務兼備的研發工程師",
    applicant: {
      name: "張銘軒 (Michael Chang)",
      title: "Lead AI Researcher",
      company: "中央研究院 / 台大資工博士候選人",
      industry: "學術研究與開源大型語言模型",
      bio: "專注於多模態推理與輕量化模型微調，開源社群活躍貢獻者，曾釋出繁體中文開源評測集。",
      socialUrl: "https://github.com/mchang-ai-research",
      intent: "了解產業界目前在實際商業場景中的瓶頸，讓研究團隊的後續題目能更貼近產業真實現狀。",
      pastEvents: "連續兩年參加本社群黑客松並擔任技術評審，常在 Discord 社群解答演算法問題。",
      relevance: "自身研究主題就是大模型推理優化，能為現場其他創辦人提供扎實的學術前沿視角。",
      isCommunityMember: true,
      notes: "已是社群老朋友，期待與大家線下聚會！"
    }
  }
];

export const EMPTY_APPLICANT: ApplicantData = {
  name: "",
  title: "",
  company: "",
  industry: "",
  bio: "",
  socialUrl: "",
  intent: "",
  pastEvents: "",
  relevance: "",
  isCommunityMember: false,
  notes: ""
};
