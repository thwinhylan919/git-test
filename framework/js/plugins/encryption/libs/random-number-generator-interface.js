define(["./prime-random-number-generator"], function (PRNG) {
    "use strict";

    const rng_psize = 256;

    let rng_state,
        rng_pool,
        rng_pptr;

    function rng_seed_int(x) {
        rng_pool[rng_pptr++] ^= x & 255;
        rng_pool[rng_pptr++] ^= (x >> 8) & 255;
        rng_pool[rng_pptr++] ^= (x >> 16) & 255;
        rng_pool[rng_pptr++] ^= (x >> 24) & 255;

        if (rng_pptr >= rng_psize) {
            rng_pptr -= rng_psize;
        }
    }

    function rng_seed_time() {
        rng_seed_int(new Date().getTime());
    }

    if (!rng_pool) {
        rng_pool = [];
        rng_pptr = 0;

        let t;

        if (window.crypto && window.crypto.getRandomValues) {
            const ua = new Uint8Array(32);

            window.crypto.getRandomValues(ua);

            for (t = 0; t < 32; ++t) {
                rng_pool[rng_pptr++] = ua[t];
            }
        }

        if (navigator.appName === "Netscape" && navigator.appVersion < "5" && window.crypto) {
            const z = window.crypto.random(32);

            for (t = 0; t < z.length; ++t) {
                rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
            }
        }

        while (rng_pptr < rng_psize) {
            t = Math.floor(65536 * Math.random());
            rng_pool[rng_pptr++] = t >>> 8;
            rng_pool[rng_pptr++] = t & 255;
        }

        rng_pptr = 0;
        rng_seed_time();
    }

    function rng_get_byte() {
        if (!rng_state) {
            rng_seed_time();
            rng_state = PRNG;
            rng_state.init(rng_pool);

            for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
                rng_pool[rng_pptr] = 0;
            }

            rng_pptr = 0;
        }

        return rng_state.next();
    }

    function rng_get_bytes(ba) {
        let i;

        for (i = 0; i < ba.length; ++i) {
            ba[i] = rng_get_byte();
        }
    }

    // eslint-disable-next-line no-empty-function
    function SecureRandom() {}

    SecureRandom.prototype.nextBytes = rng_get_bytes;

    return new SecureRandom();
});