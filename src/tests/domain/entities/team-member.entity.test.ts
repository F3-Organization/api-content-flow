import { TeamMember, TeamMemberRole } from '../../../domain/entities/team-member.entity';
import { DomainError } from '../../../domain/error/domain.error';

describe('TeamMember Entity', () => {
  const validProps = {
    id: 'tm-1',
    teamId: 'team-1',
    userId: 'user-1',
    role: 'member' as TeamMemberRole,
    invitedAt: new Date(),
    joinedAt: undefined,
    permissions: ['read', 'write'],
  };

  it('should create with valid props', () => {
    const tm = new TeamMember(validProps);
    expect(tm.id).toBe(validProps.id);
    expect(tm.teamId).toBe(validProps.teamId);
    expect(tm.userId).toBe(validProps.userId);
    expect(tm.role).toBe('member');
    expect(tm.invitedAt).toBeInstanceOf(Date);
    expect(tm.joinedAt).toBeUndefined();
    expect(tm.permissions).toEqual(['read', 'write']);
  });

  it('should throw if teamId is empty', () => {
    expect(() => new TeamMember({ ...validProps, teamId: '' })).toThrow(DomainError);
  });
  it('should throw if userId is empty', () => {
    expect(() => new TeamMember({ ...validProps, userId: '' })).toThrow(DomainError);
  });
  it('should throw if role is empty', () => {
    expect(() => new TeamMember({ ...validProps, role: '' as any })).toThrow(DomainError);
  });

  it('should update role', () => {
    const tm = new TeamMember(validProps);
    tm.role = 'admin';
    expect(tm.role).toBe('admin');
  });

  it('should update joinedAt', () => {
    const tm = new TeamMember(validProps);
    const now = new Date();
    tm.joinedAt = now;
    expect(tm.joinedAt).toBe(now);
  });

  it('should update permissions', () => {
    const tm = new TeamMember(validProps);
    tm.permissions = ['read'];
    expect(tm.permissions).toEqual(['read']);
  });
});
