import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';

/**
 * DebouncedSearchBar — reusable search with debounce.
 * Props:
 *   placeholder (string)
 *   onSearch(query: string) — called after debounce delay
 *   debounceMs (number, default 350)
 */
const DebouncedSearchBar = ({ placeholder = 'Search...', onSearch, debounceMs = 350 }) => {
  const [value, setValue] = useState('');
  const timerRef = useRef(null);

  const handleChange = useCallback((e) => {
    const v = e.target.value;
    setValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (onSearch) onSearch(v.trim());
    }, debounceMs);
  }, [onSearch, debounceMs]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
      <Search
        size={16}
        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          width: '100%',
          paddingLeft: '38px',
          paddingRight: '12px',
          paddingTop: '8px',
          paddingBottom: '8px',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          fontSize: '0.875rem',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#1E3A8A')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
      />
    </div>
  );
};

export default DebouncedSearchBar;
