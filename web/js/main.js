var config = {
    type: Phaser.AUTO,
    width: c_width,
    height: c_height,
    backgroundColor: BABYBLUE,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    // resources for start up page
    this.load.image('st-header', 'assets/header.png');
    this.load.image('st-p1', 'assets/player_front1.png');
    this.load.image('st-p2', 'assets/player_front2.png');
    this.load.image('st-p3', 'assets/player_front3.png');
    this.load.image('st-ins', 'assets/start_instr.png');
    this.load.image('st-s1', 'assets/student_front1.png');
    this.load.image('st-s2', 'assets/student_front2.png');
    this.load.image('cat', 'assets/cat.png');
}

function create() {
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
    this.add.image(840, 450, 'st-s1')
        .setOrigin(0,0);
    this.add.image(850, 370, 'cat')
        .setDisplaySize(c_cat_width*2, c_cat_height*2)
        .setOrigin(0,0);
}