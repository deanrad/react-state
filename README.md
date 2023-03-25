# React/RxFx Counter

## Specification
```yaml
Describe: State Container
  State:
    Initially: 0
  Actions:
    Increment:
      Effective: Immediately
      Makes State: +1
    Decrement:
      Effective: Immediately
      Makes State: -1
    Bump(n):
      Effective: Immediately
      Makes State: Greater by the number passed
    Reset:
      Effective: After a Delay
      Makes State: 0

Describe UI:
  When State is Even:
    Increment If Odd: Is Disabled
  When State Container Is Busy:
    Buttons: Are Disabled
```

Review of CountStateWithNestedCase:

While the reducer is pure, `useCountState` is not single-responsiblity - it implements the async, calling the reducer, and setting of React state. Also, if the state container knew when it was processing the async behvaior (via `isActive` in my example), it wouldn't need to track it in the reducer.

Changes I suggest (though there's room for disagreement in any of them ;) 

- The dispatcher of Action `resetAsync` need not know it's async - can call it `reset`.
- `incrementIfOdd` shouldn't be a separate action- it can be conditionally called / made available.
- Tracking available isn't redundant to when the slowAsyncFunction is executing - see `isActive` in the RxFx service.

## Strategy with RxFx

- Write a reducer that tracks a single `number` state field, changing state on requests for most actions, except `reset`,  which it changes on the `next` event when the slowAsyncFunction produces a value.
- Write an effect returning function that returns a delay only for the `reset` action
- Put them in a 'blocking' service, so that while processing the reset async effect, it wouldn't being any other processing.