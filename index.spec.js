/* eslint-disable no-unused-expressions */
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { ServiceBroker } = require("moleculer");

const expect = chai.expect;

chai.use(sinonChai);

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
        stateTransitions: [
            { name: "next", from: "new", to: "nexted" },
        ],
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
        expect(service.stateMachine).to.not.be.undefined;
    });

    it("allows access to the state", () => {
        expect(service.state).to.eq(service.stateMachine.state);
    });

    describe("methods", () => {
        it("delegates 'is'", () => {
            expect(service.is("new")).to.eq(service.stateMachine.is("new"));
        });

        it("delegates 'can'", () => {
            expect(service.can("next")).to.eq(service.stateMachine.can("next"));
        });

        it("delegates 'cannot'", () => {
            expect(service.cannot("next")).to.eq(service.stateMachine.cannot("next"));
        });

        it("delegates 'transitions'", () => {
            expect(service.transitions()).to.deep.eq(service.stateMachine.transitions());
        });

        it("delegates 'allTransitions'", () => {
            expect(service.allTransitions()).to.deep.eq(service.stateMachine.allTransitions());
        });

        it("delegates 'allStates'", () => {
            expect(service.allStates()).to.deep.eq(service.stateMachine.allStates());
        });

        it("delegates 'next'", () => {
            const spy = sinon.spy(service.stateMachine, "next");
            service.next();
            expect(spy).to.have.been.called;
        });
    });

    describe("events", () => {
        let emitStub;

        beforeEach(() => {
            emitStub = sinon.stub(broker, "emit");
        });

        afterEach(() => {
            emitStub.restore();
        });

        it("emits 'test.onBeforeTransition'", () => {
            service.stateMachine.next();
            expect(emitStub).to.have.been.calledWith(sinon.match("test.onBeforeTransition", {
                event: "onBeforeTransition", transition: "next", from: "new", to: "nexted",
            }));
        });

        it("emits 'test.onAfterTransition'", () => {
            service.stateMachine.next();
            expect(emitStub).to.have.been.calledWith(sinon.match("test.onAfterTransition", {
                event: "onAfterTransition", transition: "next", from: "new", to: "nexted",
            }));
        });

        it("emits 'test.onEnterState'", () => {
            service.stateMachine.next();
            expect(emitStub).to.have.been.calledWith(sinon.match("test.onEnterState", {
                event: "onEnterState", transition: "next", from: "new", to: "nexted",
            }));
        });

        it("emits 'test.onLeaveState'", () => {
            service.stateMachine.next();
            expect(emitStub).to.have.been.calledWith(sinon.match("test.onLeaveState", {
                event: "onLeaveState", transition: "next", from: "new", to: "nexted",
            }));
        });

        it("emits 'test.onLeaveNew'", () => {
            service.stateMachine.next();
            expect(emitStub).to.have.been.calledWith(sinon.match("test.onLeaveNew", {
                event: "onLeaveNew", transition: "next", from: "new", to: "nexted",
            }));
        });

        it("emits 'test.onEnterNexted'", () => {
            service.stateMachine.next();
            expect(emitStub).to.have.been.calledWith(sinon.match("test.onLeaveNew", {
                event: "onEnterNexted", transition: "next", from: "new", to: "nexted",
            }));
        });
    });

    describe("callbacks", () => {
        it("calls 'onBeforeTransition'", () => {
            const spy = sinon.spy(service, "onBeforeTransition");
            service.stateMachine.next();
            expect(spy).to.have.been.calledWith(sinon.match({
                event: "onBeforeTransition", transition: "next", from: "new", to: "nexted",
            }));
        });

        it("calls 'onAfterTransition'", () => {
            const spy = sinon.spy(service, "onAfterTransition");
            service.stateMachine.next();
            expect(spy).to.have.been.calledWith(sinon.match({
                event: "onAfterTransition", transition: "next", from: "new", to: "nexted",
            }));
        });

        it("calls 'onEnterState'", () => {
            const spy = sinon.spy(service, "onEnterState");
            service.stateMachine.next();
            expect(spy).to.have.been.calledWith(sinon.match({
                event: "onEnterState", transition: "next", from: "new", to: "nexted",
            }));
        });

        it("calls 'onLeaveState'", () => {
            const spy = sinon.spy(service, "onLeaveState");
            service.stateMachine.next();
            expect(spy).to.have.been.calledWith(sinon.match({
                event: "onLeaveState", transition: "next", from: "new", to: "nexted",
            }));
        });
    });
});
