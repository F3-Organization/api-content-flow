import { Metric } from '../../../domain/entities/metric.entity';
import { DomainError } from '../../../domain/error/domain.error';

describe('Metric Entity', () => {
  const validProps = {
    id: 'metric-1',
    userId: 'user-1',
    contentId: 'content-1',
    views: 10,
    likes: 2,
    comments: 1,
    shares: 0,
    collectedAt: new Date(),
  };

  it('should create with valid props', () => {
    const metric = new Metric(validProps);
    expect(metric.id).toBe(validProps.id);
    expect(metric.userId).toBe(validProps.userId);
    expect(metric.contentId).toBe(validProps.contentId);
    expect(metric.views).toBe(10);
    expect(metric.likes).toBe(2);
    expect(metric.comments).toBe(1);
    expect(metric.shares).toBe(0);
  });

  it('should throw if userId is empty', () => {
    expect(() => new Metric({ ...validProps, userId: '' })).toThrow(DomainError);
  });
  it('should throw if contentId is empty', () => {
    expect(() => new Metric({ ...validProps, contentId: '' })).toThrow(DomainError);
  });
  it('should throw if views is negative', () => {
    expect(() => new Metric({ ...validProps, views: -1 })).toThrow(DomainError);
  });
  it('should throw if likes is negative', () => {
    expect(() => new Metric({ ...validProps, likes: -1 })).toThrow(DomainError);
  });
  it('should throw if comments is negative', () => {
    expect(() => new Metric({ ...validProps, comments: -1 })).toThrow(DomainError);
  });
  it('should throw if shares is negative', () => {
    expect(() => new Metric({ ...validProps, shares: -1 })).toThrow(DomainError);
  });

  it('should update views, likes, comments, shares', () => {
    const metric = new Metric(validProps);
    metric.views = 20;
    expect(metric.views).toBe(20);
    metric.likes = 5;
    expect(metric.likes).toBe(5);
    metric.comments = 3;
    expect(metric.comments).toBe(3);
    metric.shares = 2;
    expect(metric.shares).toBe(2);
  });

  it('should throw if setting negative values', () => {
    const metric = new Metric(validProps);
    expect(() => (metric.views = -1)).toThrow(DomainError);
    expect(() => (metric.likes = -1)).toThrow(DomainError);
    expect(() => (metric.comments = -1)).toThrow(DomainError);
    expect(() => (metric.shares = -1)).toThrow(DomainError);
  });
});
