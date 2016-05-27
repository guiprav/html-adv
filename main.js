'use strict';

let raf = requestAnimationFrame;

let $body = $('body');
let $story = $('#story');

let cmdq = (() => {
    let cmdq = [];

    let lastFrameTs;

    function execFrame() {
        raf(execFrame);

        let head = cmdq[0];

        if(!head) {
            return;
        }

        let curFrameTs = Date.now();

        if(!lastFrameTs) {
            lastFrameTs = curFrameTs;
        }

        if(head.exec(curFrameTs - lastFrameTs) === 'done') {
            cmdq.shift();
        }

        lastFrameTs = curFrameTs;
    }

    execFrame();

    return cmdq;
})();

$body.on('click', evt => {
    console.log(evt);
    let curCmd = cmdq[0];

    if(!curCmd || !curCmd.skip) {
        return;
    }

    curCmd.skip();
});

let st = {
    baseSpd: 1.5,
    spd: 10,
};

let typewrite = text => {
    return {
        text,

        $el: $('<span>').addClass('typewriter'),

        init: function() {
            if(this.startTs) {
                return;
            }

            this.startTs = Date.now();
            $story.append(this.$el);
        },

        elapsed: function() {
            return Date.now() - this.startTs;
        },

        skip: function() {
            this.skipReq = true;
        },

        exec: function() {
            this.init();

            let elapsed = this.elapsed();

            let iTail = (() => {
                if(!this.skipReq) {
                    return Math.floor(elapsed / 1000 * st.baseSpd * st.spd);
                }
                else {
                    return this.text.length;
                }
            })();

            this.$el.text(this.text.slice(0, iTail));

            if(iTail >= this.text.length) {
                return 'done';
            }
        },
    };
};

let wait = time => {
    return {
        time,

        init: function() {
            if(this.startTs) {
                return;
            }

            this.startTs = Date.now();
        },

        elapsed: function() {
            return Date.now() - this.startTs;
        },

        skip: function() {
            this.skipReq = true;
        },

        exec: function() {
            this.init();

            if(this.skipReq) {
                return 'done';
            }

            if(!this.time) {
                return;
            }

            if(this.elapsed() * st.baseSpd >= this.time) {
                return 'done';
            }
        }
    };
};

cmdq.push(typewrite('Long ago, '));
cmdq.push(wait(200));
cmdq.push(typewrite('the Giant Kharlan tree,\n'));
cmdq.push(wait(800));
cmdq.push(typewrite('the essence of order and balance in the Earth,\n'));
cmdq.push(wait(500));
cmdq.push(typewrite('withered, '));
cmdq.push(wait(200));
cmdq.push(typewrite('and died.\n'));
