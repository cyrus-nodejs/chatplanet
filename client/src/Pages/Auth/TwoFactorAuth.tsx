import "../../index.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/app/hook";
import { getMessage, twoFactorLogin, getError } from "../../Redux/features/auth/authSlice";

const TwoFactorAuth = () => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  
  const message = useAppSelector(getMessage);
  const error = useAppSelector(getError);


  interface FormValues {
    mfacode: string;
  }

  const validationSchema = Yup.object().shape({
    mfacode: Yup.string()
      .required("MFA code is required")
      .matches(/^\d{6}$/, "MFA code must be 6 digits"),
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      await dispatch(twoFactorLogin(values));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      formik.setErrors({ mfacode: error.message || "Verification failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: { mfacode: "" },
    validationSchema,
    onSubmit: handleSubmit,
  });

  // Auto-submit when 6 digits are entered


  return (
    <div className="flex bg-slate-50 m-auto h-screen">
      <div className="m-auto w-96">
        <p className="text-2xl text-gunMetal text-center mb-3 font-semibold">
          Verify Your Identity
        </p>
        <p className="text-center text-gunMetal pb-5">
          Enter the 6-digit code sent to your email.
        </p>

        <form className="bg-white p-6" onSubmit={formik.handleSubmit}>
          <div className="input-group border rounded bg-slate-50 max-w-sm">
            <span className="input-group-text">
              <i className="bx bx-envelope w-1/6 px-6 bx-xs"></i>
            </span>
            <input
              name="mfacode"
              type="text"
              value={formik.values.mfacode}
              onChange={formik.handleChange}
              placeholder="Enter MFA code"
              disabled={submitting}
              className="text-gunMetal grow input focus:outline-none h-12 bg-white w-5/6"
            />
          </div>

          {formik.touched.mfacode && formik.errors.mfacode && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.mfacode}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || formik.values.mfacode.length !== 6}
            className="w-full text-white mt-4 rounded-md bg-purple-400 h-12"
          >
            {submitting ? "Verifying..." : "Verify MFA code"}
          </button>

          {message && (
            <p className={`${ message ?  'text-red-500 mt-2 text-center'  : 'text-green-500 mt-2 text-center'  } `}>{message ? message : error?.message.toString()}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
