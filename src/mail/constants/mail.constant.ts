export const MAIL_QUEUE_NAME = 'mail-queue';
export const MAIL_SEND_TEMPLATE_JOB_NAME = 'send-template-mail';

export enum EMailTemplateName {
  WELCOME = 'welcome',
  AUTH_FORGOT_PASSWORD_OTP = 'auth/forgot-password-otp',
  AUTH_PASSWORD_RESET_SUCCESS = 'auth/password-reset-success',
}

export const MAIL_TEMPLATE_SUBJECTS: Partial<
  Record<EMailTemplateName, string>
> = {
  [EMailTemplateName.WELCOME]: 'Welcome to the app',
  [EMailTemplateName.AUTH_FORGOT_PASSWORD_OTP]: 'Your password reset OTP',
  [EMailTemplateName.AUTH_PASSWORD_RESET_SUCCESS]:
    'Your password has been changed',
};

export const resolveMailSubject = (
  templateName: string,
  overrideSubject?: string,
): string => {
  if (overrideSubject) {
    return overrideSubject;
  }

  const defaultSubject =
    MAIL_TEMPLATE_SUBJECTS[templateName as EMailTemplateName];
  if (defaultSubject) {
    return defaultSubject;
  }

  return `Mail template: ${templateName}`;
};
