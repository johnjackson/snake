const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

// 速度 todo 自定义

//创建地图
function createMap(row = 8, col = 8) {
    let html = '';
    for (let i = 0; i < row; i++) {
        html += '<tr>';
        for (let j = 0; j < col; j++) {
            html += '<td></td>';
        }
        html += '</tr>';
    }
    $('#map').html(html);
}

let target_block = {};

var snake = {
    body: [],
    direction: null,
    ROWS: 8,
    COLS: 8,
    score: 0,
    speed: 6,
    init: function() {
        let size = $('#size').val();
        this.ROWS = size;
        this.COLS = size;
        createMap(this.ROWS, this.COLS);
        this.body = [];
        this.score = 0;
        this.speed = $('#speed').val();
        this.body[0] = {
            x: parseInt(Math.random() * (this.COLS - 2) + 1), //起点坐标x
            y: parseInt(Math.random() * (this.ROWS - 2) + 1) //起点坐标y
        };

        let start = this.body[0];

        if (start.x > this.COLS / 2 && start.y > this.ROWS / 2) {
            this.direction = Math.random() * 2 > 1 ? UP : LEFT;
        } else if (start.x < this.COLS / 2 && start.y > this.ROWS / 2) {
            this.direction = Math.random() * 2 > 1 ? RIGHT : UP;
        } else if (start.x < this.COLS / 2 && start.y < this.ROWS / 2) {
            this.direction = Math.random() * 2 > 1 ? RIGHT : DOWN;
        } else if (start.x > this.COLS / 2 && start.y < this.ROWS / 2) {
            this.direction = Math.random() * 2 > 1 ? LEFT : DOWN;
        } else {
            this.direction = parseInt(Math.random() * 4 + 1);
        }

        switch (this.direction) {
            case UP:
                this.body.push({
                    x: start.x,
                    y: start.y + 1
                });
                break;
            case RIGHT:
                this.body.push({
                    x: start.x - 1,
                    y: start.y
                });
                break;
            case DOWN:
                this.body.push({
                    x: start.x,
                    y: start.y - 1
                });
                break;
            case LEFT:
                this.body.push({
                    x: start.x + 1,
                    y: start.y
                });
                break;
        }

        this.activeBlock(this.body[0]);
        this.activeBlock(this.body[1]);

        this.makeNewTargetBlock();

        this.move();
    },
    //激活一个方块（变黑）
    activeBlock: function(block) {
        let $block = this.getBlock(block);
        $block.addClass('active').removeClass('target');
    },
    deactiveBlock: function(block) {
        let $block = this.getBlock(block);
        $block.removeClass('active');
    },
    getBlock: function(block) {
        return $('#map').find('tr:eq(' + block.y + ')').find('td:eq(' + block.x + ')');
    },
    move: function() {
        clearInterval(this.loop);
        this.loop = setInterval(() => {
            let start = this.body[0];

            switch (this.direction) {
                case UP:
                    this.body.unshift({
                        x: start.x,
                        y: start.y - 1
                    });
                    break;
                case RIGHT:
                    this.body.unshift({
                        x: start.x + 1,
                        y: start.y
                    });
                    break;
                case DOWN:
                    this.body.unshift({
                        x: start.x,
                        y: start.y + 1
                    });
                    break;
                case LEFT:
                    this.body.unshift({
                        x: start.x - 1,
                        y: start.y
                    });
                    break;
            }
            start = this.body[0];

            // 碰撞检测
            if (start.x < 0 || start.x >= this.COLS || start.y < 0 || start.y >= this.ROWS || this.isActive(start)) {
                alert('游戏结束');
                clearInterval(this.loop);
                this.loop = null;
            } else if (start.x == target_block.x && start.y == target_block.y) {
                //吃到一个豆子
                this.activeBlock(start);
                this.makeNewTargetBlock();
                this.score++;
                $('#score').text(this.score);
            } else {
                //没有吃到豆子，普通移到
                this.activeBlock(start);
                let end = this.body[this.body.length - 1];
                this.deactiveBlock(end);
                this.body.pop();
            }
        }, 1100 - this.speed*100);
    },
    //生成一个小块
    makeNewTargetBlock: function() {
        let start = this.body[0];
        let block
        do {
            block = {
                x: parseInt(Math.random() * this.COLS), //起点坐标x
                y: parseInt(Math.random() * this.ROWS) //起点坐标y
            };
        } while (this.isActive(block) || block.x == start.x || block.y == start.y);
        target_block.x = block.x;
        target_block.y = block.y;

        this.getBlock(target_block).addClass('target');
    },
    isActive: function(block) {
        return this.getBlock(block).is('.active');
    }
};
snake.init();

$(function() {
    $(document)
        .on('keyup', function(e) {
            switch (e.keyCode) {
                case 37: //左
                    snake.direction = LEFT;
                    break;
                case 38: //上
                    snake.direction = UP;
                    break;
                case 39: //右
                    snake.direction = RIGHT;
                    break;
                case 40: //下
                    snake.direction = DOWN;
                    break;
            }
        })
        .on('click', '#restart', function() {
            snake.init();
        });
});