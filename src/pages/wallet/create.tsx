import { WalletIcon } from '@heroicons/react/24/solid';
import { ethers } from 'ethers';
import { Formik } from 'formik';
import { useContext, useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { Meta } from '@/layouts/Meta';
import { WalletContext } from '@/state/context/walletContextProvider';
import { Main } from '@/templates/Main';

const CreateMultisigWallet = () => {
  const {
    createNewWallet,
    state: { loading },
  } = useContext(WalletContext);

  const [message, setMessage] = useState('');

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
            <WalletIcon className="mr-1 h-8 w-8" aria-hidden="true" /> Create a
            new multisig wallet
          </h1>
          <Formik
            initialValues={{
              admins: '',
              required: '',
            }}
            validate={({ admins, required }) => {
              const errors = {} as any;
              if (!admins) {
                errors.admins = 'Required';
              } else if (!required) {
                errors.required = 'Required';
              } else if (+required < 0) {
                errors.required = 'Required must be greater than 0';
              }

              admins.split(';').forEach((address) => {
                if (!ethers.utils.isAddress(address)) {
                  errors.admins = `Address (${address})ist not valid`;
                }
              });
              return errors;
            }}
            onSubmit={async (
              { admins, required },
              { setSubmitting, resetForm }
            ) => {
              const adminsList = admins.split(';');

              const address = await createNewWallet(adminsList, +required);
              setMessage(
                address
                  ? `Contract deployed to ${address}`
                  : 'Something went wrong'
              );

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
                <textarea
                  className="border-dark-secondary h-20 border-2 text-black"
                  name="admins"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.admins}
                  placeholder="0x123;0x312;0xfff"
                />
                {errors.admins && touched.admins && errors.admins}
                <Input
                  type="number"
                  name="required"
                  labelName="Admins required to approve a transaction"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.required}
                  placeholder="2"
                />
                {errors.required && touched.required && errors.required}
                <Button
                  type="submit"
                  className={!isValid ? 'bg-slate-600 text-slate-500' : ''}
                  disabled={!isValid}
                  showSpinner={loading}
                >
                  Create Walllet
                </Button>
              </form>
            )}
          </Formik>
          {message !== '' && <h1>{message}</h1>}
        </div>
      </div>
    </Main>
  );
};

export default CreateMultisigWallet;
