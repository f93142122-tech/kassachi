import { useCallback } from 'react';
import { useApp } from './context.js';
import { api, haptic } from './api.js';

// Guruh amali: POST -> yangilangan guruhni saqlash, oynani yopish, xabar ko'rsatish
export function useGroupCall() {
  const { run, setGroup, closeSheet, toast } = useApp();
  return useCallback((gid, path, body, okText, method = 'POST') => run(async () => {
    const g = await api(`/api/groups/${gid}${path}`, { method, body: method === 'DELETE' ? undefined : body || {} });
    setGroup(g);
    closeSheet();
    if (okText) { toast(okText); haptic('ok'); }
    return g;
  }), [run, setGroup, closeSheet, toast]);
}

export function useConfirm() {
  const { openSheet } = useApp();
  return useCallback(opts => openSheet('confirm', opts), [openSheet]);
}
