const utils = require('../../../src/components/utils');

describe('minify', () => {
  it('should return minified documentData by default', async () => {
    const result = utils.__get__('minify')({ fileName: 'testfile.pdf', documentData: '0123456789' });
    expect(result.documentData.length).toBe(5);
  });

  it('should return other fields without changes', async () => {
    const result = utils.__get__('minify')({ fileName: 'testfile.pdf', documentData: '0123456789' });
    expect(result.fileName).toBe('testfile.pdf');
  });

  it('should return minified fields if their names are passed into', async () => {
    const result = utils.__get__('minify')({ fileName: 'testfile.pdf', documentData: '0123456789' }, ['documentData', 'fileName']);
    expect(result.fileName.length).toBe(5);
    expect(result.documentData.length).toBe(5);
  });
});
