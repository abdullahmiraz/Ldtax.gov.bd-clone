import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext(undefined);

const ContextProvider = ({ children }) => {
  const [printPdf, setPrintPdf] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState();

  console.log("Hi,i am context providerpp", printPdf);
  useEffect(() => {
    setSelectedPdf(printPdf);
  }, [printPdf]); // Include printPdf in the dependency array
  
  const contextValue = {
    printPdf,
    setPrintPdf, // Include the setPrintPdf function in the context
  };

  return (
    <AppContext.Provider value={{ printPdf, setPrintPdf }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
