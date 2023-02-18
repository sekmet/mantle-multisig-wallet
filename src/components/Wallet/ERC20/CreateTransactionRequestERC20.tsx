import { ethers } from 'ethers';
import { Formik } from 'formik';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { useERC20Wallet } from '@/hooks/useERC20Wallet';

const CreateTransactionRequestERC20 = () => {
  const { createTransactionRequestERC20, showSpinner } = useERC20Wallet();

  return (
    <>
      <Formik
        initialValues={{
          to: '',
          value: '',
          tokenAddress: '',
        }}
        validate={({ to, value, tokenAddress }) => {
          const errors = {} as any;

          if (!to) {
            errors.to = 'Required';
          } else if (!ethers.utils.isAddress(to)) {
            errors.to = `Address (${to})ist not valid`;
          } else if (+value < 0) {
            errors.value = 'Has to be more than 0';
          } else if (!value) {
            errors.value = 'Required';
          } else if (!tokenAddress) {
            errors.tokenAddress = 'Required';
          } else if (!ethers.utils.isAddress(tokenAddress)) {
            errors.tokenAddress = 'Token Contract is not valid';
          }

          return errors;
        }}
        validateOnChange={true}
        onSubmit={async (
          { to, value, tokenAddress },
          { setSubmitting, resetForm }
        ) => {
          await createTransactionRequestERC20(
            to,
            value.toString(),
            tokenAddress
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
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <Input
              type="text"
              labelName="Send transaction to:"
              name="to"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.to}
              placeholder="0x124.."
            />
            {errors.to && touched.to && errors.to}
            <Input
              type="number"
              name="value"
              labelName="ERC20 token value you want to send"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.value}
              placeholder="0.01"
            />
            {errors.value && touched.value && errors.value}
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
            <Button type="submit" disabled={!isValid} showSpinner={showSpinner}>
              Request Transaction
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default CreateTransactionRequestERC20;
