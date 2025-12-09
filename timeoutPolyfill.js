// Simple setTimeout / clearTimeout polyfill factory
(function (global) {
  if (!global) return;

  function createTimerSystem() {
    let nextId = 1;
    const timers = new Map(); // id -> {fn, time, args}
    let scheduleTick;

    // Choose best available async tick
    if (typeof MessageChannel !== 'undefined') {
      const channel = new MessageChannel();
      channel.port1.onmessage = () => scheduleTick();
      scheduleTick = () => channel.port2.postMessage(0);
    } else if (typeof window !== 'undefined' && typeof window.postMessage === 'function') {
      // fallback to postMessage
      const MSG_NAME = '___MY_SET_TIMEOUT_POST_MESSAGE_' + Math.random();
      window.addEventListener('message', (e) => {
        if (e.source === window && e.data === MSG_NAME) scheduleTick();
      });
      scheduleTick = () => window.postMessage(MSG_NAME, '*');
    } else if (typeof requestAnimationFrame === 'function') {
      scheduleTick = () => requestAnimationFrame(() => scheduleTick());
      // note: requestAnimationFrame continuously schedules — we'll gate execution below
    } else if (typeof setImmediate === 'function') {
      scheduleTick = () => setImmediate(scheduleTick);
    } else {
      // last resort: coarse fallback using setTimeout if available
      scheduleTick = () => (global.setTimeout || function (f) { f(); })(scheduleTick, 0);
    }

    // We'll use a single "pulse" runner that executes due timers.
    // Maintain a flag so we only schedule a tick when needed.
    let tickScheduled = false;

    function ensureTick() {
      if (!tickScheduled) {
        tickScheduled = true;
        // scheduleTick will post a microtask-like thing which will call runner
        // We attach runner directly for the postMessage/MessageChannel paths.
        // For rAF fallback, scheduleTick will call scheduleTick again, so we need another mechanism:
        if (typeof MessageChannel !== 'undefined' || (typeof window !== 'undefined' && typeof window.postMessage === 'function')) {
          scheduleTick();
        } else if (typeof requestAnimationFrame === 'function') {
          // use rAF loop — start it
          requestAnimationFrame(runner);
        } else {
          // the other fallbacks ultimately call scheduleTick which should call runner
          scheduleTick();
        }
      }
    }

    // Runner executes due timers and reschedules if needed.
    function runner() {
      tickScheduled = false;
      const now = Date.now();

      // collect ids to run (avoid mutation during iteration)
      const toRun = [];
      for (const [id, t] of timers) {
        if (t.time <= now) toRun.push(id);
      }

      // run callbacks (insertion order for same-time timers)
      for (const id of toRun) {
        const t = timers.get(id);
        if (!t) continue;
        timers.delete(id);
        try {
          t.fn.apply(null, t.args || []);
        } catch (err) {
          // throw asynchronously so user code can catch global errors like native setTimeout
          setTimeout(() => { throw err; }, 0);
        }
      }

      // If there are pending timers, schedule another tick
      if (timers.size > 0) {
        ensureTick();
      }
    }

    function mySetTimeout(fn, delay = 0, ...args) {
      if (typeof fn !== 'function') {
        // native setTimeout accepts strings; polyfill does not for safety/perf
        throw new TypeError('Callback must be a function');
      }
      const id = nextId++;
      const when = Date.now() + Math.max(0, Number(delay) || 0);
      timers.set(id, { fn, time: when, args });
      ensureTick();
      return id;
    }

    function myClearTimeout(id) {
      timers.delete(id);
    }

    return { setTimeout: mySetTimeout, clearTimeout: myClearTimeout };
  }

  // If native missing, attach; otherwise provide namespaced versions
  const ps = createTimerSystem();
  if (typeof global.setTimeout === 'undefined') {
    global.setTimeout = ps.setTimeout;
    global.clearTimeout = ps.clearTimeout;
  } else {
    // expose under other names so user can opt-in
    global.mySetTimeout = ps.setTimeout;
    global.myClearTimeout = ps.clearTimeout;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
