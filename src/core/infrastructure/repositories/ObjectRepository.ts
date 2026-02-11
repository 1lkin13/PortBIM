import { nanoid } from 'nanoid';
import type { IObjectRepository } from '../../domain/interfaces/IObjectRepository';
import { Object3D } from '../../domain/models/Object3D';

export class MockObjectRepository implements IObjectRepository {
  private key = 'sb3d_objects';

  private getObjects(): Object3D[] {
    const data = localStorage.getItem(this.key);
    if (!data) return [];
    return JSON.parse(data);
  }

  private saveObjects(objects: Object3D[]) {
    localStorage.setItem(this.key, JSON.stringify(objects));
  }

  async getAll(): Promise<Object3D[]> {
    return this.getObjects();
  }

  async getById(id: string): Promise<Object3D | null> {
    return this.getObjects().find(o => o.id === id) || null;
  }

  async create(data: Omit<Object3D, 'id'>): Promise<Object3D> {
    const objects = this.getObjects();
    const newObject = new Object3D(
      nanoid(),
      data.name,
      data.attachedDesignerId,
      data.color,
      data.position,
      data.size
    );
    objects.push(newObject);
    this.saveObjects(objects);
    return newObject;
  }

  async update(id: string, data: Partial<Object3D>): Promise<Object3D> {
    const objects = this.getObjects();
    const index = objects.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Object not found');
    
    objects[index] = { ...objects[index], ...data };
    this.saveObjects(objects);
    return objects[index];
  }

  async delete(id: string): Promise<void> {
    const objects = this.getObjects();
    const filtered = objects.filter(o => o.id !== id);
    this.saveObjects(filtered);
  }
}
