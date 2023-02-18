import Jazzicon from '@sekmet/jazzicon';
import { useEffect, useRef } from 'react';
// import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

export default function Identicon({
  accountId,
  iconSize = 36,
}: {
  accountId: string;
  iconSize: number;
}) {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (accountId && ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild<any>(
        Jazzicon(iconSize, parseInt(accountId.slice(2, 10), iconSize))
      );
    }
  }, []);

  return (
    <div
      style={{ borderRadius: '1.125rem', backgroundColor: 'transparent' }}
      ref={ref as any}
    />
  );
}
