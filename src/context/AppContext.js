import React, { createContext, useState, useContext } from 'react';
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    flat: '',
    apartment: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });
  const value = {
    files,
    setFiles,
    form,
    setForm,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);
