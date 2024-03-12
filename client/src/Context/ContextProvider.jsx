import React, { createContext, useState } from "react";

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [printPdf, setPrintPdf] = useState("");

  const contextValue = {
    printPdf,
    setPrintPdf, // Include the setPrintPdf function in the context
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default ContextProvider;
