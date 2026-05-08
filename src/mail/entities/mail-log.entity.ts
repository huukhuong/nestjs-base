import { BaseEntity } from 'src/common/entities';
import { Column, Entity } from 'typeorm';

export enum MailType {
  TEXT = 'text',
  HTML = 'html',
  TEMPLATE = 'template',
}

@Entity('mail_logs')
export class MailLogEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  recipient: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: MailType;

  /** Plain text, HTML string, or template name depending on type */
  @Column({ type: 'text' })
  body: string;

  /** JSON context for template (only used when type = template) */
  @Column({ type: 'json', nullable: true })
  context: Record<string, unknown> | null;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date | null;
}
