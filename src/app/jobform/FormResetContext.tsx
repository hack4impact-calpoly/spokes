import React, { createContext, useContext, useState } from "react";

const FormResetContext = createContext({
  resetForm: false,
  triggerReset: () => {},
});

export const useFormReset = () => useContext(FormResetContext);

export const FormResetProvider = ({ children }: { children: React.ReactNode }) => {
  const [resetForm, setResetForm] = useState(false);

  const triggerReset = () => {
    setResetForm(true);
    setTimeout(() => setResetForm(false), 0); // Reset the state back to false after triggering
  };

  return <FormResetContext.Provider value={{ resetForm, triggerReset }}>{children}</FormResetContext.Provider>;
};
