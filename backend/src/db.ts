import postgres from 'postgres';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../../.env'), quiet: true }); // 从根目录加载 .env

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/packgenius';

const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {}, // 忽略 PostgreSQL NOTICE 消息
});

export interface BoxItem {
  id: string;
  length: number;
  width: number;
  height: number;
  created_at?: Date;
}

export interface HistoryItem {
  id: number;
  product: { length: number; width: number; height: number };
  config: object;
  result: object;
  created_at: Date;
}

export const db = {
  async init() {
    await sql`
      CREATE TABLE IF NOT EXISTS inventory (
        id VARCHAR(50) PRIMARY KEY,
        length DECIMAL(10,2) NOT NULL,
        width DECIMAL(10,2) NOT NULL,
        height DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS calculation_history (
        id SERIAL PRIMARY KEY,
        product JSONB NOT NULL,
        config JSONB NOT NULL,
        result JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  },

  async getAll(): Promise<BoxItem[]> {
    const rows = await sql<BoxItem[]>`SELECT id, length, width, height, created_at FROM inventory ORDER BY created_at DESC`;
    return rows.map(row => ({
      id: row.id,
      length: Number(row.length),
      width: Number(row.width),
      height: Number(row.height),
      created_at: row.created_at,
    }));
  },

  async insert(item: Omit<BoxItem, 'created_at'>): Promise<BoxItem> {
    const [row] = await sql<BoxItem[]>`
      INSERT INTO inventory (id, length, width, height)
      VALUES (${item.id}, ${item.length}, ${item.width}, ${item.height})
      ON CONFLICT (id) DO UPDATE SET length = ${item.length}, width = ${item.width}, height = ${item.height}
      RETURNING id, length, width, height, created_at
    `;
    return { ...row, length: Number(row.length), width: Number(row.width), height: Number(row.height) };
  },

  async insertBatch(items: Omit<BoxItem, 'created_at'>[]): Promise<number> {
    if (items.length === 0) return 0;
    let count = 0;
    for (const item of items) {
      await this.insert(item);
      count++;
    }
    return count;
  },

  async delete(id: string): Promise<boolean> {
    const result = await sql`DELETE FROM inventory WHERE id = ${id}`;
    return result.count > 0;
  },

  async close() {
    await sql.end();
  },

  // 历史记录
  async saveHistory(product: object, config: object, result: object): Promise<number> {
    const [row] = await sql<{ id: number }[]>`
      INSERT INTO calculation_history (product, config, result)
      VALUES (${sql.json(product)}, ${sql.json(config)}, ${sql.json(result)})
      RETURNING id
    `;
    return row.id;
  },

  async getHistory(limit = 20): Promise<HistoryItem[]> {
    const rows = await sql<HistoryItem[]>`
      SELECT id, product, config, result, created_at 
      FROM calculation_history 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `;
    // 确保 JSONB 字段正确解析
    return rows.map(row => ({
      ...row,
      product: typeof row.product === 'string' ? JSON.parse(row.product) : row.product,
      config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
      result: typeof row.result === 'string' ? JSON.parse(row.result) : row.result,
    }));
  },

  async deleteHistory(id: number): Promise<boolean> {
    const result = await sql`DELETE FROM calculation_history WHERE id = ${id}`;
    return result.count > 0;
  },

  async clearHistory(): Promise<void> {
    await sql`DELETE FROM calculation_history`;
  },
};

export default db;
