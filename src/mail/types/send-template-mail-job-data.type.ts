export type SendTemplateMailJobData = {
  to: string;
  templateName: string;
  subject?: string;
  variables: Record<string, unknown>;
  mailLogId: string;
};
