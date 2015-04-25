describe('swiped.js', function() {
    beforeEach(function() {
        this.s = new Swiped({});
        this.s.elem = document.createElement('div');
    });

    describe("#move", function() {
        it("1", function() {
            this.s.dir = 1;
            this.s.delta = -1;

            expect(this.s.move()).toEqual(false);
        });

        it("2", function() {
            this.s.left = 0;
            this.s.dir = 1;
            this.s.delta = 1;

            expect(this.s.move()).toEqual(false);
        });

        it("3", function() {
            this.s.dir = -1;
            this.s.delta = 1;

            expect(this.s.move()).toEqual(false);
        });

        it("4", function() {
            this.s.right = 0;
            this.s.dir = -1;
            this.s.delta = -1;

            expect(this.s.move()).toEqual(false);
        });

        it("linear deceleration", function() {
            this.s.left = 200;
            this.s.width = 200;
            this.s.dir = 1;
            this.s.delta = 300;

            this.s.move();

            expect(this.s.delta).toEqual(212.5);
        });
    });

    describe("#destroy", function() {
        it("1", function() {
            var s = new Swiped({});
            Swiped._elems.push(s);
            s.destroy();
            expect(Swiped._elems.length).toEqual(0);
        });
    });
});