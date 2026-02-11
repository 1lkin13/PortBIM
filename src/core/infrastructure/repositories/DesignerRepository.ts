import { nanoid } from 'nanoid';
import { type IDesignerRepository } from '../../domain/interfaces/IDesignerRepository';
import { Designer } from '../../domain/models/Designer';

export class MockDesignerRepository implements IDesignerRepository {
  private key = 'sb3d_designers';

  private getDesigners(): Designer[] {
    const data = localStorage.getItem(this.key);
    if (!data) return [];
    return JSON.parse(data);
  }

  private saveDesigners(designers: Designer[]) {
    localStorage.setItem(this.key, JSON.stringify(designers));
  }

  async getAll(): Promise<Designer[]> {
    return this.getDesigners();
  }

  async getById(id: string): Promise<Designer | null> {
    return this.getDesigners().find(d => d.id === id) || null;
  }

  async create(data: Omit<Designer, 'id' | 'attachedObjectsCount'>): Promise<Designer> {
    const designers = this.getDesigners();
    const newDesigner = new Designer(
      nanoid(),
      data.fullName,
      data.workingHours,
      0
    );
    designers.push(newDesigner);
    this.saveDesigners(designers);
    return newDesigner;
  }

  async update(id: string, data: Partial<Designer>): Promise<Designer> {
    const designers = this.getDesigners();
    const index = designers.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Designer not found');
    
    designers[index] = { ...designers[index], ...data };
    this.saveDesigners(designers);
    return designers[index];
  }

  async delete(id: string): Promise<void> {
    const designers = this.getDesigners();
    const filtered = designers.filter(d => d.id !== id);
    this.saveDesigners(filtered);
  }
}
