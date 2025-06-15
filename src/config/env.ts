import dotenv from "dotenv";
dotenv.config();

export const env = {
  time_zone: process.env.TZ,
  database: {
    client: process.env.DB,
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  },
  api_url: process.env.API_URL,
  api_port: Number(process.env.API_PORT),
  secret: process.env.JWT_SECRET,
  messageBroker: {
    host: process.env.RABBITMQ_HOST,
    port: Number(process.env.RABBITMQ_PORT),
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASS,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
  },
  stripe: {
    stripe_secret: process.env.STRIPE_SECRET,
    price_ids: {
      basic: process.env.STRIPE_PRICE_ID_BASIC,
      standard: process.env.STRIPE_PRICE_ID_STANDARD,
      premium: process.env.STRIPE_PRICE_ID_PREMIUM,
    },
  },
};
