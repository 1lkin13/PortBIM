export class Designer {
  public readonly id: string;
  public fullName: string;
  public workingHours: string;
  public attachedObjectsCount: number;
  public status: "active" | "inactive";
  public avatarUrl: string;

  constructor(
    id: string,
    fullName: string,
    workingHours: string,
    attachedObjectsCount: number = 0,
    status: "active" | "inactive" = "active",
    avatarUrl: string = ""
  ) {
    this.id = id;
    this.fullName = fullName;
    this.workingHours = workingHours;
    this.attachedObjectsCount = attachedObjectsCount;
    this.status = status;
    this.avatarUrl = avatarUrl;
  }

  static create(id: string, fullName: string, workingHours: string): Designer {
    // Basic format validation: HH:mm-HH:mm
    const pattern = /^([01]\d|2[0-4]):([0-5]\d)-([01]\d|2[0-4]):([0-5]\d)$/;
    if (!pattern.test(workingHours)) {
      throw new Error("Working hours must be in format HH:mm-HH:mm");
    }
    // Default avatar based on ID, but can be updated
    const avatarUrl = `https://i.pravatar.cc/150?u=${id}`;
    return new Designer(id, fullName, workingHours, 0, "active", avatarUrl);
  }
}
