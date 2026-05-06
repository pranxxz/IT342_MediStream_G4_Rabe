import { useState, useMemo } from 'react';

export const useFilter = (initialData, searchFields = ['name']) => {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        searchFields.some(field => 
          item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Other filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return item[key] === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, filters, searchTerm, searchFields]);

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    setData
  };
};