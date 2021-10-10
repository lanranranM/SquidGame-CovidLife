import os

from pygame import Color

# Some constants related to the game
# Writing constant in capical letter looks ugly
# So lets write all constant in the form "c_{name}"

# Some frequently used colors
WHITE = (255,255,255)
RED = (255,0,0)
GREEN = (0,255,0)
BLUE = (0,0,255)
BLACK = (0,0,0)
GRAY = (128,128,128)
LIGHTGRAY = (192,192,192)
BABY_BLUE = Color('#92d7ef')

# game name
c_game_name = "SquidGame: Covid Life"

# asset folder name
c_asset_folder = 'assets'

# Window width and height
c_width = 1080
c_height = 608
c_bg_file = os.path.join(c_asset_folder, 'bg1_darken.png')
c_bg_file2 = os.path.join(c_asset_folder, 'classroom.png')

# frame rate
c_fps = 60

# main page
c_header_width = c_width // 2
c_header_height = c_height // 3

# Red line coordinate, dimensions, and color
c_redline_left = c_width // 6
c_redline_top = 0
c_redline_width = 5
c_redline_height = c_height
c_redline_color = BLACK

# Player attributes
c_player_file = os.path.join(c_asset_folder, 'player.png')
c_player_width = c_width // 15
c_player_height = c_player_width

# The magic attributes
c_magic_width = 10
c_magic_height = 10
c_magic_color = (255,215,0)
c_magic_center = (c_magic_width//2, c_magic_height//2)
c_magic_radius = min(c_magic_width//2, c_magic_height//2)
# We want it to cross the window in a fixed amount of time, say, 2 seconds
c_magic_travel_time = 1.8
c_magic_speed = int((c_width - c_redline_left) / c_magic_travel_time / c_fps)

# The student attributes
c_student_file = os.path.join(c_asset_folder, 'student_bad1.png')
c_student_good_file = os.path.join(c_asset_folder, 'student_good1.png')
c_student_width = c_width // 15
c_student_height = c_student_width
# time needed for a student to reach the line
c_student_time = 3
# student moving speed, calculated from the time
c_student_speed = int((c_width - c_redline_left) / c_student_time / c_fps)
# Probability of a student w/out mask
c_student_prob = 0.5
# time between two students
c_time_between = 1.5

# The cat attributes
c_cat_file = os.path.join(c_asset_folder, 'cat.png')
c_cat_width = c_width // 18
c_cat_height = c_cat_width
# time before the cat disappear
c_cat_die_time = 1.5
# distance the cat travels before disappearing
c_cat_die_dist = 40

# some time constant
c_hour_length = 5