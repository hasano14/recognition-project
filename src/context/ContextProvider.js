import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

const initialState = {
  sidebar: false,
};

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, SetIsClicked] = useState(initialState);

  const handleClick = (clicked) => {
    SetIsClicked({ ...initialState, [clicked]: true });
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        isClicked,
        SetIsClicked,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
