import { Designer } from '../models/Designer';

export interface IDesignerRepository {
  getAll(): Promise<Designer[]>;
  getById(id: string): Promise<Designer | null>;
  create(designer: Omit<Designer, 'id' | 'attachedObjectsCount'>): Promise<Designer>;
  update(id: string, data: Partial<Designer>): Promise<Designer>;
  delete(id: string): Promise<void>;
}
