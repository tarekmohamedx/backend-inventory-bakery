module.exports.APP_CONFIG = {
    MONGO_URL:process.env.MONGO_URL,
    APP_NAME: 'NodeJSTest',
    HTTP_PORT:8000,
    MONGO_DEV_URI: process.env.MONGO_DEV_URI,
    MONGO_PROD_URI: process.env.MONGO_PROD_URI,
    MONGO_TEST_URI: process.env.MONGO_TEST_URI,
    MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
    MONGO_DATABASE_USER: process.env.MONGO_DATABASE_USER,
    MONGO_DATABASE_PASSWORD: process.env.MONGO_DATABASE_PASSWORD,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_ENDPOINT_URL: process.env.IMAGEKIT_ENDPOINT_URL,
    IMAGEKIT_INSTANCE_ID: process.env.IMAGEKIT_INSTANCE_ID,
};