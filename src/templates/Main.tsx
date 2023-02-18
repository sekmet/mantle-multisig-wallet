import type { ReactNode } from 'react';

import Navbar from '@/components/Navbar';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="min-h-screen bg-slate-50 antialiased dark:bg-navy-900">
    {props.meta}
    <Navbar />
    {/* <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl py-3 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Wallets</h1>
      </div>
    </header> */}
    <main>
      <div className="mx-auto max-w-7xl py-1 sm:px-6 lg:px-8">
        <div className="px-4 py-1 sm:px-0">{props.children}</div>
      </div>
    </main>
  </div>
);

export { Main };
