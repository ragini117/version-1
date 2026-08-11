import * as Yup from "yup";
import axios from "axios";
import { apiUrl } from "../../../environment";

// username validation Api
const handleusernamevalApi = async (value) => {
  if (value.length >= 3) {
    const data = {
      username: value,
    };
    return new Promise(async (resolve) => {
      await axios
        .post(`${apiUrl}${"/users/usernameValidation"}`, data)
        .then((res) => {
          if (res?.data?.status && res?.data.error) {
            return resolve(false);
          }
          return resolve(true);
        });
    });
  }
};

// handle Emailvalidation
const handleEmailvalApi = async (email) => {
  const data = {
    email: email,
  };
  return new Promise(async (resolve) => {
    await axios
      .post(`${apiUrl}${"/users/emailValidation"}`, data)
      .then((res) => {
        if (res?.data?.status && res?.data.error) {
          return resolve(false);
        }
        return resolve(true);
      });
  });
};

export const SignupSchema = Yup.object({
  userName: Yup.string()
    .min(3, " This field must have at least 3 character.")
    .max(25)
    .test("unique_username", "Username already exists", async (values) => {
      const response = await handleusernamevalApi(values);
      return response;
    })
    .required("This field is required."),
  email: Yup.string()
    .email("Invalid email")
    .test("unique_email", "Email already registered", async (email) => {
      const response = await handleEmailvalApi(email);
      return response;
    })
    .required(" This field is required. "),
  password: Yup.string()
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol")
    .required("This field is required."),
  confirmPassword: Yup.string()
    .required(" This field is required. ")
    .oneOf([Yup.ref("password"), null], "password must match"),
  refferedby: Yup.string(),
});
