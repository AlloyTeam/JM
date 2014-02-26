define(['../../src/core'], function(){

    describe('Core methods', function(){

        describe('$()', function(){
            it('$(selector, [context])', function(){
                var $body = $('body');
                var body = document.querySelector('body');
                expect($body[0] === body).to.be.true;
            })

            it('$(<JM collection>)', function(){
                var $body = $( $('body') );
                var body = document.querySelector('body');
                expect($body[0] === body).to.be.true;
            })

            it('$(<DOM nodes>)', function(){
                var body = document.querySelector('body');
                var $body = $( body );
                expect($body[0] === body).to.be.true;
            })

        })

    })
})