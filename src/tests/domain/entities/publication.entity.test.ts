import { Publication, PublicationStatus } from '../../../domain/entities/publication.entity';
import { DomainException } from '../../../domain/error/domain.exception';

describe('Publication Entity', () => {
  const validProps = {
    id: 'pub-1',
    userId: 'user-1',
    contentId: 'content-1',
    platform: 'wordpress',
    scheduledAt: new Date(Date.now() + 10000),
    status: 'scheduled' as PublicationStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create with valid props', () => {
    const pub = new Publication(validProps);
    expect(pub.id).toBe(validProps.id);
    expect(pub.userId).toBe(validProps.userId);
    expect(pub.contentId).toBe(validProps.contentId);
    expect(pub.platform).toBe(validProps.platform);
    expect(pub.status).toBe('scheduled');
  });

  it('should throw if userId is empty', () => {
    expect(() => new Publication({ ...validProps, userId: '' })).toThrow(DomainException);
  });
  it('should throw if contentId is empty', () => {
    expect(() => new Publication({ ...validProps, contentId: '' })).toThrow(DomainException);
  });
  it('should throw if platform is empty', () => {
    expect(() => new Publication({ ...validProps, platform: '' })).toThrow(DomainException);
  });
  it('should throw if scheduledAt is missing', () => {
    expect(() => new Publication({ ...validProps, scheduledAt: undefined as any })).toThrow(DomainException);
  });
  it('should throw if status is missing', () => {
    expect(() => new Publication({ ...validProps, status: undefined as any })).toThrow(DomainException);
  });

  it('should update status and updatedAt', async () => {
    const pub = new Publication(validProps);
    const oldUpdatedAt = pub.updatedAt;
    await new Promise(r => setTimeout(r, 2));
    pub.status = 'failed';
    expect(pub.status).toBe('failed');
    expect(pub.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it('should mark as published', async () => {
    const pub = new Publication(validProps);
    const date = new Date();
    pub.markPublished(date);
    expect(pub.status).toBe('published');
    expect(pub.publishedAt).toBe(date);
  });

  it('should mark as failed', () => {
    const pub = new Publication(validProps);
    pub.markFailed();
    expect(pub.status).toBe('failed');
  });
});
