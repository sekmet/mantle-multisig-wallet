import type { FC, PropsWithChildren } from 'react';
import { createContext } from 'react';

import { useWeb3 } from '@/hooks/useWeb3';

export const Web3Context = createContext({} as ReturnType<typeof useWeb3>);

export const Web3ContextProvider: FC<PropsWithChildren> = (props) => {
  return (
    <>
      <Web3Context.Provider value={useWeb3()}>
        {props.children}
      </Web3Context.Provider>
    </>
  );
};
