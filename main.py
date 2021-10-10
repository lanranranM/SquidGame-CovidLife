import pygame as pg
import sys, time

from pygame import surface
from gvars import *
from entities import Player, Magic, Student, Cat, Banner, Night

screen = None
redline = None
clock = None
player = None
magic_sprites = None
player_sprites = None
student_sprites = None
cat_sprites = None
banner_sprites = None
night_sprites = None
font_score = None
score = 0
now_hour = 0
date = 1
layer_1 = None
layer_2 = None
ommision = False
collision = False

def main():
    while True:
        mainPage()
        gameOn()
        gameOver()

def mainPage():
    # pg.mixer.music.unload()
    # pg.mixer.music.load(c_bgm_start)
    pg.mixer.Channel(0).play(pg.mixer.Sound(c_bgm_start))
    screen.fill(BABY_BLUE)
    bg = pg.transform.scale(pg.image.load('assets/header.png'),(c_header_width,c_header_height))
    screen.blit(bg,(270,152))
    bg = pg.transform.scale(pg.image.load('assets/start_instr.png'),(c_instr_width,c_instr_height))
    screen.blit(bg,(350,380))
    bg = pg.image.load('assets/student_front1.png')
    screen.blit(bg,(150,450))
    bg = pg.image.load('assets/player_front1.png')
    screen.blit(bg,(360,450))
    bg = pg.image.load('assets/player_front2.png')
    screen.blit(bg,(520,450))
    bg = pg.image.load('assets/player_front3.png')
    screen.blit(bg,(680,450))
    bg = pg.image.load('assets/student_front2.png')
    screen.blit(bg,(840,450))
    bg = pg.transform.scale(pg.image.load('assets/cat.png'),(c_cat_width*2,c_cat_height*2))
    screen.blit(bg,(850,370))
    pg.display.flip()
    while True:
        for event in pg.event.get():
            if event.type == pg.QUIT or (event.type == pg.KEYDOWN and event.key == pg.K_q):
                pg.display.quit()
                pg.quit()
                sys.exit()
            if event.type == pg.KEYDOWN and event.key == pg.K_SPACE:
                return

def gameOn():
    global score, ommision,collision, now_hour, date

    time_between = c_time_between
    student_speed = c_student_speed
    last_stu_time = 0
    score = 0
    clearGroup(student_sprites)
    clearGroup(cat_sprites)
    clearGroup(magic_sprites)
    clearGroup(banner_sprites)
    clearGroup(night_sprites)
    time_last_hour = time.time()
    now_hour = 9

    animation_on = False
    animation_start = None
    animation_time = None
    animation_callback = None

    while True:
        clock.tick(c_fps)
        for event in pg.event.get():
            if event.type == pg.QUIT:
                sys.exit()
            elif event.type == pg.MOUSEBUTTONDOWN:
                handleMouseDown()
        
        if animation_on:
            if time.time() - animation_start > animation_time:
                animation_on = False
                if animation_callback != None:
                    animation_callback()
                animation_callback = None
        
        if not animation_on and (time.time() - last_stu_time > time_between):
            student_sprites.add(Student(student_speed))
            last_stu_time = time.time()
        
        if time.time() - time_last_hour > c_hour_length:
            now_hour += 1
            if now_hour > 12:
                now_hour -= 12
            time_last_hour = time.time()

            if now_hour == 10 or now_hour == 3:
                banner = Banner(now_hour)
                banner_sprites.add(banner)
                time_last_hour += c_banner_time
                time_between = c_time_between / 3
                
                animation_on = True
                animation_start = time.time()
                animation_time = c_banner_time

            elif now_hour == 6:
                night = Night()
                night_sprites.add(night)
                time_last_hour += c_student_time + c_night_time

                animation_on = True
                animation_start = time.time()
                animation_time = c_student_time + c_night_time

                def set_time():
                    global now_hour, date
                    nonlocal animation_on, animation_start, animation_time, time_last_hour
                    
                    banner = Banner("newday")
                    banner_sprites.add(banner)

                    time_last_hour += c_banner_time
                    now_hour = 9
                    date+=1

                    animation_on = True
                    animation_start = time.time()
                    animation_time = c_banner_time

                animation_callback = set_time
                

            else:
                time_between = c_time_between

        player_sprites.update()
        magic_sprites.update()
        student_sprites.update()
        cat_sprites.update()
        banner_sprites.update()
        night_sprites.update()

        drawBackground()
        magic_sprites.draw(screen)
        student_sprites.draw(screen)
        drawBackground(True)
        cat_sprites.draw(screen)
        player_sprites.draw(screen)
        banner_sprites.draw(screen)
        night_sprites.draw(screen)

        score_board = font_score.render('Score: {}'.format(score), False, BLACK)
        screen.blit(score_board, (950, 0))

        time_board = font_score.render('Time: {}:00'.format(now_hour), False, BLACK)
        screen.blit(time_board, (950, font_score.get_linesize()))

        date_board = font_score.render('The {}th day'.format(date), False, BLACK)
        screen.blit(date_board, (950, font_score.get_linesize()*2))

        pg.display.flip()

        collide_res = checkCollide()
        if collide_res < 0:
            collision = True
            return
        score += collide_res

        if checkOmission():
            ommision = True
            return

