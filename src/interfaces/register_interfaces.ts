export interface RegistrationFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PostalCodePattern {
  [key: string]: string;
}
