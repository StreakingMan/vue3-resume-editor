import { uniqueString } from './uniqueString';

test('uniqueString', () => {
    const us1 = uniqueString();
    const us2 = uniqueString();
    expect(us1.length).toBe(4);
    expect(us1 === us2).toBe(false);
});
