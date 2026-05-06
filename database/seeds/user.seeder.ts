import { User } from 'src/user.entity';
import { DataSource } from 'typeorm';

export async function userSeeder(dataSource: DataSource): Promise<void> {
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      {
        name: 'Timber',
        email: 'timber@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Phantom',
        email: 'phantom@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    .execute();
}
