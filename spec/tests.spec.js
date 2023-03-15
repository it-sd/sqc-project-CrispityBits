const { addTwoNumbers } = require('../server.js');

describe("addTwoNumbers function", function() {
  it("should add two numbers correctly", function() {
    expect(addTwoNumbers(2, 3)).toEqual(5);
    expect(addTwoNumbers(-2, 3)).toEqual(1);
    expect(addTwoNumbers(0, 0)).toEqual(0);
  });
});