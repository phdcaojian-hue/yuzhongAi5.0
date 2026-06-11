/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiInstance: GoogleGenAI | null = null;

function getGoogleGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// API: Breeding Intelligence Chat proxy
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages body' });
    }

    const ai = getGoogleGenAI();
    const lastUserMessage = messages[messages.length - 1]?.text || '';

    if (!ai) {
      // Simulate standard scientific breeding smart answers when no API Key is updated
      console.log('No GEMINI_API_KEY set. Falling back to advanced agricultural simulation mode.');
      
      let mockReply = '';
      const promptLower = lastUserMessage.toLowerCase();

      if (promptLower.includes('a07') || promptLower.includes('抗虫')) {
        mockReply = `**[育种模拟回复]** 针对您关于 **A07 品系** 的查询，以下是分析中心生成的最新简报：\n\n1. **耐热性座位 (QHT-3b)**: 该品系在本季酷暑测试中展现出极佳的叶面积指数保持率。基因敲入表达量提升了大约 **22%**。\n2. **抗虫性评估**: 抗虫性评估报告目前已完全生成。最新室内接虫试验表明，A07 对于小菜蛾 (Plutella xylostella) 的死亡率诱导达到了 **91.5%**，具备高抗级别。\n3. **推荐操作**: 可以考虑立即开展 A07 与高产品系 A03 的杂交繁育，以融合优势性状。`;
      } else if (promptLower.includes('a09') || promptLower.includes('筛选')) {
        mockReply = `**[育种模拟回复]** 关于 **A09 基因筛选任务**：\n\n目前筛选进度为 **85%**，已锁定主突变座位，正通过高通量荧光标记筛选标记抗性，预计还需要 2 小时完成。初步数据显示，其在抗旱相关的 **DREB1A** 表达通路上表现出中等强度的上调特征（相比野生型上调约 **1.5 倍**）。`;
      } else if (promptLower.includes('预测') || promptLower.includes('产量') || promptLower.includes('玉米')) {
        mockReply = `**[育种模拟回复]** 关于 **玉米产量预测模型 (GS)**：\n\n- 目前运行中的玉米产量预测模型 V2 采用全基因组选择预测技术，已收录 A 系列与 M 系列共计 **1,200 个** 材料的表型与重测序数据集。\n- 当前的遗传亲和力聚类分析显示，高密度 SNP 芯片在主分量 PC1 上能解释约 **42%** 的产量变异主效应。`;
      } else {
        mockReply = `**[Agri-Breeding AI]** 您好！我是您的智能育种助手。\n\n您提交了关于以下方面的咨询：\n> "${lastUserMessage}"\n\n在基因测序与表现型预测中，我的核心机理支持对于基因特异标记物、突变座、QTL定位、单倍型分析、分子辅助选择等繁育难题的智能辅助：\n\n- **种质资源溯源**: 目前数据库内已收集 **4,592 份** 核心种质。\n- **分析决策**: 建议在繁育过程中，通过单倍体杂交结合重测序，最大程度锁定目标抗性基因。\n\n如有具体材料需要评估，请输入例如 "A07的优势有哪些" 或 "A09基因测序状态如何"。`;
      }

      return res.json({
        text: mockReply,
        simulated: true,
      });
    }

    // Call actual Gemini API with appropriate context
    const chatHistory = messages.map((m: any) => ({
      role: m.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Generate content using gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatHistory,
      config: {
        systemInstruction: `You are Agri-Breeding AI Assistant, an expert AI specialized in agronomy, crop genomics, agricultural data analysis, and precision plant breeding. Your purpose is to assist agronomists, breeding researchers, and commercial farm managers with absolute scientific accuracy, providing details about crop selections, molecular marker screening, gene-editing progress (like CRISPR), phenotypic analysis, and breeding strategies. Always translate or chat in the researcher's preferred language (the query is in Chinese, so answer in natural Chinese). Keep your replies structured, with markdown lists, bold terms for crop names, and highly actionable suggestions.`,
      },
    });

    const replyText = response.text || '无法生成育种分析，请稍后再试。';
    res.json({
      text: replyText,
      simulated: false,
    });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error?.message || 'Gemini API Error' });
  }
});

// Configure Vite middleware in development, static serving in production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Agri-Intelligence Service] Running on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start Agri-Intelligence Server:', err);
});
