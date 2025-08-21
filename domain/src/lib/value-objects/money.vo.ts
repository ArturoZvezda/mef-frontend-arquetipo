export class Money {
  private static readonly SUPPORTED_CURRENCIES = ['USD', 'EUR', 'PEN', 'COP'];

  private constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    
    if (!Money.SUPPORTED_CURRENCIES.includes(currency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
  }

  static create(amount: number, currency: string): Money {
    return new Money(amount, currency.toUpperCase());
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Factor cannot be negative');
    }
    return new Money(this.amount * factor, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }

  toFormattedString(): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }
}