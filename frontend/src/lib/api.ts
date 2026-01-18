const BASE = '/api';

export const api = {
  get: async <T>(url: string): Promise<T> => {
    const res = await fetch(BASE + url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  post: async <T>(url: string, data: unknown): Promise<T> => {
    const res = await fetch(BASE + url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  delete: async (url: string): Promise<void> => {
    const res = await fetch(BASE + url, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
};
