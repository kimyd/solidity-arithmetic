var BigNumber = require('bignumber.js');
BigNumber.config({
    ROUNDING_MODE: BigNumber.ROUND_FLOOR
});

let crypto = require('crypto');

function rand256BitBigNumber() {
    return new BigNumber(crypto.randomBytes(32).toString('hex'), 16);
}

var Arithmetic = artifacts.require("./Arithmetic.sol");

contract('Arithmetic', function(accounts) {
    for (var i = 1; i <= 10; i++) {
        it(`should calculate a * b / d correctly, try ${i}`, function() {
            var a = rand256BitBigNumber(),
                b = rand256BitBigNumber(),
                d = rand256BitBigNumber();
            return Arithmetic.deployed().then(function(instance) {
                return instance.overflowResistantFraction.call(a, b, d);
            }).then(function(c) {
                var res = a.times(b).divToInt(d);
                assert(c.equals(res), `Contract value doesn't match BigNumber value:\n0x${c.toString(16)} !=\n0x${res.toString(16)}\n(\n 0x${a.toString(16)} *\n 0x${b.toString(16)} /\n 0x${d.toString(16)}\n)`);
            });
        });
    }
});
