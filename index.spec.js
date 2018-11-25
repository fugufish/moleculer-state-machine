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
});
