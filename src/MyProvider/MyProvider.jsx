// MyProvider.js
import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [state, setState] = useState([]);
  const [tenantId, setTenantId]=useState("");

  const updateState = (newState) => setState(newState);
  const updateTenantId=(tenantId)=> setTenantId(tenantId)

  return (
    <MyContext.Provider value={{ state, updateState, tenantId, updateTenantId }}>
      {children}
    </MyContext.Provider>
  );
};
