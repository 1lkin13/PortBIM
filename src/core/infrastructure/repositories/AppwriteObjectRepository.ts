import { ID, Query, Models } from "appwrite";
import { databases, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID_OBJECTS } from "../appwrite/appwriteConfig";
import { type IObjectRepository } from "../../domain/interfaces/IObjectRepository";
import { Object3D, ObjectShape } from "../../domain/models/Object3D";
import { Position } from "../../domain/valueObjects/Position";

interface ObjectDocument extends Models.Document {
    name: string;
    color: string;
    size: "small" | "normal" | "large";
    shape?: string;
    positionX: number;
    positionY: number;
    positionZ: number;
    designers?: Models.Document | string;
}

export class AppwriteObjectRepository implements IObjectRepository {
    
    async getAll(): Promise<Object3D[]> {
        try {
            const response = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID_OBJECTS,
                [
                    Query.orderDesc("$createdAt")
                ]
            );

            return response.documents.map(doc => this.mapToDomain(doc as unknown as ObjectDocument));
        } catch (error) {
            console.error("Failed to fetch objects:", error);
            throw error;
        }
    }

    async getById(id: string): Promise<Object3D | null> {
        try {
            const doc = await databases.getDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID_OBJECTS,
                id
            );
            return this.mapToDomain(doc as unknown as ObjectDocument);
        } catch (error) {
            console.error(`Failed to fetch object ${id}:`, error);
            return null;
        }
    }

    async create(data: Omit<Object3D, 'id'>): Promise<Object3D> {
        try {
            const documentData: any = {
                name: data.name,
                color: data.color,
                size: data.size,
                positionX: data.position.x,
                positionY: data.position.y,
                positionZ: data.position.z,
                designers: data.attachedDesignerId 
            };

            // Only add shape if it's explicitly set to avoid errors if the attribute is missing in schema
            if (data.shape) {
                documentData.shape = data.shape;
            }

            const doc = await databases.createDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID_OBJECTS,
                ID.unique(),
                documentData
            );
            return this.mapToDomain(doc as unknown as ObjectDocument);
        } catch (error: any) {
            console.error("Failed to create object. Appwrite Error:", error);
            // If it's a structural error, it might be the "shape" attribute missing in Appwrite
            if ((error?.code === 400 || error?.type === 'document_invalid_structure') && error?.message?.toLowerCase().includes('shape')) {
                console.warn("Retrying without 'shape' attribute because it seems missing in Appwrite schema.");
                const { shape, ...rest } = data;
                // Recursive call without the problematic attribute
                return this.create(rest as any);
            }
            throw error;
        }
    }

    async update(id: string, data: Partial<Object3D>): Promise<Object3D> {
        try {
            const updateData: any = {};
            if (data.name) updateData.name = data.name;
            if (data.color) updateData.color = data.color;
            if (data.size) updateData.size = data.size;
            if (data.shape) updateData.shape = data.shape;
            if (data.position) {
                updateData.positionX = data.position.x;
                updateData.positionY = data.position.y;
                updateData.positionZ = data.position.z;
            }
            if (data.attachedDesignerId) {
                updateData.designers = data.attachedDesignerId;
            }
            
            const doc = await databases.updateDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID_OBJECTS,
                id,
                updateData
            );
            return this.mapToDomain(doc as unknown as ObjectDocument);
        } catch (error: any) {
            console.error(`Failed to update object ${id}:`, error);
            // Gracefully handle missing shape attribute in Appwrite
            if ((error?.code === 400 || error?.type === 'document_invalid_structure') && error?.message?.toLowerCase().includes('shape')) {
                console.warn("Retrying update without 'shape' attribute.");
                const { shape, ...rest } = data;
                return this.update(id, rest);
            }
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await databases.deleteDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID_OBJECTS,
                id
            );
        } catch (error) {
            console.error(`Failed to delete object ${id}:`, error);
            throw error;
        }
    }

    private mapToDomain(doc: ObjectDocument): Object3D {
        let designerId = "";
        if (doc.designers && typeof doc.designers === 'object' && '$id' in doc.designers) {
             designerId = doc.designers.$id;
        } else if (typeof doc.designers === 'string') {
             designerId = doc.designers;
        }

        return new Object3D(
            doc.$id,
            doc.name,
            designerId,
            doc.color,
            new Position(doc.positionX, doc.positionY, doc.positionZ),
            doc.size,
            (doc.shape as ObjectShape) || ObjectShape.BOX
        );
    }
}
