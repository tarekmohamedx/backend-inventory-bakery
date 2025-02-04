module.exports.APP_CONFIG = {
    MONGO_URL:process.env.MONGO_URL,
    APP_NAME: 'NodeJSTest',
    HTTP_PORT:8000,

    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_ENDPOINT_URL: process.env.IMAGEKIT_ENDPOINT_URL,
    IMAGEKIT_INSTANCE_ID: process.env.IMAGEKIT_INSTANCE_ID,
    JWT_SECRET:process.env.JWT_SECRET,

    // MONGO_DEV_URI: process.env.MONGO_DEV_URI,
    // MONGO_PROD_URI: process.env.MONGO_PROD_URI,
    // MONGO_TEST_URI: process.env.MONGO_TEST_URI,
    // MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
    // MONGO_DATABASE_USER: process.env.MONGO_DATABASE_USER,
    // MONGO_DATABASE_PASSWORD: process.env.MONGO_DATABASE_PASSWORD,
};

// // const ImageKit = require("imagekit.js");

// // const imagekit = new ImageKit({
// //     publicKey: "your_public_api_key",
// //     privateKey: "your_private_api_key",
// //     urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/"
// // });

// // module.exports = imagekit;

//     MONGO_DEV_URI: process.env.MONGO_DEV_URI,
//     MONGO_PROD_URI: process.env.MONGO_PROD_URI,
//     MONGO_TEST_URI: process.env.MONGO_TEST_URI,
//     MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
//     MONGO_DATABASE_USER: process.env.MONGO_DATABASE_USER,
//     MONGO_DATABASE_PASSWORD: process.env.MONGO_DATABASE_PASSWORD,
//     // IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
//     // IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
//     // IMAGEKIT_ENDPOINT_URL: process.env.IMAGEKIT_ENDPOINT_URL,
//     // IMAGEKIT_INSTANCE_ID: process.env.IMAGEKIT_INSTANCE_ID,
// };

