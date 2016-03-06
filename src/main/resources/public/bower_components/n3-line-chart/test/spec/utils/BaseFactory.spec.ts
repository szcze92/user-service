/// <reference path='../test.spec.ts' />

class ChildFactoryStub extends n3Charts.Utils.BaseFactory {

  public internalState: string = undefined;

  create() {
    this.internalState = 'created stub';
  }

  update() {
    this.internalState = 'updated stub';
  }

  destroy() {
    this.internalState = 'destroyed stub';
  }
}

describe('n3Charts.Utils.BaseFactory', () => {
  var childFactoryStub: ChildFactoryStub = undefined;
  var factoryMgr: n3Charts.Utils.FactoryManager = new n3Charts.Utils.FactoryManager();
  var eventMgr: n3Charts.Utils.EventManager = new n3Charts.Utils.EventManager();

  beforeEach(() => {

    childFactoryStub = new ChildFactoryStub();
    eventMgr.init(n3Charts.Utils.EventManager.EVENTS);
  });

  describe('init()', () => {

    it('should parse arguments', () => {

      expect(() => childFactoryStub.init('test', eventMgr, factoryMgr)).to.not.throwError();
    });
  });

  describe('create(), update(), and destroy()', () => {

    it('should trigger all factory methods', () => {

      var externalState: string = undefined;

      eventMgr.on('create', () => externalState = 'created');
      eventMgr.on('update', () => externalState = 'updated');
      eventMgr.on('destroy', () => externalState = 'destroyed');

      childFactoryStub.init('test', eventMgr, factoryMgr);

      expect(externalState).to.equal(undefined);

      eventMgr.trigger('create');

      expect(externalState).to.equal('created');
      expect(childFactoryStub.internalState).to.equal('created stub');

      eventMgr.trigger('update');

      expect(externalState).to.equal('updated');
      expect(childFactoryStub.internalState).to.equal('updated stub');

      eventMgr.trigger('destroy');

      expect(externalState).to.equal('destroyed');
      expect(childFactoryStub.internalState).to.equal('destroyed stub');
    });
  });
});
