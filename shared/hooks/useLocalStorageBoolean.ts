import { useCallback, useSyncExternalStore } from 'react';

const listenersByKey = new Map<string, Set<() => void>>();

function subscribeToKey(key: string, listener: () => void) {
  let listeners = listenersByKey.get(key);
  if (!listeners) {
    listeners = new Set();
    listenersByKey.set(key, listeners);
  }
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === key) {
      listener();
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function emit(key: string) {
  listenersByKey.get(key)?.forEach((listener) => listener());
}

function readBoolean(key: string, defaultValue: boolean): boolean {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;
    return stored === 'true';
  } catch {
    return defaultValue;
  }
}

export function useLocalStorageBoolean(key: string, defaultValue = false) {
  const subscribe = useCallback(
    (listener: () => void) => subscribeToKey(key, listener),
    [key]
  );

  const getSnapshot = useCallback(
    () => readBoolean(key, defaultValue),
    [key, defaultValue]
  );

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const resolved = typeof next === 'function' ? next(readBoolean(key, defaultValue)) : next;
      try {
        localStorage.setItem(key, String(resolved));
      } catch {
        // private mode / storage quota
      }
      emit(key);
    },
    [key, defaultValue]
  );

  return [value, setValue] as const;
}
