import { Notification, NotificationType } from '../../../domain/entities/notification.entity';
import { DomainException } from '../../../domain/error/domain.exception';

describe('Notification Entity', () => {
  const validProps = {
    id: 'notif-1',
    userId: 'user-1',
    type: 'reminder' as NotificationType,
    message: 'Sua publicação será agendada em breve!',
    sentAt: new Date(),
    read: false,
  };

  it('should create with valid props', () => {
    const notif = new Notification(validProps);
    expect(notif.id).toBe(validProps.id);
    expect(notif.userId).toBe(validProps.userId);
    expect(notif.type).toBe('reminder');
    expect(notif.message).toBe(validProps.message);
    expect(notif.sentAt).toBeInstanceOf(Date);
    expect(notif.read).toBe(false);
  });

  it('should throw if userId is empty', () => {
    expect(() => new Notification({ ...validProps, userId: '' })).toThrow(DomainException);
  });
  it('should throw if type is empty', () => {
    expect(() => new Notification({ ...validProps, type: '' as any })).toThrow(DomainException);
  });
  it('should throw if message is empty', () => {
    expect(() => new Notification({ ...validProps, message: '' })).toThrow(DomainException);
  });
  it('should throw if sentAt is missing', () => {
    expect(() => new Notification({ ...validProps, sentAt: undefined as any })).toThrow(DomainException);
  });

  it('should mark as read', () => {
    const notif = new Notification(validProps);
    notif.markRead();
    expect(notif.read).toBe(true);
  });
});
