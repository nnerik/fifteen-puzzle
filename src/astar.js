// Check if prioity queue is empty
const isEmpty = pqueue => Object.entries(pqueue).length === 0;

// Push a new value onto the priority queue
const push = (pqueue, value, priority) => {
  if (isEmpty(pqueue) || priority < pqueue.first.priority) {
    return { first: { value: value, priority: priority }, rest: pqueue };
  } else {
    return { first: pqueue.first, rest: push(value, priorty, pqueue.rest) };
  }
};

const peek = pqueue => pqueue.first.value;

const pop = pqueue => pqueue.rest;
