import { Position } from '../valueObjects/Position';

export const ObjectSize = {
  SMALL: 'small',
  NORMAL: 'normal',
  LARGE: 'large'
} as const;

export type ObjectSize = (typeof ObjectSize)[keyof typeof ObjectSize];

export const ObjectShape = {
  BOX: 'box',
  SPHERE: 'sphere',
  CYLINDER: 'cylinder',
  TORUS: 'torus',
  HEART: 'heart'
} as const;

export type ObjectShape = (typeof ObjectShape)[keyof typeof ObjectShape];

export class Object3D {
  public readonly id: string;
  public name: string;
  public attachedDesignerId: string;
  public color: string;
  public position: Position;
  public size: ObjectSize;
  public shape: ObjectShape;

  constructor(
    id: string,
    name: string,
    attachedDesignerId: string,
    color: string,
    position: Position,
    size: ObjectSize,
    shape: ObjectShape = ObjectShape.BOX
  ) {
    this.id = id;
    this.name = name;
    this.attachedDesignerId = attachedDesignerId;
    this.color = color;
    this.position = position;
    this.size = size;
    this.shape = shape;
  }
}
