const { ServiceBroker } = require("moleculer");

const StateMachine = require("./");

const broker = new ServiceBroker({
  logger: false,
  transporter: "fake",
});

const TestService = {
  name: "test",
  mixins: [StateMachine],
  settings: {
    initialState: "new",
    stateTransitions: [{ name: "next", from: "new", to: "nexted" }],
  },
  methods: {
    onBeforeTransition() {
      return true;
    },
    onAfterTransition() {
      return true;
    },
    onEnterState() {
      return true;
    },
    onLeaveState() {
      return true;
    },
    onBeforeNext() {
      return true;
    },
    onAfterNext() {
      return true;
    },
    onEnterNexted() {
      return true;
    },
    onLeaveNew() {
      return true;
    },
  },
};

describe("StateMachine", () => {
  let service;

  beforeEach(() => {
    service = broker.createService(TestService);
  });

  afterEach(() => {
    broker.destroyService(service);
  });

  it("adds the stateMachine property", () => {
    expect(service.stateMachine).toBeDefined();
  });

  it("allows access to the state", () => {
    expect(service.state).toEqual(service.stateMachine.state);
  });

  describe("methods", () => {
    it("delegates 'is'", () => {
      expect(service.is("new")).toEqual(service.stateMachine.is("new"));
    });

    it("delegates 'can'", () => {
      expect(service.can("next")).toEqual(service.stateMachine.can("next"));
    });

    it("delegates 'cannot'", () => {
      expect(service.cannot("next")).toEqual(service.stateMachine.cannot("next"));
    });

    it("delegates 'transitions'", () => {
      expect(service.transitions()).toEqual(
        expect.objectContaining(service.stateMachine.transitions())
      );
    });

    it("delegates 'allTransitions'", () => {
      expect(service.allTransitions()).toEqual(
        expect.objectContaining(service.stateMachine.allTransitions())
      );
    });

    it("delegates 'allStates'", () => {
      expect(service.allStates()).toEqual(
        expect.objectContaining(service.stateMachine.allStates())
      );
    });

    it("delegates 'next'", () => {
      const spy = jest.spyOn(service.stateMachine, "next");
      service.next();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("events", () => {
    let spy;

    beforeEach(() => {
      spy = jest.spyOn(broker, "emit");
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it("emits 'test.onBeforeTransition'", () => {
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith("test.onBeforeTransition", {
        event: "onBeforeTransition",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });

    it("emits 'test.onAfterTransition'", () => {
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith("test.onAfterTransition", {
        event: "onAfterTransition",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });

    it("emits 'test.onEnterState'", () => {
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith("test.onEnterState", {
        event: "onEnterState",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });

    it("emits 'test.onLeaveState'", () => {
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith("test.onLeaveState", {
        event: "onLeaveState",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });

    it("emits 'test.onLeaveNew'", () => {
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith("test.onLeaveNew", {
        event: "onLeaveNew",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });

    it("emits 'test.onEnterNexted'", () => {
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith("test.onEnterNexted", {
        event: "onEnterNexted",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });
  });

  describe("callbacks", () => {
    it("calls 'onBeforeTransition'", () => {
      const spy = jest.spyOn(service, "onBeforeTransition");
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith({
        event: "onBeforeTransition",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });

    it("calls 'onAfterTransition'", () => {
      const spy = jest.spyOn(service, "onAfterTransition");
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith({
        event: "onAfterTransition",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });

    it("calls 'onEnterState'", () => {
      const spy = jest.spyOn(service, "onEnterState");
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith({
        event: "onEnterState",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });

    it("calls 'onLeaveState'", () => {
      const spy = jest.spyOn(service, "onLeaveState");
      service.stateMachine.next();
      expect(spy).toHaveBeenCalledWith({
        event: "onLeaveState",
        transition: "next",
        from: "new",
        to: "nexted",
      });
    });
  });
});
