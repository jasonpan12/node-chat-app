const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var str = {
      room: 1234,
      name: 1234
    };
    expect(isRealString(str.room)).toBe(false);
    expect(isRealString(str.name)).toBe(false);

  });

  it('should reject string w/ only spaces', () => {
    var str = {
      room: '  ',
      name: '  '
    };
    expect(isRealString(str.room)).toBe(false);
    expect(isRealString(str.name)).toBe(false);
  });

  it('should allow string w/ non space characters', () => {
    var str = {
      room: 'woop woop',
      name: 'hi hi'
    };
    expect(isRealString(str.room)).toBe(true);
    expect(isRealString(str.name)).toBe(true);
  });
});

//isRealString
// should reject non-string values (e.g. integer)
// should reject string w/ only spaces
// should allow strings w/ non space characters
