import dotenv from 'dotenv';
import fs from 'fs';

let envFile: string = '';
if (fs.existsSync('.env')) {
  envFile = '.env';
} else if (fs.existsSync('.env.local')) {
  envFile = '.env.local';
}

if (envFile) {
  console.log(`Using env file "${envFile}"`);
  dotenv.config({path: envFile});
}

export const SEMPRE_URL = process.env.SEMPRE_URL || 'http://localhost:8400/sempre';
export const SIMILARITY_URL = process.env.SIMILARITY_URL || 'http://localhost:7473';
export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 7471;
