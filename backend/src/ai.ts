import { Dimensions, CalculationResult } from './packaging';

export type Language = 'en' | 'zh-CN';

export interface AIAnalysis {
  recommendation: string;
  materialSuggestion: string;
  efficiencyScore: number;
  reasoning: string[];
}

export const getAIRecommendation = async (
  product: Dimensions,
  result: CalculationResult,
  language: Language
): Promise<AIAnalysis> => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is missing");
  }

  const langInstruction = language === 'zh-CN' ? '简体中文' : 'English';

  const stackCount = result.stackCount || result.totalItems;
  const prompt = `你是一位世界级的高级包装工程师。请分析以下包装方案并提供专业建议。

产品类型：杯装N95口罩（叠放包装）

输入数据：
- 单个产品尺寸: ${product.length} x ${product.width} x ${product.height} cm
- 叠放数量: ${stackCount} pcs/盒（产品在高度方向堆叠）
- 内盒尺寸（自动计算）: ${result.innerBoxDims.length.toFixed(1)} x ${result.innerBoxDims.width.toFixed(1)} x ${result.innerBoxDims.height.toFixed(1)} cm
- 外箱内装尺寸: ${result.masterPayloadDims.length.toFixed(1)} x ${result.masterPayloadDims.width.toFixed(1)} x ${result.masterPayloadDims.height.toFixed(1)} cm
- 每箱总产品数量: ${result.totalItems} pcs
- 选定纸箱: ${result.isCustom ? "无库存匹配，建议定制" : `库存纸箱 ${result.box.id}`}
- 纸箱尺寸: ${result.box.length} x ${result.box.width} x ${result.box.height} cm
- 安全间隙: L+${result.gapL.toFixed(1)}, W+${result.gapW.toFixed(1)}, H+${result.gapH.toFixed(1)} cm

请用${langInstruction}回复，严格按以下JSON格式输出：
{
  "recommendation": "简短的包装建议（考虑N95口罩的防护要求和叠放特性）",
  "materialSuggestion": "纸板材质建议（考虑防潮、抗压需求）",
  "efficiencyScore": 0到100的整数（空间利用率评分）,
  "reasoning": ["理由1", "理由2", "理由3"]
}`;

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No response from AI");
    
    return JSON.parse(content) as AIAnalysis;
  } catch (error) {
    console.error("DeepSeek Error:", error);
    return {
      recommendation: language === 'zh-CN' ? "AI 分析暂不可用" : "AI Unavailable",
      materialSuggestion: "N/A",
      efficiencyScore: 0,
      reasoning: language === 'zh-CN'
        ? ["无法连接到 AI 服务", "请检查 API 密钥配置", "计算结果仍然有效"]
        : ["Could not connect to AI", "Please check API key", "Calculation results are still valid"],
    };
  }
};
