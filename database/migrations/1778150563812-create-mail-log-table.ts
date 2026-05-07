import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMailLogTable1778150563812 implements MigrationInterface {
  name = 'CreateMailLogTable1778150563812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "mail_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4 (),
        "recipient" character varying(255) NOT NULL,
        "subject" character varying(255) NOT NULL,
        "type" character varying(50),
        "body" text NOT NULL,
        "context" json,
        "sent_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_5f5d6638b167ebd36862ba28953" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mail_logs"`);
  }
}
