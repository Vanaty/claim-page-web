import { useMemo } from 'react';

export function useUniqueData<T extends { id: string | number }>(data: T[]): T[] {
  return useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    const seen = new Set();
    return data.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }, [data]);
}
