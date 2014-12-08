/**
 *  Clear all before run test
 **/

describe("LocalCache", function() {
    var key = 'storageKey';
    var value = 'storageValue'

    /**
     *  Set
     **/
    describe("#set", function() {
        // it("returns @".replace('@', value), function() {
        //     storage.set(key, value)
        //     var result = storage.get(key);
        //     assert(result === value);
        // });
        // it("returns @ When set with important".replace('@', value), function() {
        //     storage.set(key, value, true);
        //     var result = storage.get(key);
        //     assert(result === value);
        // });
        it("Run without error when set 20 big content string", function() {
            var count = 10;
            while (count--) {
                storage.set(key + count, bigContent)
            }
        });
    });


    /**
     *  Get
     **/
    // describe("#get", function() {
    //     localStorage.clear();
    //     /**
    //      *  normal returns
    //      **/
    //     it("returns null when get a not exsit key", function() {
    //         var result = storage.get(key);
    //         assert.equal(result, null);
    //     });
    //     it("returns @ when get $".replace('@', value).replace('$', key), function() {
    //         storage.set(key, value)
    //         var result = storage.get(key);
    //         assert.equal(result, value);
    //     });
    //     /**
    //      *  type validate
    //      **/
    //     it("returns 'undefined' when set value to undefined", function() {
    //         storage.set(key, undefined)
    //         var result = storage.get(key);
    //         assert.equal(result, 'undefined');
    //     });
    //     it("returns 'null' when set value to null", function() {
    //         storage.set(key, null)
    //         var result = storage.get(key);
    //         assert.equal(result, 'null');
    //     });
    //     it("returns 'false' when set value to false", function() {
    //         storage.set(key, false)
    //         var result = storage.get(key);
    //         assert.equal(result, 'false');
    //     });
    //     it("returns a object when set value to object", function() {
    //         storage.set(key, {})
    //         var result = storage.get(key);
    //         assert.typeOf(result, 'object');
    //     });
    // });

    // /**
    //  *  Remove
    //  **/
    // describe("#remove", function() {
    //     it("returns null when remove @ then get it".replace(/@/, key), function() {
    //         storage.remove(key)
    //         var result = storage.get(key);
    //         assert(result === null);
    //     });
    // });
});
