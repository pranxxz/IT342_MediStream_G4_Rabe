/**
 * searchLogic.test.js
 * FR-09 / FR-18 — SearchFilterBar filter logic 
 * TC-37: Filter logic reduces list
 * TC-38: Empty query returns all items
 * TC-18: Search filter — case-insensitive match
 */

// Import your actual function from your source code
// import { filterItems } from './searchLogic'; 

// (Temporary inline function if you haven't exported it yet)
function filterItems(items, query, key = 'name') {
  if (!query || query.trim() === '') return items;
  const q = query.toLowerCase();
  return items.filter((item) =>
    String(item[key] ?? '').toLowerCase().includes(q)
  );
}

const SAMPLE_PATIENTS = [
  { id: 1, name: 'Juan dela Cruz' },
  { id: 2, name: 'Maria Santos' },
  { id: 3, name: 'Pedro Reyes' },
  { id: 4, name: 'Ana Maria Lopez' },
];

describe('FR-09 / FR-18 | Search Filter Logic', () => {
  test('TC-38 — empty query returns all items', () => {
    expect(filterItems(SAMPLE_PATIENTS, '')).toHaveLength(4);
  });

  test('TC-38 — whitespace-only query returns all items', () => {
    expect(filterItems(SAMPLE_PATIENTS, '   ')).toHaveLength(4);
  });

  test('TC-37 — exact name match returns one result', () => {
    const result = filterItems(SAMPLE_PATIENTS, 'Maria Santos');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  test('TC-18 — filter is case-insensitive', () => {
    const result = filterItems(SAMPLE_PATIENTS, 'JUAN');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Juan dela Cruz');
  });

  test('TC-18 — partial match returns multiple results', () => {
    // 'maria' matches both 'Maria Santos' and 'Ana Maria Lopez'
    const result = filterItems(SAMPLE_PATIENTS, 'maria');
    expect(result).toHaveLength(2);
  });

  test('TC-18 — query with no match returns empty array', () => {
    const result = filterItems(SAMPLE_PATIENTS, 'zzznomatch');
    expect(result).toHaveLength(0);
  });

  test('TC-37 — filter works on consultation list (different key)', () => {
    const consultations = [
      { id: 1, notes: 'Follow-up checkup' },
      { id: 2, notes: 'Initial assessment' },
      { id: 3, notes: 'Post-op follow-up' },
    ];
    const result = filterItems(consultations, 'follow', 'notes');
    expect(result).toHaveLength(2);
  });

  test('handles items with missing key gracefully', () => {
    const items = [{ id: 1 }, { id: 2, name: 'Juan' }];
    const result = filterItems(items, 'juan');
    expect(result).toHaveLength(1);
  });
});