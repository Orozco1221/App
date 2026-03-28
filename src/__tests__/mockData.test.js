import { initialContent } from '../data/mockData';

describe('mockData — initialContent', () => {

  it('tiene todas las secciones de la app', () => {
    ['cafeteria','pills','structural','externalCerts',
     'forumThreads','activeChallenge','pastChallenges','ranking'
    ].forEach(k => expect(initialContent).toHaveProperty(k));
  });

  it('cada sección de Academy es un array con id, title y description', () => {
    ['cafeteria','pills','structural','externalCerts'].forEach(s => {
      expect(Array.isArray(initialContent[s])).toBe(true);
      initialContent[s].forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
      });
    });
  });

  it('los IDs de todos los cursos son únicos', () => {
    const ids = ['cafeteria','pills','structural','externalCerts']
      .flatMap(s => initialContent[s].map(i => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada hilo del foro tiene likedBy como array vacío al inicio', () => {
    initialContent.forumThreads.forEach(t => {
      expect(Array.isArray(t.likedBy)).toBe(true);
      expect(t.likedBy).toHaveLength(0);
    });
  });

  it('activeChallenge tiene rewardPoints positivo', () => {
    expect(initialContent.activeChallenge.rewardPoints).toBeGreaterThan(0);
  });

  it('cada usuario del ranking tiene points numérico >= 0', () => {
    initialContent.ranking.forEach(u => {
      expect(typeof u.points).toBe('number');
      expect(u.points).toBeGreaterThanOrEqual(0);
    });
  });
});
