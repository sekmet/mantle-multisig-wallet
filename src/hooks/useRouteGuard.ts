import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import { Web3Context } from '@/state/context/web3ContextProvider';

export const useRouteGuard = () => {
  const router = useRouter();

  const {
    state: { userAddress, isLoading },
  } = useContext(Web3Context);

  useEffect(() => {
    if (!isLoading && !userAddress) {
      router.push('/');
    }
  }, [isLoading, userAddress]);
};
