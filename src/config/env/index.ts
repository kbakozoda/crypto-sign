import * as dotenv from 'dotenv';

dotenv.config();

interface IConfig {
    port: string | number;
    redis: {
        host: string;
        port: number;
    };
}

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const development: IConfig = {
    port: process.env.PORT || 3000,
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: +process.env.REDIS_PORT || 6379
    }
};

const production: IConfig = {
    port: process.env.PORT || 3000,
    redis: {
        host: process.env.REDIS_HOST || 'https://production_redis',
        port: +process.env.REDIS_PORT || 6379
    }
};

const config: {
    [name: string]: IConfig
} = {
    development,
    production
};

export default config[NODE_ENV];
