class GameStart extends Phaser.Scene {
    constructor() {
        super({key: 'GameStart'});
    }

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
        
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.QKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        if (this.spaceKey.isDown) {
            this.scene.start('GameBody');
        }
        else if (this.QKey.isDown) {
            if (confirm('Leave the game?')) {
                window.opener = null;
                window.close();
            }
        }
    }
};

class GameBody extends Phaser.Scene {
    constructor() {
        super({key: 'GameBody'});
    }

    cursor = null;

    init() {
        this.x = c_redline_left - 10;
        this.y = c_height / 2;
        this.score = 0;
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('background', 'assets/bg1_darken.png');
        this.load.image('cat', 'assets/cat.png');
        this.load.image('st-good', 'assets/student_good1.png');
        this.load.image('st-bad', 'assets/student_bad1.png');
        this.load.image('magic', 'assets/magic.png');

        this.load.audio('bgm', 'assets/bgm/Alla-Turca.mp3');
        this.load.audio('meow', 'assets/bgm/meow.mp3');
        this.load.audio('biu', 'assets/bgm/biu.mp3');
    }

    create() {
        this.init();

        this.add.image(0,0,'background')
            .setDisplaySize(c_width, c_height)
            .setOrigin(0,0);

        this.bgm = this.sound.add('bgm', {loop: true});
        this.bgm.play();

        this.biu = this.sound.add('biu', {loop: false, volume: 0.25});

        this.player = this.physics.add.sprite(this.x, this.y, 'player').setOrigin(1,0.5);
        this.player.setDisplaySize(c_player_width, c_player_height);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(0);

        // The resource group for magic
        this.allMagic = this.physics.add.group();

        // The resource group for students
        this.allGoodStudent = this.physics.add.group();
        this.allBadStudent = this.physics.add.group();

        // Use mouse movement to control the player
        this.input.on('pointermove', pointer => {
            this.player.y = pointer.y;
        });

        // Cannot use "('pointerdown', this.addBullet)" since the 'this' context is different
        this.input.on('pointerdown', () => this.addMagic());

        // The timer for adding students
        this.stuTimer = this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => {
                const good = Math.random() > c_student_prob;
                this.addStudent(good);
            }
        });

        this.physics.add.overlap(this.allMagic, this.allGoodStudent, this.handleGoodHit, null, this);
        this.physics.add.overlap(this.allMagic, this.allBadStudent, this.handleBadHit, null, this);
    }

    update() {
        // Check if bullets goes out of the screen
        this.allMagic.getChildren().forEach(magic => {
            if (magic.active && magic.x > c_width + c_magic_width) {
                // This will not remove the magic instance
                // Just set the bullet inactive and invisible
                // So it can be reused for next call
                this.allMagic.killAndHide(magic);
            }
        });
        this.allGoodStudent.getChildren().forEach(student => {
            if (student.active && student.x < c_redline_left - c_student_width) {
                this.allGoodStudent.killAndHide(student);
            }
        });
        this.allBadStudent.getChildren().forEach(student => {
            // This student escaped
            if (student.active && student.x < c_redline_left - c_student_width) {
                this.bgm.stop();
                this.scene.start('GameEnd-Miss');
            }
        });
    }

    addMagic() {
        // the y-axis of the bullet. It goes right from the gun
        const magic_y = this.player.y + c_player_height*0.2695;

        const magic = this.allMagic.get(this.x, magic_y, 'magic');
        magic.setVelocity(c_magic_speed,0);
        magic.body.setSize(c_magic_width, c_magic_height);
        magic.setDisplaySize(c_magic_width, c_magic_height);
        magic.body.syncBounds = true;

        // This might be a recollected magic, so re-activate it
        magic.setActive(true);
        magic.setVisible(true);

        // Sound effect
        this.biu.play();
    }

    addStudent(good) {
        const stu_x = c_width + c_student_width/2;
        const stu_y = Math.random() * (c_height - c_student_height) + c_student_height/2;

        let student;
        if (good) student = this.allGoodStudent.get(stu_x, stu_y, 'st-good');
        else student = this.allBadStudent.get(stu_x, stu_y, 'st-bad');
        
        student.setDisplaySize(c_student_width, c_student_height);
        student.body.syncBounds = true;

        student.setActive(true);
        student.setVisible(true);

        student.setVelocity(-c_student_speed,0);
    }

    // You hit a good student!
    handleGoodHit(magic, student) {
        if (magic.active && student.active) {
            this.bgm.stop();
            this.scene.start('GameEnd-Wrong');
        }
    }

    // You hit a bad student.
    handleBadHit(magic, student) {
        if (magic.active && student.active) {
            this.score++;
            this.allMagic.killAndHide(magic);
            this.allBadStudent.killAndHide(student);
        }
    }
};

// The base class for end scene
// Will not load resources, just handle keyboard event
class GameEndBase extends Phaser.Scene {
    constructor(scenename) {
        super({key: scenename});
    }

    create() {
        this.add.image(0,0,'endbg').setOrigin(0,0).setDisplaySize(c_width, c_height);
        this.bgm = this.sound.add('endbgm', {loop: true});
        this.bgm.play();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.QKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        if (this.spaceKey.isDown) {
            this.bgm.stop();
            this.scene.start('GameStart');
        }
        else if (this.QKey.isDown) {
            if (confirm('Leave the game?')) {
                window.opener = null;
                window.close();
            }
        }
    }
};

class GameEnd_Wrong extends GameEndBase {
    constructor() {
        super('GameEnd-Wrong');
    }

    preload() {
        this.load.image('endbg', 'assets/endpg1.png');
        this.load.audio('endbgm', 'assets/bgm/start_again.mp3');
    }
};

class GameEnd_Miss extends GameEndBase {
    constructor() {
        super('GameEnd-Miss');
    }

    preload() {
        this.load.image('endbg', 'assets/endpg.png');
        this.load.audio('endbgm', 'assets/bgm/start_again.mp3');
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
    scene: [GameStart, GameBody, GameEnd_Wrong, GameEnd_Miss]
};

const game = new Phaser.Game(config);