def gameOver():
    global score
    # pg.mixer.music.unload()
    # pg.mixer.music.load(c_bgm_end)
    # pg.mixer.music.play()
    pg.mixer.Channel(0).play(pg.mixer.Sound(c_bgm_end))
    while True:
        clock.tick(c_fps)
        for event in pg.event.get():
            if event.type == pg.QUIT or (event.type == pg.KEYDOWN and event.key == pg.K_q):
                pg.display.quit()
                pg.quit()
                sys.exit()
            elif event.type == pg.KEYDOWN and event.key == pg.K_SPACE:
                return
        if ommision == True:
            bg = pg.image.load('assets/endpg.png')
            screen.blit(bg,(0,0))
        elif collision == True:
            bg = pg.image.load('assets/endpg1.png')
            screen.blit(bg,(0,0))

        score_board = font_score.render('Score: {}'.format(score), False, BLACK)
        screen.blit(score_board, (500,290))

        pg.display.flip()

def drawBackground(layer2 = False):
    global layer_1, layer_2
    if layer2:
        screen.blit(layer_2,(0,0))
        return
    screen.blit(layer_1,(0,0))
    pg.draw.rect(screen, c_redline_color, redline)

def checkCollide():
    global student_sprites, magic_sprites, cat_sprites
    gonnaLose = False

    all_collide = pg.sprite.groupcollide(student_sprites, magic_sprites, False, False)

    for student in all_collide:
        magics = all_collide[student]
        for magic in magics:
            magic.kill()
        
        gonnaLose = gonnaLose or student.good
        cat = Cat(student.getCenter())
        cat_sprites.add(cat)
        student.kill()
              
    if gonnaLose:
        for student in student_sprites:
            student.speed = 0
        return -1
    
    return len(all_collide)

def checkOmission():
    global student_sprites

    student_escaped = None
    for student in student_sprites:
        if student.escaped():
            student_escaped = student
            break
    
    if student_escaped != None:
        for student in student_sprites:
            if student is not student_escaped:
                student.speed = 0
        return True
    return False


def handleMouseDown():
    global magic_sprites
    mouse_status = pg.mouse.get_pressed()
    if mouse_status[0] != 1: # not left button
        return
    
    magic = Magic()
    magic_sprites.add(magic)



def clearGroup(group):
    for item in group:
        item.kill()

def init():
    global screen, redline, clock, player, player_sprites, layer_1, layer_2,\
    student_sprites, magic_sprites, cat_sprites, font_score,\
    ommision, collision, banner_sprites, night_sprites

    pg.init()
    pg.mixer.init()
    pg.mouse.set_visible(False)
    screen = pg.display.set_mode((c_width, c_height))
    pg.display.set_caption(c_game_name)

    redline = pg.Rect((c_redline_left, c_redline_top), (c_redline_width, c_redline_height))

    magic_sprites = pg.sprite.Group()
    player_sprites = pg.sprite.Group()
    student_sprites = pg.sprite.Group()
    cat_sprites = pg.sprite.Group()
    banner_sprites = pg.sprite.Group()
    night_sprites = pg.sprite.Group()

    font_score = pg.font.SysFont('arial',20)
    font_score.set_bold(True)

    layer_1 = pg.image.load(c_bg_file).convert()
    layer_2 = pg.image.load(c_bg_file2).convert()

    player = Player()
    player_sprites.add(player)

    ommision = False
    collision = False

    clock = pg.time.Clock()

if __name__ == "__main__":
    init()
    main()