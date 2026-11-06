export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: {
    name?: string;
    email?: string;
  };
};

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};