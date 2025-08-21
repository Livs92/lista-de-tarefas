import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const hasWindow = typeof window !== "undefined" && window.localStorage;
      const raw = hasWindow ? window.localStorage.getItem(key) : null;
      return raw ? JSON.parse(raw) : initialValue;
    } catch (e) {
      void e;
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      void e;
    }
  }, [key, value]);

  return [value, setValue];
}
