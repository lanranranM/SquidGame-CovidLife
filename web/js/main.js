class StartScreen extends Phaser.Scene {
    constructor() {
        super({key: 'StartScreen'});
    }

    cursor = null;

    preload() {
        this.load.image('st-header', 'assets/header.png');
        this.load.image('st-p1', 'assets/player_front1.png');
        this.load.image('st-p2', 'assets/player_front2.png');
        this.load.image('st-p3', 'assets/player_front3.png');
        this.load.image('st-ins', 'assets/start_instr.png');
        this.load.image('st-s1', 'assets/student_front1.png');
        this.load.image('st-s2', 'assets/student_front2.png');
        this.load.image('cat', 'assets/cat.png');
    }

    create() {
        this.add.image(270, 152, 'st-header')
            .setDisplaySize(c_header_width, c_header_height)
            .setOrigin(0,0);
        this.add.image(350, 380, 'st-ins')
            .setDisplaySize(c_instr_width, c_instr_height)
            .setOrigin(0,0);
        this.add.image(150, 450, 'st-s1')
            .setOrigin(0,0);
        this.add.image(360, 450, 'st-p1')
            .setOrigin(0,0);
        this.add.image(520, 450, 'st-p2')
            .setOrigin(0,0);
        this.add.image(680, 450, 'st-p3')
            .setOrigin(0,0);
        this.add.image(840, 450, 'st-s2')
            .setOrigin(0,0);
        this.add.image(850, 370, 'cat')
            .setDisplaySize(c_cat_width*2, c_cat_height*2)
            .setOrigin(0,0);
        
        this.cursor = this.input.keyboard.createCursorKeys();
    }

    update() {}
};

class GameBody extends Phaser.Scene {
    constructor() {
        super({key: 'GameBody'});
    }

    cursor = null;

    init() {
        this.gameOver = false;
        this.x = c_redline_left - 10;
        this.y = c_height / 2;
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('cat', 'assets/cat.png');
        this.load.image('st-good', 'assets/student_good1.png');
        this.load.image('st-bad', 'assets/student_bad1.png');
        this.load.image('magic', 'assets/magic.png');
    }

    create() {
        this.init();
        this.cursor = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.sprite(this.x, this.y, 'player').setInteractive();
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(0);

        this.add.image(0,0,'background')
            .setDisplaySize(c_width, c_height)
            .setOrigin(0,0);
    }
};

const config = {
    type: Phaser.AUTO,
    width: c_width,
    height: c_height,
    backgroundColor: BABYBLUE,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [StartScreen]
};

const game = new Phaser.Game(config);