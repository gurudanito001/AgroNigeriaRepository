import Validator from 'validator';

 interface loginInput{
  email: String,
  password: String
}
export function validateLoginInput(data: loginInput) {
  let errorMessage = "";

  // Convert empty fields to an empty string so we can use validator functions
  data.email = !Validator.isEmpty(data.email) ? data.email : "";
  data.password = !Validator.isEmpty(data.password) ? data.password : ""; 

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errorMessage  = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errorMessage = "Email is invalid";
  }
  // Password checks
  else if (Validator.isEmpty(data.password)) {
    errorMessage = "Password field is required";
  }

  return {
    errorMessage,
    isValid: Validator.isEmpty(errorMessage)
  };
}; 