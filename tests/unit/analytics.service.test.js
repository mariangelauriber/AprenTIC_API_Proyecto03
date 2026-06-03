const Nota = require('../../src/models/Nota');

jest.mock('../../src/models/Nota');

describe('analytics.service', () => {
  it('aptosPorCampus ejecuta aggregate', async () => {
    Nota.aggregate = jest.fn().mockResolvedValue([]);
    const { aptosPorCampus } = require('../../src/services/analytics.service');
    const result = await aptosPorCampus();
    expect(Nota.aggregate).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('alumnosEnRiesgo ejecuta aggregate', async () => {
    Nota.aggregate = jest.fn().mockResolvedValue([]);
    const { alumnosEnRiesgo } = require('../../src/services/analytics.service');
    const result = await alumnosEnRiesgo();
    expect(result).toEqual([]);
  });

  it('rankingNoAptos ejecuta aggregate', async () => {
    Nota.aggregate = jest.fn().mockResolvedValue([]);
    const { rankingNoAptos } = require('../../src/services/analytics.service');
    const result = await rankingNoAptos();
    expect(result).toEqual([]);
  });
});
