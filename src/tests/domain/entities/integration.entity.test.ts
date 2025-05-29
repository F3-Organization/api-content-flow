import { Integration, IntegrationType } from '../../../domain/entities/integration.entity';
import { DomainException } from '../../../domain/error/domain.exception';

describe('Integration Entity', () => {
  const validProps = {
    id: 'int-1',
    userId: 'user-1',
    type: 'wordpress' as IntegrationType,
    accessToken: 'token',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create with valid props', () => {
    const int = new Integration(validProps);
    expect(int.id).toBe(validProps.id);
    expect(int.userId).toBe(validProps.userId);
    expect(int.type).toBe('wordpress');
    expect(int.accessToken).toBe('token');
    expect(int.isActive).toBe(true);
  });

  it('should throw if userId is empty', () => {
    expect(() => new Integration({ ...validProps, userId: '' })).toThrow(DomainException);
  });
  it('should throw if type is empty', () => {
    expect(() => new Integration({ ...validProps, type: '' as any })).toThrow(DomainException);
  });
  it('should throw if accessToken is empty', () => {
    expect(() => new Integration({ ...validProps, accessToken: '' })).toThrow(DomainException);
  });

  it('should update accessToken and updatedAt', async () => {
    const int = new Integration(validProps);
    const oldUpdatedAt = int.updatedAt;
    await new Promise(r => setTimeout(r, 2));
    int.accessToken = 'newtoken';
    expect(int.accessToken).toBe('newtoken');
    expect(int.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it('should activate and deactivate', () => {
    const int = new Integration(validProps);
    int.deactivate();
    expect(int.isActive).toBe(false);
    int.activate();
    expect(int.isActive).toBe(true);
  });
});
