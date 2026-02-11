import { ID, Query, Models } from "appwrite";
import { databases, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID_DESIGNERS, APPWRITE_COLLECTION_ID_OBJECTS } from "../appwrite/appwriteConfig";
import { type IDesignerRepository } from "../../domain/interfaces/IDesignerRepository";
import { Designer } from "../../domain/models/Designer";

interface DesignerDocument extends Models.Document {
    fullName: string;
    workingHours: string;
    status?: "active" | "inactive";
    avatarUrl?: string;
    objects?: Models.Document[];
}

export class AppwriteDesignerRepository implements IDesignerRepository {
    
    async getAll(): Promise<Designer[]> {
        try {
            const [designersResponse, objectsResponse] = await Promise.all([
                databases.listDocuments(
                    APPWRITE_DATABASE_ID,
                    APPWRITE_COLLECTION_ID_DESIGNERS,
                    [
                        Query.orderDesc("$createdAt")
                    ]
                ),
                databases.listDocuments(
                    APPWRITE_DATABASE_ID,
                    APPWRITE_COLLECTION_ID_OBJECTS,
                    [
                        // select only 'designers' attribute to be lightweight if supported, 
                        // matching the limit to a reasonable number or max
                        Query.limit(1000) 
                    ]
                )
            ]);

            // Create a map of designerId -> attachedObjectsCount
            const designerObjectCounts: Record<string, number> = {};
            
            objectsResponse.documents.forEach((obj: any) => {
                let designerId = "";
                if (obj.designers && typeof obj.designers === 'object' && '$id' in obj.designers) {
                    designerId = obj.designers.$id;
                } else if (typeof obj.designers === 'string') {
                    designerId = obj.designers;
                }
                
                if (designerId) {
                    designerObjectCounts[designerId] = (designerObjectCounts[designerId] || 0) + 1;
                }
            });

            return designersResponse.documents.map(doc => {
                // Manually inject the calculated count
                const count = designerObjectCounts[doc.$id] || 0;
                // If doc.objects exists and has length, we could prefer it, but user said it's 0.
                // So we override/fallback to our manual count.
                // We need to pass this count to mapToDomain or update the mapped domain object.
                const domainDesigner = this.mapToDomain(doc);
                domainDesigner.attachedObjectsCount = count; 
                // We might need to update mapToDomain to accept count or just set it here.
                // Since mapToDomain sets it based on doc.objects, we just overwrite it.
                return domainDesigner;
            });
        } catch (error) {
            console.error("Failed to fetch designers:", error);
            throw error;
        }
    }

    async getById(id: string): Promise<Designer | null> {
        try {
            const doc = await databases.getDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID_DESIGNERS,
                id
            );
            return this.mapToDomain(doc);
        } catch (error) {
            console.error(`Failed to fetch designer ${id}:`, error);
            return null;
        }
    }

    async create(data: Omit<Designer, 'id' | 'attachedObjectsCount'>): Promise<Designer> {
        try {
            const doc = await databases.createDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID_DESIGNERS,
                ID.unique(),
                {
                    fullName: data.fullName,
                    workingHours: data.workingHours,
                    status: data.status || "active",
                }
            );
            return this.mapToDomain(doc);
        } catch (error) {
            console.error("Failed to create designer:", error);
            throw error;
        }
    }

    async update(id: string, data: Partial<Designer>): Promise<Designer> {
        try {
            // Filter out fields that are not in the database schema or read-only
            const updateData: any = {};
            if (data.fullName) updateData.fullName = data.fullName;
            if (data.workingHours) updateData.workingHours = data.workingHours;
            if (data.status) updateData.status = data.status;
            if (data.status) updateData.status = data.status;
            
            const doc = await databases.updateDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID_DESIGNERS,
                id,
                updateData
            );
            return this.mapToDomain(doc);
        } catch (error) {
            console.error(`Failed to update designer ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await databases.deleteDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID_DESIGNERS,
                id
            );
        } catch (error) {
            console.error(`Failed to delete designer ${id}:`, error);
            throw error;
        }
    }

    private mapToDomain(doc: Models.Document): Designer {
        const designerDoc = doc as unknown as DesignerDocument;
        
        // Calculate attached objects count if relationship is expanded, otherwise 0
        const attachedObjectsCount = designerDoc.objects ? designerDoc.objects.length : 0;
        
        // Handle optional fields that might not exist in old documents
        const status = (designerDoc.status as "active" | "inactive") || "active";
        const avatarUrl = `https://i.pravatar.cc/150?u=${designerDoc.$id}`;

        return new Designer(
            designerDoc.$id,
            designerDoc.fullName,
            designerDoc.workingHours,
            attachedObjectsCount,
            status,
            avatarUrl
        );
    }
}
