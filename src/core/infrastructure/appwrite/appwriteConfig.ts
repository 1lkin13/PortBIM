import { Client, Databases, Account } from "appwrite";

const client = new Client();

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!projectId) {
    console.warn("Appwrite Project ID is missing in .env file");
}

client
    .setEndpoint(endpoint)
    .setProject(projectId);

export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "portbim-db";
export const APPWRITE_COLLECTION_ID_DESIGNERS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_DESIGNERS || "designers";
export const APPWRITE_COLLECTION_ID_OBJECTS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_OBJECTS || "objects";

// Initialize Services
export const databases = new Databases(client);
export const account = new Account(client);

export default client;
