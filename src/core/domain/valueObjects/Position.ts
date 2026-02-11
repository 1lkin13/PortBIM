export class Position {
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static zero(): Position {
    return new Position(0, 0, 0);
  }

  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }
}
