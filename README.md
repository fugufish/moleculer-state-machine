![Moleculer logo](https://raw.githubusercontent.com/ice-services/moleculer/HEAD/docs/assets/logo.png)
# Moleculer State Machine

[![Tests](https://github.com/fugufish/moleculer-state-machine/actions/workflows/node.js.yml/badge.svg)](https://github.com/fugufish/moleculer-state-machine/actions/workflows/node.js.yml)

Moleculer State Machine is an add on for the [Moleculer](https://moleculer.services/)
microservices framework that allows services to be extended with 
[finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) behavior.
It does so by acting as a high level wrapper for 
[javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine).

## Basic Usage
Moleculer State Machine will look in the service `settings` for the state machine
options:

```javascript
const StateMachine = require("moleculer-state-machine");

{
    name: "service-with-state-machine",
    mixins: [
        StateMachine
    ],
    settings: {
        initialState: "new",
        stateTransitions: [
            {name: "age", from: "new", to: "old"}
        ]
    }
}
```
 In this example calling `age()` on the service will trigger a transition from `"new"`
 to `"old"`.
 
 ## Delegations
 The mixin delegates the methods `is`, `can`, `cannot`, `transitions`, 
 `allTransitions`, `allStates`, and the `state` property to an internal instance of
 `javascript-state-machine` that is created on service creation.

 ## Events
The mixin emits all `javascript-stage-machine` events as service events prefixed by 
the service name. The `onBeforeTransition` event for example will emit on the broker
`test.onBeforeTransition`. The event payload will be as follows:
```javascript
{
    event: ..., // the name fo the event
    transition: ..., // the name of the transition function
    from: ... // the state being transitioned from
    to: ... // the state being transitioned to
}
```

See [javascript-state-machine lifecylce events](https://github.com/jakesgordon/javascript-state-machine/blob/master/docs/lifecycle-events.md)
for more details.

## Callbacks
Methods can be defined on the service that will be called when a specific state
machine event occurs. These callbacks are called with the same arguments as 
as events.

See [javascript-state-machine lifecylce events](https://github.com/jakesgordon/javascript-state-machine/blob/master/docs/lifecycle-events.md)
for more details.



## License
Moleculer State Machine is available under the MIT license](https://tldrlegal.com/license/mit-license).

