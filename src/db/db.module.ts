import { Global, Module } from '@nestjs/common';
import { db, DrizzleDatabase } from './drizzle-client';

@Global()
@Module({
  providers: [
    {
      provide: DrizzleDatabase,
      useValue: db,
    },
  ],
  exports: [DrizzleDatabase],
})
export class DbModule {}
