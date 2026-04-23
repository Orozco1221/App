import {
  CURRENT_USER_ID, GEMINI_MODEL_NAME, GEMINI_MAX_RETRIES,
  ACADEMY_CATEGORIES, RANKING_TIERS, FORUM_CATEGORIES, DEFAULT_ITEM_POINTS,
} from '../constants';

describe('constants.js', () => {

  it('CURRENT_USER_ID es un string no vacío', () => {
    expect(typeof CURRENT_USER_ID).toBe('string');
    expect(CURRENT_USER_ID.length).toBeGreaterThan(0);
  });

  it('GEMINI_MODEL_NAME contiene "gemini"', () => {
    expect(GEMINI_MODEL_NAME.toLowerCase()).toContain('gemini');
  });

  it('GEMINI_MAX_RETRIES es un número positivo', () => {
    expect(typeof GEMINI_MAX_RETRIES).toBe('number');
    expect(GEMINI_MAX_RETRIES).toBeGreaterThan(0);
  });

  it('ACADEMY_CATEGORIES tiene 4 categorías con las propiedades obligatorias', () => {
    expect(ACADEMY_CATEGORIES).toHaveLength(4);
    ACADEMY_CATEGORIES.forEach((cat: { key: string; label: string; color: string }) => {
      expect(cat).toHaveProperty('key');
      expect(cat).toHaveProperty('label');
      expect(cat).toHaveProperty('color');
    });
  });

  it('RANKING_TIERS está ordenado de menor a mayor puntuación', () => {
    for (let i = 1; i < RANKING_TIERS.length; i++) {
      expect(RANKING_TIERS[i].minPoints).toBeGreaterThan(RANKING_TIERS[i - 1].minPoints);
    }
  });

  it('el primer tier empieza en 0 puntos', () => {
    expect(RANKING_TIERS[0].minPoints).toBe(0);
  });

  it('FORUM_CATEGORIES es un array de strings no vacío', () => {
    expect(Array.isArray(FORUM_CATEGORIES)).toBe(true);
    expect(FORUM_CATEGORIES.length).toBeGreaterThan(0);
  });

  it('DEFAULT_ITEM_POINTS es un número positivo', () => {
    expect(DEFAULT_ITEM_POINTS).toBeGreaterThan(0);
  });
});
