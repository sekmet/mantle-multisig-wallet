import { ethers } from 'ethers';
import { Formik } from 'formik';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { useERC20Wallet } from '@/hooks/useERC20Wallet';

const DepositERC20 = () => {
  const {
    getWalletValueERC20,
    depositERC20ToSelectedWallet,
    showSpinner,
    getTokenName,
    tokenName,
    tokenValue,
  } = useERC20Wallet();

  return (
    <>
      <Formik
        initialValues={{
          tokenAddress: '',
          value: '',
        }}
        validate={async ({ tokenAddress, value }) => {
          const errors = {} as any;

          if (!tokenAddress) {
            errors.tokenAddress = 'Required';
          } else if (!ethers.utils.isAddress(tokenAddress)) {
            errors.tokenAddress = 'Not a valid contract';
          } else if (!value) {
            errors.value = 'Required';
          } else if (+value < 0) {
            errors.value = 'Has to be more than 0';
          }

          await getTokenName(tokenAddress);
          await getWalletValueERC20(tokenAddress);
          return errors;
        }}
        onSubmit={async (
          { tokenAddress, value },
          { setSubmitting, resetForm }
        ) => {
          await depositERC20ToSelectedWallet(tokenAddress, value.toString());

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
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
            <Input
              type="text"
              name="tokenAddress"
              labelName="Token Address"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.tokenAddress}
              placeholder="0x123"
            />
            {errors.tokenAddress && touched.tokenAddress && errors.tokenAddress}
            <Input
              type="number"
              name="value"
              labelName="Token ammount you want to deposit"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.value}
              placeholder="0.01"
            />
            {errors.value && touched.value && errors.value}
            <Button
              className="grow"
              type="submit"
              disabled={!isValid}
              showSpinner={showSpinner}
            >
              Deposit
            </Button>
          </form>
        )}
      </Formik>
      {tokenName && (
        <h1 className="text-center">
          Value for {tokenName} = {tokenValue}
        </h1>
      )}
    </>
  );
};

export default DepositERC20;
