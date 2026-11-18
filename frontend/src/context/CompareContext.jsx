import React, { createContext, useContext, useState, useEffect } from "react";

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem("localrank_compare");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("localrank_compare", JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (business) => {
    if (!business || !business.id) return { success: false, msg: "Invalid business" };

    if (compareList.some(item => item.id === business.id)) {
      return { success: false, msg: "Already in comparison tray" };
    }

    if (compareList.length >= 3) {
      return { success: false, msg: "You can compare up to 3 businesses at a time" };
    }

    setCompareList(prev => [...prev, business]);
    return { success: true, msg: `Added ${business.name} to comparison` };
  };

  const removeFromCompare = (id) => {
    setCompareList(prev => prev.filter(item => item.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (id) => compareList.some(item => item.id === id);

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      compareCount: compareList.length
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
