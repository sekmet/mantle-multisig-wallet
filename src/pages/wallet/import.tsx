import { WalletIcon } from '@heroicons/react/24/solid';
import { ethers } from 'ethers';
import { Formik } from 'formik';
import { useContext } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { Meta } from '@/layouts/Meta';
import { WalletContext } from '@/state/context/walletContextProvider';
import { Main } from '@/templates/Main';

const ImportMultiSigWallet = () => {
  const walletContext = useContext(WalletContext);

  useRouteGuard();

  return (
    <Main
      meta={
        <Meta
          title="Multisig wallets for BitDAO"
          description="Create, import and use Multisig wallets for BitDAO, ERC20 and ERC721 transactions"
        />
      }
    >
      <div className="flex flex-col items-center justify-center p-4">
        <div className="card p-6">
          <h1 className="mb-4 flex text-2xl font-bold">
            <WalletIcon className="mr-1 h-8 w-8" aria-hidden="true" /> Import a
            multisig wallet
          </h1>
          <Formik
            initialValues={{ address: '' }}
            validate={({ address }) => {
              const errors = {} as any;
              if (!address) {
                errors.address = 'Required';
              } else if (!ethers.utils.isAddress(address)) {
                errors.address = 'Not a valid address';
              }
              return errors;
            }}
            validateOnChange={false}
            onSubmit={(
              { address },

              { setSubmitting, resetForm }
            ) => {
              walletContext.importMultiSigWalletContract(address);
              setSubmitting(false);
              resetForm();
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isValid,
            }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  type="text"
                  name="address"
                  labelName="Wallet Contract Address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address}
                  placeholder="0x123"
                />
                <span className="font-semibold text-red-500">
                  {errors.address && touched.address && errors.address}
                </span>
                <Button
                  type="submit"
                  className={!isValid ? 'bg-slate-600 text-slate-500' : ''}
                  disabled={!isValid}
                >
                  Import Wallet
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Main>
  );
};

export default ImportMultiSigWallet;
