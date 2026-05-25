export type ContactFormPayload = {
  name: string;
  phone: string;
  email: string;
  requirement: string;
};

export type ContactFormResponse = {
  success: boolean;
  message?: string;
};
