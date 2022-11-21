import React, { createContext } from "react";

const Web3Context = React.createContext();

const Web3Consumer = Web3Context.Consumer;

const Web3Provider = Web3Context.Provider;

export { Web3Context, Web3Consumer, Web3Provider };
