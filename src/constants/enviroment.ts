import * as dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV: string = process.env.NODE_ENV!;
export const PORT: number = Number(process.env.PORT!);
export const DB_HOST: string = process.env.DB_HOST!;
export const DB_PORT: number = Number(process.env.DB_PORT!);
export const DB_USER: string = process.env.DB_USER!;
export const DB_PASSWORD: string = process.env.DB_PASSWORD!;
export const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET!;
export const CONFIRMATION_TOKEN_SECRET: string = process.env.CONFIRMATION_TOKEN_SECRET!;
export const REFRESH_TOKEN_EXPIRES_IN_SECONDS: string = process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS!;
export const ACCESS_TOKEN_EXPIRES_IN_SECONDS: string = process.env.ACCESS_TOKEN_EXPIRES_IN_SECONDS!;

export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_PORT = Number(process.env.SMTP_PORT!);
export const SMTP_USER = process.env.SMTP_USER!;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD!;
export const SMTP_FROM = process.env.SMTP_FROM!;
