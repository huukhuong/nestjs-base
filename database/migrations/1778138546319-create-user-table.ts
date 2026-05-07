import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1778138546319 implements MigrationInterface {
  name = 'CreateUserTable1778138546319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_entities" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4 (),
        "first_name" character varying(50),
        "last_name" character varying(50),
        "username" character varying(50),
        "email" character varying(255),
        "phone_number" character varying(15),
        "password" character varying(60) NOT NULL,
        "status" character varying NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_10b5aa869588ccce3c51ad945c9" UNIQUE ("username"),
        CONSTRAINT "UQ_31b7cb5b22578e8a8d5673074c9" UNIQUE ("email"),
        CONSTRAINT "PK_a7584b73437b8bb1c96d58520bf" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_entities"`);
  }
}
