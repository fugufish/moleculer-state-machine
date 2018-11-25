const StateMachine = require("javascript-state-machine");
const delegates = require("delegates");
const lodash = require("lodash");

module.exports = {
    created() {
        this.stateMachine = StateMachine({
            init: this.settings.initialState,
            transitions: this.settings.stateTransitions,
        });
        delegates(this, "stateMachine")
            .method("is")
            .method("can")
            .method("cannot")
            .method("transitions")
            .method("allTransitions")
            .method("allStates")
            .access("state");

        this.stateMachine.observe("onBeforeTransition", ({
            transition, event, from, to,
        }) => {
            this.broker.emit(`${this.name}.onBeforeTransition`, {
                transition, event, from, to,
            });
        });

        this.stateMachine.observe("onAfterTransition", ({
            transition, event, from, to,
        }) => {
            this.broker.emit(`${this.name}.onAfterTransition`, {
                transition, event, from, to,
            });
        });

        this.stateMachine.allStates().forEach((t) => {
            if (this[`onEnter${lodash.capitalize(t)}`]) {
                this[`onEnter${lodash.capitalize(t)}`]({
                    transition, event, from, to,
                });
            }
            this.stateMachine.observe(`onEnter${lodash.capitalize(t)}`, ({
                transition, event, from, to,
            }) => {
                this.broker.emit(`${this.name}.onEnter${lodash.capitalize(t)}`, {
                    transition, event, from, to,
                });
            });

            this.stateMachine.observe(`onLeave${lodash.capitalize(t)}`, ({
                transition, event, from, to,
            }) => {
                if (this[`onLeave${lodash.capitalize(t)}`]) {
                    this[`onLeave${lodash.capitalize(t)}`]({
                        transition, event, from, to,
                    });
                }
                this.broker.emit(`${this.name}.onLeave${lodash.capitalize(t)}`, {
                    transition, event, from, to,
                });
            });
        });

        this.stateMachine.transitions().forEach((t) => {
            delegates(this, "stateMachine")
                .method(t);
            this.stateMachine.observe(`onBefore${lodash.capitalize(t)}`, ({
                transition, event, from, to,
            }) => {
                if (this[`onBefore${lodash.capitalize(t)}`]) {
                    this[`onBefore${lodash.capitalize(t)}`]({
                        transition, event, from, to,
                    });
                }
                this.broker.emit(`${this.name}.onBefore${lodash.capitalize(t)}`, {
                    transition, event, from, to,
                });
            });

            this.stateMachine.observe(`onAfter${lodash.capitalize(t)}`, ({
                transition, event, from, to,
            }) => {
                if (this[`onAfter${lodash.capitalize(t)}`]) {
                    this[`onAfter${lodash.capitalize(t)}`]({
                        transition, event, from, to,
                    });
                }
                this.broker.emit(`${this.name}.onAfter${lodash.capitalize(t)}`, {
                    transition, event, from, to,
                });
            });
        });
    },
};
