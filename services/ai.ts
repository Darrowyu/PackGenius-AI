import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysis, CalculationResult, Dimensions, Language } from '../types';

export const getAIRecommendation = async (
  product: Dimensions,
  result: CalculationResult,
  language: Language
): Promise<AIAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const langInstruction = language === 'cn' ? 'Simplified Chinese (简体中文)' : 'English';

  const prompt = `
    You are a World-Class Senior Packaging Engineer. 
    
    Input Data:
    Single Product: ${product.length} x ${product.width} x ${product.height} mm.
    
    Packaging Hierarchy:
    1. Inner Pack (Minimum Unit): ${result.innerBoxDims.length} x ${result.innerBoxDims.width} x ${result.innerBoxDims.height} mm.
    2. Master Carton Payload (Total Stack): ${result.masterPayloadDims.length} x ${result.masterPayloadDims.width} x ${result.masterPayloadDims.height} mm.
    3. Total Items per Master Carton: ${result.totalItems}.
    
    Selected Master Carton:
    ${result.isCustom ? "NO STOCK FOUND. Suggesting Custom Box." : `STOCK FOUND: ID ${result.box.id}`}.
    Box Dimensions: ${result.box.length} x ${result.box.width} x ${result.box.height} mm.
    Calculated Gaps (Payload to Box): L+${result.gapL.toFixed(1)}, W+${result.gapW.toFixed(1)}, H+${result.gapH.toFixed(1)} mm.
    
    Task:
    Analyze this packaging solution. 
    1. Evaluate the "Items per Inner Pack" and "Inner Packs per Master" density. Is the master carton likely to be too heavy or unstable?
    2. If using stock, is the gap excessive?
    3. Suggest the corrugated material grade (e.g., ECT-32, B-Flute) for the MASTER CARTON based on size and estimated weight.
    4. Provide an efficiency score (0-100).
    5. Provide reasoning as 3 distinct points (e.g. Fit Analysis, Weight Concern, Material Choice).

    IMPORTANT: 
    - Provide ALL response content in ${langInstruction}.
    - Translate technical terms descriptions (e.g. "Double Wall" -> "双瓦楞") but keep codes (ECT-32) in English.
    - The 'reasoning' field MUST be an array of strings, not a single string.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      recommendation: {
        type: Type.STRING,
        description: `A short, punchy headline recommendation in ${langInstruction}.`
      },
      materialSuggestion: {
        type: Type.STRING,
        description: `Specific cardboard grade suggestions in ${langInstruction}.`
      },
      efficiencyScore: {
        type: Type.INTEGER,
        description: "0 to 100 integer representing volume efficiency."
      },
      reasoning: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: `Array of 3 distinct reasoning points in ${langInstruction}. Point 1: Fit/Gap Analysis. Point 2: Weight/Stacking. Point 3: Material Justification.`
      }
    },
    required: ["recommendation", "materialSuggestion", "efficiencyScore", "reasoning"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      recommendation: language === 'cn' ? "AI 不可用" : "AI Unavailable",
      materialSuggestion: "N/A",
      efficiencyScore: 0,
      reasoning: language === 'cn' 
        ? ["无法连接到 AI 进行高级分析。", "请参考计算出的尺寸。", "检查 API 密钥是否正确。"] 
        : ["Could not connect to AI for advanced analysis.", "Please rely on the calculated dimensions.", "Check if API Key is valid."],
    };
  }
};