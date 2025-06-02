// test s3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
    },
});

const testUpload = async () => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "./prompt.txt",
        Body: "Contenido de prueba",
    };

    try {
        const result = await s3Client.send(new PutObjectCommand(params));
        console.log("Subida exitosa:", result);
    } catch (error) {
        console.error("Error al subir archivo:", error);
    }
};

testUpload();
