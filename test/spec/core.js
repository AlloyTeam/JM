define(['../../src/core'], function(){

    describe('Core methods', function(){

        describe('$()', function(){
            it('$(selector, [context])', function(){
                var $body = $('body');
                var body = document.querySelector('body');
                expect($body[0] === body).to.be.true;
            })

            it('$(<JM object>)', function(){
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

    describe('Core properties', function(){

        describe('$obj', function(){

            it('$obj.version', function(){
                var $body = $('body');
                expect($body.version).to.equal('@VERSION');
                $body.version = 'changed';
                expect($body.version).to.equal('@VERSION');
            })

            it('$obj.selector', function(){
                var $body = $('body');
                expect($body.selector).to.equal('body');
            })

            it('$obj.context', function(){
                var $body = $('body');
                expect($body.context === document ).to.be.true;
            })

        })

    })


})