import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext(undefined);

const ContextProvider = ({ children }) => {
  const [printPdf, setPrintPdf] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState();
  const [imgLink, seImgLink] = useState("");

  console.log("Hi,i am context providerpp", printPdf);
  useEffect(() => {
    setSelectedPdf(printPdf);
  }, [printPdf]); // Include printPdf in the dependency array

  const contextValue = {
    printPdf,
    setPrintPdf, // Include the setPrintPdf function in the context
    imgLink,
    seImgLink,
  };

  return (
    <AppContext.Provider value={{ printPdf, setPrintPdf, imgLink, seImgLink }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
