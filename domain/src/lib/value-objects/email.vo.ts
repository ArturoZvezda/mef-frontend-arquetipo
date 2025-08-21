export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid email format: ${value}`);
    }
  }

  static fromString(email: string): Email {
    return new Email(email.toLowerCase().trim());
  }

  getValue(): string {
    return this.value;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    return Email.EMAIL_REGEX.test(email);
  }
}