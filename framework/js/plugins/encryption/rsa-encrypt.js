define(["./libs/js-big-integer", "./libs/random-number-generator-interface"], function (BigInteger, RNG) {
    "use strict";

    const b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        b64padchar = "=";

    function hex2b64(h) {
        let i,
            c,
            ret = "";

        for (i = 0; i + 3 <= h.length; i += 3) {
            c = parseInt(h.substring(i, i + 3), 16);
            ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
        }

        if (i + 1 === h.length) {
            c = parseInt(h.substring(i, i + 1), 16);
            ret += b64map.charAt(c << 2);
        } else if (i + 2 === h.length) {
            c = parseInt(h.substring(i, i + 2), 16);
            ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
        }

        while ((ret.length & 3) > 0) {
            ret += b64padchar;
        }

        return ret;
    }

    function parseBigInt(str, r) {
        return new BigInteger(str, r);
    }

    function pkcs1pad2(s, n) {
        if (n < s.length + 11) {
            return null;
        }

        const ba = [];
        let i = s.length - 1;

        while (i >= 0 && n > 0) {
            const c = s.charCodeAt(i--);

            if (c < 128) {
                ba[--n] = c;
            } else if ((c > 127) && (c < 2048)) {
                ba[--n] = (c & 63) | 128;
                ba[--n] = (c >> 6) | 192;
            } else {
                ba[--n] = (c & 63) | 128;
                ba[--n] = ((c >> 6) & 63) | 128;
                ba[--n] = (c >> 12) | 224;
            }
        }

        ba[--n] = 0;

        const rng = RNG,
            x = [];

        while (n > 2) {
            x[0] = 0;

            while (x[0] === 0) {
                rng.nextBytes(x);
            }

            ba[--n] = x[0];
        }

        ba[--n] = 2;
        ba[--n] = 0;

        return new BigInteger(ba);
    }

    function RSAKey() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null;
    }

    function RSASetPublic(N, E) {
        if (N && E && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
        } else {
            return new Error("Invalid RSA public key");
        }
    }

    function RSADoPublic(x) {
        return x.modPowInt(this.e, this.n);
    }

    function RSAEncrypt(text) {
        const m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);

        if (!m) {
            return null;
        }

        const c = this.doPublic(m);

        if (!c) {
            return null;
        }

        const h = c.toString(16);

        if ((h.length & 1) === 0) {
            return h;
        }

        return "0" + h;
    }

    function RSAEncryptB64(text) {
        const h = this.encrypt(text);

        if (h) {
            return hex2b64(h);
        }

        return null;
    }

    RSAKey.prototype.doPublic = RSADoPublic;

    RSAKey.prototype.setPublic = RSASetPublic;
    RSAKey.prototype.encrypt = RSAEncrypt;
    RSAKey.prototype.encryptb64 = RSAEncryptB64;

    return RSAKey;
});