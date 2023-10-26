class Game extends Phaser.Scene
{   
    container;
    player;
    lockText;
    
    mouse_y = 135;
    wall_x1 = 440;
    wall_x2 = 874;
    wall_y = 440;
    floor_x = 640;
    floor_y = 650;
    
    text;
    
    preload ()
    {
        // cherry -> strawberry -> grape -> dekopon -> orange -> apple -> pear -> peach -> pineapple -> melon -> watermelon 
        this.load.image('falco', 'assets/falco.png', { width: 30, height: 30 });   
        this.load.image('sheik', 'assets/sheik.png', { width: 40, height: 40 });
        this.load.image('ics', 'assets/ice-climbers.png', { width: 55, height: 55 });
        this.load.image('pikachu', 'assets/pikachu.png', { width: 65, height: 65 });
        this.load.image('fox', 'assets/fox.png', { width: 80, height: 80 });
        this.load.image('yoshi', 'assets/yoshi.png', { width: 105, height: 105 });
        this.load.image('jigglypuff', 'assets/jigglypuff.png', { width: 120, height: 120 });
        this.load.image('marth', 'assets/marth.png', { width: 150, height: 150 });
        this.load.image('kirby', 'assets/kirby.png', { width: 185, height: 185 } );
        this.load.image('luigi', 'assets/luigi.png', { width: 205, height: 205 });
        this.load.image('falcon', 'assets/falcon.png', { width: 230, height: 230 });
    
        this.load.image('wall', 'assets/wall.png');
        this.load.image('floor', 'assets/floor.png');
    
        this.load.image('hand', 'assets/sprites/hand.png');
    }
    
    create ()
    {
        this.cameras.main.backgroundColor.setTo(243, 194, 76);
    
        this.container = this.physics.add.staticGroup();
        this.container.create(this.wall_x1, this.wall_y, 'wall');
        this.container.create(this.wall_x2, this.wall_y, 'wall');
        this.container = this.physics.add.staticGroup();
        this.container.create(this.floor_x, this.floor_y, 'floor');

        this.balls = this.physics.add.group({
            key: 'falco'
        });
    
        this.sprite = this.add.sprite(657, this.mouse_y, 'hand').setScale(0.15);
    
        // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
        this.input.on('pointerdown', function (pointer)
        {
            this.input.mouse.requestPointerLock();
        }, this);
    
        // When locked, you will have to use the movementX and movementY properties of the pointer
        // (since a locked cursor's xy position does not update)
        this.input.on('pointermove', function (pointer)
        {
            if (this.input.mouse.locked)
            {
                this.sprite.x += pointer.movementX;
                this.sprite.y = this.mouse_y;
                // Force the sprite to stay on screen
                this.sprite.x = Phaser.Math.Wrap(this.sprite.x, this.wall_x1 - 2, this.wall_x2 - 2);
    
                this.sprite.setRotation(0);
                this.updateLockText(true);
    
                this.text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
                this.input.on('pointerdown', function (pointer)
                {
                    this.physics.add.image(this.sprite.x, this.mouse_y, 'falcon');
                }, this);
            }
        }, this);
        // Exit pointer lock when Q is pressed. Browsers will also exit pointer lock when escape is
        // pressed.
        this.input.keyboard.on('keydown-Q', function (event)
        {
            if (this.input.mouse.locked)
            {
                this.input.mouse.releasePointerLock();
            }
        }, this);
    
        // Optionally, you can subscribe to the game's pointer lock change event to know when the player
        // enters/exits pointer lock. This is useful if you need to update the UI, change to a custom
        // mouse cursor, etc.
        this.input.manager.events.on('pointerlockchange', event =>
        {
            this.updateLockText(event.isPointerLocked, this.sprite.x, this.sprite.y);
        });
        this.lockText = this.add.text(16, 16, '', {
            fontSize: '20px',
            fill: '#ffffff'
        });
    
        this.updateLockText(false);
    
        this.physics.add.collider(balls, container);
    }
    
    updateLockText (isLocked)
    {
        this.lockText.setText([
            isLocked ? 'The pointer is now locked!' : 'The pointer is now unlocked.',
            `Sprite is at: (${this.sprite.x},${this.sprite.y})`,
            'Press Q to release pointer lock.'
        ]);
    }

    update ()
    {
    }
};
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: Game
};

const game = new Phaser.Game(config);