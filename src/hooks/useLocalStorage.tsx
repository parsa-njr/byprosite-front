import { useEffect, useState } from "react";

 export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
    window.dispatchEvent(new Event("local-storage-change"));
  };

  useEffect(() => {
    const handleChange = () => {
      const item = localStorage.getItem(key);
      setValue(item ? JSON.parse(item) : initialValue);
    };

    window.addEventListener("storage", handleChange);
    window.addEventListener("local-storage-change", handleChange);

    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("local-storage-change", handleChange);
    };
  }, [key]);

  return [value, setStoredValue];
}
