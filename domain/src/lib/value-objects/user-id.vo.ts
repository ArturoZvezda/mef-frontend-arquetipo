export class UserId {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }
  }

  static fromString(id: string): UserId {
    return new UserId(id);
  }

  static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}