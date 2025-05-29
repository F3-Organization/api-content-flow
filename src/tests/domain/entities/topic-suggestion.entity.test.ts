import { TopicSuggestion } from '../../../domain/entities/topic-suggestion.entity';
import { DomainException } from '../../../domain/error/domain.exception';

describe('TopicSuggestion Entity', () => {
  const validProps = {
    id: 'topic-1',
    userId: 'user-1',
    topic: 'Tendências de Marketing',
    source: 'trends',
    createdAt: new Date(),
  };

  it('should create a topic suggestion with valid props', () => {
    const suggestion = new TopicSuggestion(validProps);
    expect(suggestion.id).toBe(validProps.id);
    expect(suggestion.userId).toBe(validProps.userId);
    expect(suggestion.topic).toBe(validProps.topic);
    expect(suggestion.source).toBe(validProps.source);
    expect(suggestion.createdAt).toBeInstanceOf(Date);
  });

  it('should throw if userId is empty', () => {
    expect(() => new TopicSuggestion({ ...validProps, userId: '' })).toThrow(DomainException);
  });
  it('should throw if topic is empty', () => {
    expect(() => new TopicSuggestion({ ...validProps, topic: '' })).toThrow(DomainException);
  });
  it('should throw if source is empty', () => {
    expect(() => new TopicSuggestion({ ...validProps, source: '' })).toThrow(DomainException);
  });
});
