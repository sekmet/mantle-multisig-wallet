import { ethers } from 'ethers';
import { Formik } from 'formik';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { useERC721Wallet } from '@/hooks/useERC721Wallet';

const CreateTransactionRequestERC721 = () => {
  const { createTransactionRequestERC721, loading } = useERC721Wallet();

  return (
    <>
      <Formik
        initialValues={{
          to: '',
          tokenId: '',
          tokenAddress: '',
        }}
        validate={({ to, tokenId, tokenAddress }) => {
          const errors = {} as any;

          if (!to) {
            errors.to = 'Required';
          } else if (!ethers.utils.isAddress(to)) {
            errors.to = `Address (${to})ist not valid`;
          } else if (+tokenId < 0) {
            errors.tokenId = 'Has to be more than 0';
          } else if (!tokenId) {
            errors.tokenId = 'Required';
          } else if (!tokenAddress) {
            errors.tokenAddress = 'Required';
          } else if (!ethers.utils.isAddress(tokenAddress)) {
            errors.tokenAddress = 'Token Contract is not valid';
          }

          return errors;
        }}
        validateOnChange={true}
        onSubmit={async (
          { to, tokenId, tokenAddress },
          { setSubmitting, resetForm }
        ) => {
          await createTransactionRequestERC721(
            to,
            tokenId.toString(),
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
              name="tokenId"
              labelName="Token id"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.tokenId}
              placeholder="1"
            />
            {errors.tokenId && touched.tokenId && errors.tokenId}
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
            <Button type="submit" disabled={!isValid} showSpinner={loading}>
              Request Transaction
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default CreateTransactionRequestERC721;
