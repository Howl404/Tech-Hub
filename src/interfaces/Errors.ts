export interface ResponseErrorItem {
  code: string;
  detailedErrorMessage: string;
  message: string;
}

export interface FormErrorsInterface {
  formErrors: { [email: string]: string; password: string };
}
