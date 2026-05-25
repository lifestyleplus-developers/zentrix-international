export type ContactFormPayload = {
  name: string;
  phone: string;
  email: string;
  productInterest: string[];
  requirement: string;
};

export type ContactFormResponse = {
  success: boolean;
  message?: string;
};

export type ProductInterestOption = {
  label: string;
  value: string;
};

export type ProductInterestGroup = {
  category: string;
  options: ProductInterestOption[];
};
