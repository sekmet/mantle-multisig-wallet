import { ethers } from 'ethers';
import { Formik } from 'formik';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { useERC721Wallet } from '@/hooks/useERC721Wallet';

const DepositERC721 = () => {
  const { depositERC721ToWallet, loading } = useERC721Wallet();
  return (
    <>
      <Formik
        initialValues={{
          tokenAddress: '',
          tokenId: '',
        }}
        validate={async ({ tokenAddress, tokenId }) => {
          const errors = {} as any;

          if (!tokenAddress) {
            errors.tokenAddress = 'Required';
          } else if (!ethers.utils.isAddress(tokenAddress)) {
            errors.tokenAddress = 'Not a valid contract';
          } else if (!tokenId) {
            errors.tokenId = 'Required';
          } else if (+tokenId < 0) {
            errors.tokenId = 'Has to be more than 0';
          }

          return errors;
        }}
        onSubmit={async (
          { tokenAddress, tokenId },
          { setSubmitting, resetForm }
        ) => {
          await depositERC721ToWallet(tokenAddress, tokenId);

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
              name="tokenId"
              labelName="Token id"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.tokenId}
              placeholder="1"
            />
            {errors.tokenId && touched.tokenId && errors.tokenId}
            <Button type="submit" disabled={!isValid} showSpinner={loading}>
              Deposit
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default DepositERC721;
