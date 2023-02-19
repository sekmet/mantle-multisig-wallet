import { useContext } from 'react';

import Spinner from '@/components/Spinner';
import { WalletContext } from '@/state/context/walletContextProvider';

import TransactionRequest from './TransactionRequest';

const TransactionRequestsAll = () => {
  const {
    showSpinner,
    state: { transactionRequests },
  } = useContext(WalletContext);

  return transactionRequests?.length ? (
    <>
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
          Transactions/ Requests
        </h2>
        <div className="flex">
          <div className="flex items-center">{showSpinner && <Spinner />}</div>
        </div>
      </div>
      <div className="card mt-3">
        <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
          <table className="is-hoverable w-full text-left">
            <thead>
              <tr>
                <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Requester
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  To
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Approved
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Amount
                </th>
                <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5" />
              </tr>
            </thead>
            <tbody>
              {transactionRequests?.map((transaction) => (
                <tr
                  key={transaction.id.toString()}
                  className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500"
                >
                  <TransactionRequest {...transaction} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default TransactionRequestsAll;
