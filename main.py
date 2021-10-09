import pygame as pg
import sys, time
from gvars import *
from entities import Player, Magic, Student, Cat

screen = None
redline = None
clock = None
player = None
magic_sprites = None
player_sprites = None
student_sprites = None
cat_sprites = None
font_fps = None
font_lose = None
text_lose = ""

time_between = c_time_between
student_speed = c_student_speed

def main():
    while True:
        mainPage()
        gameOn()
        gameOver()

def mainPage():
    pass

def gameOn():
    time_between = c_time_between
    student_speed = c_student_speed
    last_stu_time = 0
    clearGroup(student_sprites)
    clearGroup(cat_sprites)
    clearGroup(magic_sprites)

    while True:
        clock.tick(c_fps)
        for event in pg.event.get():
            if event.type == pg.QUIT:
                sys.exit()
            elif event.type == pg.MOUSEBUTTONDOWN:
                handleMouseDown()
        
        if time.time() - last_stu_time > time_between:
            student_sprites.add(Student(student_speed))
            last_stu_time = time.time()

        player_sprites.update()
        magic_sprites.update()
        student_sprites.update()
        cat_sprites.update()

        drawBackground()
        player_sprites.draw(screen)
        magic_sprites.draw(screen)
        student_sprites.draw(screen)
        cat_sprites.draw(screen)

        fps = clock.get_fps()
        fps = round(fps*10)/10
        surface = font_fps.render(str(fps), False, BLACK)
        screen.blit(surface, (10, 0))

        pg.display.flip()

        if checkCollide() or checkOmission():
            return

def gameOver():
    while True:
        clock.tick(c_fps)
        for event in pg.event.get():
            if event.type == pg.QUIT:
                sys.exit()
            elif event.type == pg.KEYDOWN:
                if event.key == pg.K_r:
                    return

        magic_sprites.update()
        student_sprites.update()
        cat_sprites.update()

        drawBackground()
        player_sprites.draw(screen)
        magic_sprites.draw(screen)
        student_sprites.draw(screen)
        cat_sprites.draw(screen)

        surface = font_lose.render(text_lose, False, BLACK, LIGHTGRAY)
        text_sz = surface.get_size()
        screen.blit(surface, ((c_width - text_sz[0])//2, (c_height - text_sz[1])//2))

        pg.display.flip()


def checkCollide():
    global student_sprites, magic_sprites, cat_sprites, text_lose
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
            text_lose = " You turn the wrong person into cat! "
    
    if gonnaLose:
        for student in student_sprites:
            student.speed = 0
    
    return gonnaLose

def checkOmission():
    global student_sprites, text_lose

    student_escaped = None
    for student in student_sprites:
        if student.escaped():
            text_lose = " You let no-mask person into classroom! "
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

def drawBackground():
    screen.fill((255,255,255))
    pg.draw.rect(screen, c_redline_color, redline)

def clearGroup(group):
    for item in group:
        item.kill()

def init():
    global screen, redline, clock, player, player_sprites, \
    student_sprites, magic_sprites, cat_sprites, font_fps, font_lose

    pg.init()
    pg.mouse.set_visible(False)
    magic_sprites = pg.sprite.Group()
    player_sprites = pg.sprite.Group()
    student_sprites = pg.sprite.Group()
    cat_sprites = pg.sprite.Group()

    font_fps = pg.font.SysFont('arial',20)
    font_lose = pg.font.SysFont('arial', 50)

    screen = pg.display.set_mode((c_width, c_height))
    pg.display.set_caption(c_game_name)
    redline = pg.Rect((c_redline_left, c_redline_top), (c_redline_width, c_redline_height))

    player = Player()
    player_sprites.add(player)

    clock = pg.time.Clock()

if __name__ == "__main__":
    init()
    main()