export enum VerificationType {
  FORGOT_PASSWORD = 'forgot-password',
}

export type VerificationOtpPayload = {
  userId: string;
  email: string;
  otpHash: string;
};

export type VerificationResetTokenPayload = {
  userId: string;
  email: string;
  type: VerificationType;
};
