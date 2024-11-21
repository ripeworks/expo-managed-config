import { createContext, useContext } from "react";

import { getManagedConfig } from ".";

const Context = createContext<any>({});

export function ManagedConfigProvider({ children }: React.PropsWithChildren) {
  const managedConfig = getManagedConfig();

  return <Context.Provider value={managedConfig}>{children}</Context.Provider>;
}

export function useManagedConfig<T extends Record<string, any>>() {
  return useContext<T>(Context);
}
