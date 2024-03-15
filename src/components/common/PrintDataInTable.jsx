import React, { createContext, useContext } from "react";

// Create a context
const PrintContext = createContext();

// Create a provider component
export const PrintProvider = ({ children }) => {
  const printContent = (contentId) => {
    const printWindow = window.open("", "", "width=600,height=600");
    const content = document.getElementById(contentId);

    if (printWindow && content) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head> 

          but hey, listen, how can i bot to that group, i want to access some public group bot, how can admin add those bot
            <title>Print</title> 

            but the concern is, i want to extract without adding bot, i dont want to add bot in that group
          </head>
          <body>${content.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <PrintContext.Provider value={{ printContent }}>
      {children}
    </PrintContext.Provider>
  );
};

// Custom hook to access the printing functionality
export const usePrint = () => {
  return useContext(PrintContext);
};
