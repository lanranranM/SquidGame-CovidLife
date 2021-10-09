import pygame as pg
from pygame.sprite import Sprite
import random, time
from gvars import *

class Player(Sprite):
    def __init__(self):
        super().__init__()
        image = pg.image.load(c_player_file).convert_alpha()
        self.image = pg.transform.scale(image, (c_player_width, c_player_height))
        #self.image.set_colorkey(WHITE)
        self.rect = self.image.get_rect()
        self.rect.right = c_redline_left - 10
    
    def update(self):
        mouse_pos = pg.mouse.get_pos()
        self.rect.y = min(mouse_pos[1], c_height - c_player_height)

class Magic(Sprite):
    def __init__(self):
        super().__init__()
        self.image = pg.Surface([c_magic_width, c_magic_height])
        self.image.fill(WHITE)
        self.image.set_colorkey(WHITE)
        pg.draw.circle(self.image, c_magic_color, c_magic_center, c_magic_radius)

        self.rect = self.image.get_rect()
        mouse_pos = pg.mouse.get_pos()
        self.rect.x = c_redline_left
        self.rect.y = min(mouse_pos[1], c_height - c_player_height) + c_player_height//2 #to do

    def update(self):
        if self.rect.x <= c_width:
            self.rect.x += c_magic_speed
        else:
            self.kill() # Remove it to save memory

class Student(Sprite):
    def __init__(self, speed, good = None):
        super().__init__()
        self.speed = speed
        if good == None:
            good = (random.random() > c_student_prob)
        self.good = good

        fpath = c_student_good_file if good else c_student_file
        image = pg.image.load(fpath).convert_alpha()
        self.image = pg.transform.scale(image, (c_student_width, c_student_height))
        #self.image.set_colorkey(WHITE)

        self.rect = self.image.get_rect()
        self.rect.x = c_width - 20
        self.rect.y = random.randint(0, c_height - c_student_height)
    
    def update(self):
        self.rect.x -= self.speed
        if self.good and self.rect.right <= c_redline_left - 40:
            self.kill() # Safe!
        elif self.rect.right < 0:
            self.kill()
    
    def escaped(self):
        return (not self.good) and self.rect.x <= c_redline_left - 20
    
    def getCenter(self):
        return self.rect.center

class Cat(Sprite):
    def __init__(self, center):
        super().__init__()
        image = pg.image.load(c_cat_file).convert_alpha()
        self.image = pg.transform.scale(image, (c_cat_width, c_cat_height))
        #self.image.set_colorkey(WHITE)
        self.rect = self.image.get_rect()
        self.rect.center = center

        self.create_time = time.time()
        self.y_start = center[1]
    
    def update(self):
        timediff = time.time() - self.create_time
        if timediff > c_cat_die_time:
            self.kill()

        new_alpha = int((1 - timediff / c_cat_die_time)*255)
        ydiff = int(c_cat_die_dist * timediff / c_cat_die_time)
        self.image.set_alpha(new_alpha)
        self.rect.y = self.y_start - ydiff