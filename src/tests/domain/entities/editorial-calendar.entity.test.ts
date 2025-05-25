import { EditorialCalendar, month } from '@/domain/entities/editorial-calendar.entity';
import { DomainError } from '@/domain/error/domain.error';

describe('EditorialCalendar Entity', () => {
  const validProps = {
    id: 'cal-1',
    userId: 'user-1',
    month: 5 as month,
    year: 2025,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create with valid props', () => {
    const cal = new EditorialCalendar(validProps);
    expect(cal.id).toBe(validProps.id);
    expect(cal.userId).toBe(validProps.userId);
    expect(cal.month).toBe(5);
    expect(cal.year).toBe(2025);
  });

  it('should throw if userId is empty', () => {
    expect(() => new EditorialCalendar({ ...validProps, userId: '' })).toThrow(DomainError);
  });
  it('should throw if month is invalid', () => {
    expect(() => new EditorialCalendar({ ...validProps, month: 0 as month})).toThrow(DomainError);
    expect(() => new EditorialCalendar({ ...validProps, month: 13 as month})).toThrow(DomainError);
  });
  it('should throw if year is invalid', () => {
    expect(() => new EditorialCalendar({ ...validProps, year: 1999 })).toThrow(DomainError);
  });

  it('should update month and updatedAt', async () => {
    const cal = new EditorialCalendar(validProps);
    const oldUpdatedAt = cal.updatedAt;
    await new Promise(r => setTimeout(r, 2));
    cal.month = 6;
    expect(cal.month).toBe(6);
    expect(cal.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it('should update year and updatedAt', async () => {
    const cal = new EditorialCalendar(validProps);
    const oldUpdatedAt = cal.updatedAt;
    await new Promise(r => setTimeout(r, 2));
    cal.year = 2026;
    expect(cal.year).toBe(2026);
    expect(cal.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });
});
