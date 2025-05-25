import { Team } from '../../../domain/entities/team.entity';
import { DomainError } from '../../../domain/error/domain.error';

describe('Team Entity', () => {
  const validProps = {
    id: 'team-1',
    ownerId: 'user-1',
    name: 'Equipe Marketing',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create with valid props', () => {
    const team = new Team(validProps);
    expect(team.id).toBe(validProps.id);
    expect(team.ownerId).toBe(validProps.ownerId);
    expect(team.name).toBe(validProps.name);
  });

  it('should throw if ownerId is empty', () => {
    expect(() => new Team({ ...validProps, ownerId: '' })).toThrow(DomainError);
  });
  it('should throw if name is empty', () => {
    expect(() => new Team({ ...validProps, name: '' })).toThrow(DomainError);
  });

  it('should update name and updatedAt', async () => {
    const team = new Team(validProps);
    const oldUpdatedAt = team.updatedAt;
    await new Promise(r => setTimeout(r, 2));
    team.name = 'Equipe Vendas';
    expect(team.name).toBe('Equipe Vendas');
    expect(team.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });
});
