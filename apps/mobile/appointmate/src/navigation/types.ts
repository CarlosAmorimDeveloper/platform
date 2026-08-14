export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  FormEntry: { formId?: string } | undefined;
  FormDetail: { formId: string };
};
