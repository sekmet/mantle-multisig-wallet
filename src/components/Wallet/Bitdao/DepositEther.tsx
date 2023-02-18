import { Formik } from 'formik';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { useEtherWallet } from '@/hooks/useEtherWallet';

const DepositEther = () => {
  const { depositEtherToSelectedWallet, showSpinner } = useEtherWallet();

  return (
    <>
      <Formik
        initialValues={{
          value: '',
        }}
        validate={({ value }) => {
          const errors = {} as any;

          if (!value) {
            errors.value = 'Required';
          } else if (+value < 0) {
            errors.value = 'Has to be more than 0';
          }
          return errors;
        }}
        validateOnChange={true}
        onSubmit={async ({ value }, { setSubmitting, resetForm }) => {
          await depositEtherToSelectedWallet(value.toString());

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
              type="number"
              name="value"
              labelName="BitDAO amount you want to deposit"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.value}
              placeholder="0.1"
            />
            <span className="font-semibold text-red-500">
              {errors.value && touched.value && errors.value}
            </span>
            <Button type="submit" disabled={!isValid} showSpinner={showSpinner}>
              Deposit
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default DepositEther;
