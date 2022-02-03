// window size
const c_width = 1080
const c_height = 608

// frequently used colors
const WHITE = '#ffffff'
const RED = '#ff0000'
const GREEN = '#00ff00'
const BLUE = '#0000ff'
const BLACK = '#000000'
const GRAY = '#808080'
const LIGHTGRAY = '#c0c0c0'
const BABYBLUE = '#92d7ef'

// main page
const c_header_width = c_width / 2
const c_header_height = c_height / 3
const c_instr_width = c_width / 3
const c_instr_height = c_instr_width / 8

// cat
const c_cat_width = c_width / 18
const c_cat_height = c_cat_width
// time before the cat disappear
const c_cat_die_time = 1.5
// distance the cat travels before disappearing
const c_cat_die_dist = 40

// Red line coordinate, dimensions, and color
const c_redline_left = c_width / 6
const c_redline_top = 0
const c_redline_width = 5
const c_redline_height = c_height
const c_redline_color = BLACK
const c_redline_right = c_redline_left + c_redline_width;

// player
const c_player_width = c_width / 15
const c_player_height = c_player_width

// magic
const c_magic_width = 10
const c_magic_height = 10
// We want the magic to cross the window in a fixed amount of time, say, 2 seconds
const c_magic_travel_time = 1.8
const c_magic_speed = (c_width - c_redline_left) / c_magic_travel_time

// student
const c_student_width = c_width / 15
const c_student_height = c_student_width
const c_student_prob = 0.5
// time needed for a student to reach the line
const c_student_time = 3
// student moving speed, calculated from the time
const c_student_speed = (c_width - c_redline_left) / c_student_time

// # of seconds for an "hour"
const c_hour_length = 5