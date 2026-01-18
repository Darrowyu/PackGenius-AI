import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { db } from './db';
import { findBestBox, Dimensions, PackagingConfig, SafetyGaps, DEFAULT_GAPS } from './packaging';
import { getAIRecommendation, Language } from './ai';

const app = new Hono();

app.use('/*', cors());

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// GET /api/inventory - 获取库存列表
app.get('/api/inventory', async (c) => {
  try {
    const items = await db.getAll();
    return c.json(items);
  } catch (error) {
    console.error('DB Error:', error);
    return c.json({ error: 'Failed to fetch inventory' }, 500);
  }
});

// POST /api/inventory - 添加库存
app.post('/api/inventory', async (c) => {
  try {
    const body = await c.req.json();
    if (Array.isArray(body)) {
      const count = await db.insertBatch(body);
      return c.json({ success: true, count });
    } else {
      const item = await db.insert(body);
      return c.json({ success: true, data: item });
    }
  } catch (error) {
    console.error('DB Error:', error);
    return c.json({ error: 'Failed to add inventory' }, 500);
  }
});

// DELETE /api/inventory/:id - 删除库存
app.delete('/api/inventory/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const deleted = await db.delete(id);
    return c.json({ success: deleted, id });
  } catch (error) {
    console.error('DB Error:', error);
    return c.json({ error: 'Failed to delete inventory' }, 500);
  }
});

// POST /api/calculate - 计算 + AI 分析
app.post('/api/calculate', async (c) => {
  try {
    const { product, config, language = 'zh-CN', safetyGaps } = await c.req.json() as {
      product: Dimensions;
      config: PackagingConfig;
      language?: Language;
      safetyGaps?: SafetyGaps;
    };

    const gaps = safetyGaps || DEFAULT_GAPS;
    const inventory = await db.getAll();
    const result = findBestBox(product, inventory, config, gaps);

    let aiAnalysis = null;
    try {
      aiAnalysis = await getAIRecommendation(product, result, language);
    } catch (aiError) {
      console.error('AI Error:', aiError);
    }

    // 保存历史记录 - 存储完整计算结果
    try {
      await db.saveHistory(product, config, {
        box: { id: result.box.id, length: result.box.length, width: result.box.width, height: result.box.height },
        isCustom: result.isCustom,
        innerBoxDims: result.innerBoxDims,
        masterPayloadDims: result.masterPayloadDims,
        totalItems: result.totalItems,
        gapL: result.gapL,
        gapW: result.gapW,
        gapH: result.gapH,
        wasteVolume: result.wasteVolume
      });
    } catch (e) {
      console.error('Failed to save history:', e);
    }

    return c.json({ result, aiAnalysis });
  } catch (error) {
    console.error('Calculate Error:', error);
    return c.json({ error: 'Calculation failed' }, 500);
  }
});

// GET /api/history - 获取计算历史
app.get('/api/history', async (c) => {
  try {
    const history = await db.getHistory();
    return c.json(history);
  } catch (error) {
    console.error('History Error:', error);
    return c.json({ error: 'Failed to fetch history' }, 500);
  }
});

// DELETE /api/history/:id - 删除单条历史
app.delete('/api/history/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await db.deleteHistory(id);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete' }, 500);
  }
});

// DELETE /api/history - 清空历史
app.delete('/api/history', async (c) => {
  try {
    await db.clearHistory();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to clear' }, 500);
  }
});

const port = parseInt(process.env.PORT || '3001');

const startServer = async () => {
  try {
    await db.init();
    console.log('✅ Database initialized');
  } catch (error) {
    console.warn('⚠️ Database not available, running without persistence');
  }

  console.log(`🚀 Backend server running on http://localhost:${port}`);
  serve({ fetch: app.fetch, port });
};

startServer();

export default app;
