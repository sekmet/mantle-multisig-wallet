import type { FC, PropsWithChildren } from 'react';
import { createContext } from 'react';

/* eslint-disable import/no-cycle */
import { useWallet } from '@/hooks/useWallet';

export const WalletContext = createContext({} as ReturnType<typeof useWallet>);

export const WalletContextProvider: FC<PropsWithChildren> = (props) => {
  return (
    <>
      <WalletContext.Provider value={useWallet()}>
        {props.children}
      </WalletContext.Provider>
    </>
  );
};
