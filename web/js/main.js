class GameStart extends Phaser.Scene {
    constructor() {
        super({key: 'GameStart'});
    }

    preload() {
        this.load.image('st-header', './assets/header.png');
        this.load.image('st-p1', './assets/player_front1.png');
        this.load.image('st-p2', './assets/player_front2.png');
        this.load.image('st-p3', './assets/player_front3.png');
        this.load.image('st-ins', './assets/start_instr.png');
        this.load.image('st-s1', './assets/student_front1.png');
        this.load.image('st-s2', './assets/student_front2.png');
        this.load.image('cat', './assets/cat.png');

        // load some heavy resources in advance
        this.load.audio('bgm', './assets/bgm/Alla-Turca.mp3');
        this.load.audio('meow', './assets/bgm/meow.mp3');
        this.load.audio('biu', './assets/bgm/biu.mp3');
        this.load.audio('endbgm', './assets/bgm/start_again.mp3');

        this.load.image('background', './assets/bg1_darken.png');
        this.load.image('banner-10', './assets/10.png');
        this.load.image('banner-3', './assets/3.png');
        this.load.image('banner-new', './assets/newday.png');
        this.load.image('night', './assets/night.png');
        this.load.image('endbg1', './assets/endpg1.png');
        this.load.image('endbg', './assets/endpg.png');

        const textStyle = {font: '32px Arial', fill: BLACK, align: 'center'};
        this.loadingText = this.add.text(c_width/2, c_height/2, 'Loading...', textStyle);
        this.loadingText.setOrigin(0.5, 0.5);
    }

    create() {
        this.loadingText.alpha = 0;
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
        this.load.image('player', './assets/player.png');
        this.load.image('st-good', './assets/student_good1.png');
        this.load.image('st-bad', './assets/student_bad1.png');
        this.load.image('magic', './assets/magic.png');
        this.load.image('classroom', './assets/classroom.png');

    }

    create() {
        this.init();

        this.add.image(0,0,'background')
            .setDisplaySize(c_width, c_height)
            .setOrigin(0,0);
        
        this.night = this.add.image(0,0,'night')
            .setDisplaySize(c_width, c_height)
            .setOrigin(0,0);
        this.night.depth = 5; // to have it on the top
        this.night.alpha = 0;

        this.classroom = this.add.image(0,0,'classroom')
            .setOrigin(0,0);
        this.classroom.depth = 3;

        this.bgm = this.sound.add('bgm', {loop: true});
        this.bgm.play();

        this.biu = this.sound.add('biu', {loop: false, volume: 0.25});
        this.meow = this.sound.add('meow', {loop: false});

        this.player = this.physics.add.sprite(this.x, this.y, 'player').setOrigin(1,0.5);
        this.player.depth = 4;
        this.player.setDisplaySize(c_player_width, c_player_height);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(0);

        this.banner_10 = this.physics.add.sprite(0, c_height/2, 'banner-10').setOrigin(1,0.5);
        this.banner_10.setDisplaySize(c_banner_width, c_banner_height);
        this.banner_10.depth = 5;
        this.banner_3 = this.physics.add.sprite(0, c_height/2, 'banner-3').setOrigin(1,0.5);
        this.banner_3.setDisplaySize(c_banner_width, c_banner_height);
        this.banner_3.depth = 5;
        this.banner_new = this.physics.add.sprite(0, c_height/2, 'banner-new').setOrigin(1,0.5);
        this.banner_new.setDisplaySize(c_banner_width, c_banner_height);
        this.banner_new.depth = 5;

        // The resource group for magic
        this.allMagic = this.physics.add.group();

        // The resource group for students
        this.allGoodStudent = this.physics.add.group();
        this.allBadStudent = this.physics.add.group();

        // The resource group for cats
        this.allCat = this.physics.add.group();

        // The score text
        const textStyle = {font: '24px Arial', fill: BLACK, align: 'center'};
        this.scoreText = this.add.text(5, 5, 'Score: 0', textStyle);
        this.scoreText.setOrigin(0,0);

        // The date and time
        this.nowDay = 1;
        this.nowTime = 9;
        const timeTextStyle = {font: '24px Arial', fill: BLACK, align: 'right'};
        this.timeText = this.add.text(c_width-5, 5, this.getTimeText(), timeTextStyle);
        this.timeText.setOrigin(1,0);
        this.lastTime = Date.now();

        // Use mouse movement to control the player
        this.input.on('pointermove', pointer => {
            this.player.y = pointer.y;
        });

        // Cannot use "('pointerdown', this.addBullet)" since the 'this' context is different
        this.input.on('pointerdown', () => this.addMagic());

        // The timer for adding students
        this.stuTimer = this.time.addEvent({
            delay: c_time_between,
            loop: true,
            callback: () => {
                const good = Math.random() > c_student_prob;
                this.addStudent(good);
            },
            paused: false
        });

        // For huge wave
        this.stuFastTimer = this.time.addEvent({
            delay: c_time_between/3,
            loop: true,
            callback: () => {
                const good = Math.random() > c_student_prob;
                this.addStudent(good);
            },
            paused: true
        });

        // Check magic hit
        this.physics.add.overlap(this.allMagic, this.allGoodStudent, this.handleGoodHit, null, this);
        this.physics.add.overlap(this.allMagic, this.allBadStudent, this.handleBadHit, null, this);

        // handle animation
        this.animationOn = false;
        this.animationWork = null;
        this.animationCallback = null;
        this.animationTime = Date.now();
        this.animationLen = 0;
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
            if (student.active && student.x < c_redline_left - c_student_width/2) {
                this.allGoodStudent.killAndHide(student);
            }
        });
        this.allBadStudent.getChildren().forEach(student => {
            // This student escaped
            if (student.active && student.x < c_redline_left - c_student_width/2) {
                this.bgm.stop();
                this.scene.start('GameEnd-Miss');
            }
        });
        this.allCat.getChildren().forEach(cat => {
            if (cat.active) {
                const timepass = (Date.now() - cat.st_time)/1000;
                if (timepass > c_cat_die_time) {
                    this.allCat.killAndHide(cat);
                }
                else {
                    cat.alpha = 1 - timepass/c_cat_die_time;
                }
            }
        });

        const now_time = Date.now(), elapse = (now_time - this.lastTime)/1000;
        if (elapse > c_hour_length) {
            this.nowTime++;
            if (this.nowTime > 12)
                this.nowTime -= 12;
            this.timeText.setText(this.getTimeText());
            this.lastTime = now_time;

            if (this.nowTime == 7) {
                this.stuTimer.paused = true;
                this.lastTime = Date.now() + (c_student_time+c_night_time+c_banner_time)*1000;
                
                this.time.addEvent({
                    delay: c_student_time*1000,
                    callback: () => {
                        this.animationOn = true;
                        this.animationTime = Date.now();
                        this.animationLen = c_night_time;
                        this.animationWork = (elapsed) => {
                            if (elapsed < c_night_dim_time)
                                this.night.alpha = elapsed / c_night_dim_time;
                            else if (elapsed > c_night_stay_time + c_night_dim_time)
                                this.night.alpha = 1 - 
                                    (elapsed-c_night_stay_time-c_night_dim_time)/c_night_dim_time;
                            else this.night.alpha = 1;
                        }
                        this.animationCallback = () => {
                            this.animationOn = true;
                            this.animationTime = Date.now();
                            this.animationLen = c_banner_time;
                            this.animationWork = null;
                            this.addBannerAnimation(this.banner_new);

                            this.nowDay++;
                            this.nowTime = 9;
                            this.timeText.setText(this.getTimeText());
                            
                            this.animationCallback = () => {
                                this.stuTimer.paused = false;
                                this.lastTime = Date.now() + c_time_between;
                                this.animationCallback = null;
                            }
                        }
                    }
                })
            }

            if (this.nowTime === 10 || this.nowTime === 3) {
                // first, stop the normal student timer
                // second, wait till all students have gone
                this.stuTimer.paused = true;
                this.lastTime = Date.now() + (c_student_time+c_banner_time)*1000;

                const banner = (this.nowTime === 10? this.banner_10: this.banner_3);
                this.addBannerAnimation(banner);

                this.animationCallback = () => {
                    this.stuFastTimer.paused = false;

                    this.time.addEvent({
                        delay: c_hour_length*1000,
                        callback: () => {
                            this.stuFastTimer.paused = true;
                            this.stuTimer.paused = false;
                        }
                    })

                    this.animationCallback = null;
                }
            }
        }

        // handle animation
        if (this.animationOn) {
            const elapsed = (Date.now()-this.animationTime)/1000;
            if (elapsed > this.animationLen) {
                this.animationOn = false;
                if (this.animationCallback != null) {
                    // Please set it to null by yourself
                    this.animationCallback();
                }
            }
            else if (this.animationWork != null) {
                this.animationWork(elapsed);
            }
        }
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
            // Update score
            this.score++;
            this.scoreText.setText(`Score: ${this.score}`);

            // Summon a cute cat
            const stu_x = student.x, stu_y = student.y;
            const cat = this.allCat.get(stu_x, stu_y, 'cat');
            cat.setActive(true);
            cat.setVisible(true);
            cat.alpha = 1;
            cat.st_time = Date.now();
            cat.setDisplaySize(c_cat_width, c_cat_height);
            cat.setVelocity(0, -c_cat_die_dist/c_cat_die_time);
            this.meow.play();

            // Remove the magic and student
            this.allMagic.killAndHide(magic);
            this.allBadStudent.killAndHide(student);
        }
    }

    // To determine the appropriate ordinal word
    ordinalWord() {
        if (this.nowDay >= 10 && this.nowDay <= 19)
            return 'th';
        if (this.nowDay % 10 == 1)
            return 'st';
        if (this.nowDay % 10 == 2)
            return 'nd';
        if (this.nowDay % 10 == 3)
            return 'rd';
        return 'th';
    }

    getTimeText() {
        return `${this.nowDay}${this.ordinalWord()} day\n${this.nowTime}:00`;
    }

    addBannerAnimation(banner) {
        this.animationOn = true;
        this.animationTime = Date.now();
        this.animationLen = c_banner_time;

        banner.x = 0;
        banner.setVelocity(c_banner_speed,0);

        this.time.addEvent({
            delay: c_banner_travel_time*1000,
            callback: () => {
                banner.setVelocity(0,0);

                this.time.addEvent({
                    delay: c_banner_stay_time*1000,
                    callback: () => {
                        banner.setVelocity(c_banner_speed,0);
                    }
                })
            }
        })
    }
};

class GameEnd_Wrong extends Phaser.Scene {
    constructor() {
        super({key: 'GameEnd-Wrong'});
    }

    preload() {
    }

    create() {
        this.add.image(0,0,'endbg1').setOrigin(0,0).setDisplaySize(c_width, c_height);
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

class GameEnd_Miss extends Phaser.Scene {
    constructor() {
        super({key: 'GameEnd-Miss'});
    }

    preload() {
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