import { Object3D } from '../models/Object3D';

export interface IObjectRepository {
  getAll(): Promise<Object3D[]>;
  getById(id: string): Promise<Object3D | null>;
  create(object: Omit<Object3D, 'id'>): Promise<Object3D>;
  update(id: string, data: Partial<Object3D>): Promise<Object3D>;
  delete(id: string): Promise<void>;
}
