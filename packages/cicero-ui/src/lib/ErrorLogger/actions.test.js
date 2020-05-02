import * as ACT from './actions';

describe('Actions', () => {
  describe('gtZero', () => {
    it('should return true, if value is bigger than zero', () => {
      const result = ACT.gtZero(1);
      expect(result).toEqual(true);
    });
    it('should return false, when value is lower than zero', () => {
      const result = ACT.gtZero(-1);
      expect(result).toEqual(false);
    });
    it('should return false, when value is equal to zero', () => {
      const result = ACT.gtZero(0);
      expect(result).toEqual(false);
    });
  });

  describe('typeSwitchCase', () => {
    it('should return "Model" string, when input contains "modelError" property', () => {
      const input = {
        modelError: 'mockedModelError'
      };
      const result = ACT.typeSwitchCase(input);
      expect(result).toEqual('Model');
    });
    it('should return "Grammar" string, when input contains "parseError" property', () => {
      const input = {
        parseError: 'mockedParseError'
      };
      const result = ACT.typeSwitchCase(input);
      expect(result).toEqual('Grammar');
    });
    it('should return "Unknown" string, when unknown error', () => {
      const input = {};
      const result = ACT.typeSwitchCase(input);
      expect(result).toEqual('Unknown');
    });
  });

  describe('keySwitchCase', () => {
    it('should return "clauseTemplateId" value, when input contains "modelError" property', () => {
      const input = {
        modelError: 'mockedModelError',
        clauseTemplateId: '12345'
      };
      const result = ACT.keySwitchCase(input);
      expect(result).toEqual('12345');
    });
    it('should return "clauseId" value, when input contains "parseError" property', () => {
      const input = {
        parseError: 'mockedParseError',
        clauseId: '12345'
      };
      const result = ACT.keySwitchCase(input);
      expect(result).toEqual('12345');
    });
    it('should return null, when unknown error', () => {
      const input = {};
      const result = ACT.keySwitchCase(input);
      expect(result).toEqual(null);
    });
  });

  describe('overalltypeSwitchCase', () => {
    it('should return "modelError" value, when input contains "modelError" property', () => {
      const input = {
        modelError: 'mockedModelError'
      };
      const result = ACT.overalltypeSwitchCase(input);
      expect(result).toEqual('mockedModelError');
    });
    it('should return "parseError" value, when input contains "parseError" property', () => {
      const input = {
        parseError: 'mockedParseError'
      };
      const result = ACT.overalltypeSwitchCase(input);
      expect(result).toEqual('mockedParseError');
    });
    it('should return null, when unknown error', () => {
      const input = {};
      const result = ACT.overalltypeSwitchCase(input);
      expect(result).toEqual(null);
    });
  });

  describe('truncateMessage', () => {
    it("should return full message, when it's shorter than 200 characters", () => {
      const mockedMessage = 'mockedMessage';
      const result = ACT.truncateMessage(mockedMessage);
      expect(result).toEqual('mockedMessage');
    });
    it("should return truncate message when it's longer than 200 characters", () => {
      const mockedLongMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequa';
      const result = ACT.truncateMessage(mockedLongMessage);
      expect(result).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut a...');
    });
  });

  describe('helpers for error functions', () => {
    const mockedError = {
      id1: {}
    };
    const mockedErrors = {
      id1: {},
      id2: {}
    };
    const emptyError = {};

    describe('errorExists', () => {
      it('should return true, when error object is not empty', () => {
        const result = ACT.errorsExist(mockedError);
        expect(result).toEqual(true);
      });
      it('should return false, when error object is empty', () => {
        const result = ACT.errorsExist(emptyError);
        expect(result).toEqual(false);
      });
    });

    describe('errorArrayLength', () => {
      it('should return number of errors in object', () => {
        const result = ACT.errorArrayLength(mockedErrors);
        expect(result).toEqual(2);
      });
      it('should return "No", when object is empty', () => {
        const result = ACT.errorArrayLength(emptyError);
        expect(result).toEqual('No');
      });
    });

    describe('isMultipleErrors', () => {
      it('should return "Error", when only one error in object', () => {
        const result = ACT.isMultipleErrors(mockedError);
        expect(result).toEqual('Error');
      });
      it('should return "Errors", when more than one error in object', () => {
        const result = ACT.isMultipleErrors(mockedErrors);
        expect(result).toEqual('Errors');
      });
    });
  });
});
