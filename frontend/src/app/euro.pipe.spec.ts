import { EuroPipe } from './shared/pipes/euro.pipe';

describe('EuroPipe', () => {
  it('create an instance', () => {
    const pipe = new EuroPipe();
    expect(pipe).toBeTruthy();
  });
});
