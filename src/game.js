// Initialize the Phaser Game object and set default game window size
const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
})

// Declare shared variables at the top so all methods can access them
let damages = 100000
let damagesText
let vases
let cursors
let player

let titleScreen = true

let game_height = 1200
let game_width = 1200
let tile_size = 20
let border_size = 2*tile_size
let guardSpeed = 125

// declarations of rooms' x coordinates
let room1_x = room4_x = room7_x = 8*tile_size + border_size
let room2_x = room5_x = room8_x = 2*room1_x + 7*tile_size + border_size
let room3_x = room6_x = room9_x = room2_x + room1_x + 7*tile_size + border_size

// declarations of rooms' y coordinates
let room1_y = room2_y = room3_y = 9.5*tile_size
let room4_y = room5_y = room6_y = 2*room1_y + 8.5*tile_size + border_size
let room7_y = room8_y = room9_y = room1_y + room4_y + 6.5*tile_size + border_size

function preload () {
  game.load.audio('main_theme',['./music/Main Theme.mp3','./music/Main Theme.ogg'])
  game.load.audio('main_theme',['./music/Lose.mp3','./Music/Lose.ogg'])
  game.load.audio('main_theme',['./music/Win.mp3','./music/Win.ogg'])

  game.load.image('background', './background/tile.png')
  game.load.image('vase', './breakables/vase_broken.png')
  game.load.image('vase_fixed','./breakables/vase.png')
  game.load.spritesheet('mom', './sprites/mom/Mom Spritesheet (40x64).png', 40, 64)
  game.load.image('border_hor', './background/walls/border_horizontal.png')
  game.load.image('border_vert', './background/walls/border_vertical.png')
  game.load.image('wall_hor_7', './background/walls/border_hor_7.png')
  game.load.image('wall_vert_7', './background/walls/border_vert_7.png')
  game.load.image('wall_hor_20', './background/walls/border_hor_20.png')
  game.load.image('wall_vert_17', './background/walls/border_vert_17.png')
  game.load.spritesheet('guard','sprites/securityguard/Security Guard Spritesheet (40x64).png',40,64)
}

function create () {
  //If physics break down it might be because I removed arcade physics here

  //Our tile background hopefully not to be seen
  game.add.tileSprite(0, 0,1200,1200, 'background')
  game.world.setBounds(0,0,1200,1200)

  createWalls()

  // The player, guard and their settings
  player = game.add.sprite(64, 64, 'mom')


  guards = game.add.group()
  var guard = new Guard(game, room1_x, room1_y, guardSpeed)
  var guard2 = new Guard(game, room6_x, room6_y, guardSpeed)
  game.add.existing(guard)
  game.add.existing(guard2)

  //  We need to enable physics on the player
  game.physics.arcade.enable(player)

  player.body.collideWorldBounds = true

  //Set offset for hitbox so head can go through things: the offset has not yet worked
  player.body.setSize(2*tile_size, 2*tile_size, 0, tile_size)

  player.animations.add('down', [0,1,2,3,4,5,6,7], 20, false)
  player.animations.add('up',   [8, 9,10,11,12,13,14,15], 20, false)
  player.animations.add('right',   [16, 17, 18,19,20,21,22,23], 20, false)
  player.animations.add('left',   [24, 25, 26,27,28,29,30,31], 20, false)
  player.animations.add('upright',   [32,33,34,35,36,37,38,39], 20, false)
  player.animations.add('upleft',   [40,41,42,43,44,45,46,47], 20, false)
  player.animations.add('downright',   [48,49,50,51,52,53,54,55], 20, false)
  player.animations.add('downleft',   [56,57,58,59,60,61,62,63], 20, false)

  // guard.animations.add('down', [0,1,2,3,4,5,6,7], 20, true)
  // guard.animations.add('up',   [8, 9,10,11,12,13,14,15], 20, true)
  // guard.animations.add('right',   [16, 17, 18,19,20,21,22,23], 20, true)
  // guard.animations.add('left',   [24, 25, 26,27,28,29,30,31], 20, true)
  // guard.animations.add('upright',   [32,33,34,35,36,37,38,39], 20, true)
  // guard.animations.add('upleft',   [40,41,42,43,44,45,46,47], 20, true)
  // guard.animations.add('downright',   [48,49,50,51,52,53,54,55], 20, true)
  // guard.animations.add('downleft',   [56,57,58,59,60,61,62,63], 20, true)

  // Make the game camera follow the player
  game.camera.follow(player);

  //  Objects to fix!
  vases = game.add.group()

  //  Enable physics for any object that is created in this group
  vases.enableBody = true
  //  Create 12 vases evenly spaced apart
  for (var i = 0; i < 12; i++) {
    const vase = vases.create(i * 90 +30, Math.random()*1200, 'vase')
  }

  // Create the damages text
  damagesText = game.add.text(440, 450, '', { fontSize: '32px', fill: '#000'})

  damagesText.text = 'Damages Owed: $' + damages
  

  // Create the countdown timer
  //countdown = this.add.text(32,32)

  //  And bootstrap our controls
  cursors = game.input.keyboard.createCursorKeys()


  var mainTheme = game.add.audio('main_theme')
  mainTheme.play('',0,1,true)
}

// constructor for guards
Guard = function (game, x, y, speed) {
  Phaser.Sprite.call(this, game, x, y, 'guard')
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.collideWorldBounds = true
  this.enableBody = true
  this.animations.add('down', [0,1,2,3,4,5,6,7], 20, true)
  this.animations.add('up',   [8, 9,10,11,12,13,14,15], 20, true)
  this.animations.add('right',   [16, 17, 18,19,20,21,22,23], 20, true)
  this.animations.add('left',   [24, 25, 26,27,28,29,30,31], 20, true)
  this.animations.add('upright',   [32,33,34,35,36,37,38,39], 20, true)
  this.animations.add('upleft',   [40,41,42,43,44,45,46,47], 20, true)
  this.animations.add('downright',   [48,49,50,51,52,53,54,55], 20, true)
  this.animations.add('downleft',   [56,57,58,59,60,61,62,63], 20, true)
  this.body.collideWorldBounds = true
  this.body.velocity.x = speed
  this.body.velocity.y = 0
}

Guard.prototype = Object.create(Phaser.Sprite.prototype)
Guard.prototype.constructor = Guard

function update () {
  //  Setup collisions for the player, borders
  game.physics.arcade.collide(player,borders)

  //  Mom fixes vase if she touches it.
  game.physics.arcade.overlap(player, vases, fixVase, null, this)
  game.physics.arcade.overlap(player, guards, death, null, this)

  // game.physics.arcade.collide(guard, walls)
  game.physics.arcade.collide(player, guards)


  playerMovement()

  // Announce when your damages are finally at 0
  if (damages < 0) {
    alert('You\'re debt free! Thanks for playing!')
    damages = 0
  }
}

// updates guards
Guard.prototype.update = function (walls) {
  game.physics.arcade.collide(this, walls)

  moveGuard(this)
  catchMom(this)
}

function death(player,guard){
  alert("Got gaught!")
}

function moveGuard(guard) {
  let x = room3_x
  let y = room6_y



  if(guard.x >= room3_x) {
      guard.body.velocity.x = 0
      guard.body.velocity.y = guardSpeed
      guard.animations.play('down')
  }

  if(guard.x >= room6_x && guard.y >= room6_y) {
      guard.body.velocity.x = -guardSpeed
      guard.body.velocity.y = 0
      guard.animations.play('left')
  }

  if(guard.x <= room5_x && guard.y >= room5_y) {
      guard.body.velocity.x = 0
      guard.body.velocity.y = guardSpeed
      guard.animations.play('down')
  }

  if(guard.x <= room8_x && guard.y >= room8_y) {
      guard.body.velocity.x = -guardSpeed
      guard.body.velocity.y = 0
      guard.animations.play('left')
  }

  if(guard.x <= room7_x && guard.y >= room7_x) {
      guard.body.velocity.x = 0
      guard.body.velocity.y = -guardSpeed
      guard.animations.play('up')
  }

  if(guard.x <= room1_x && guard.y <= room1_y) {
      guard.body.velocity.x = guardSpeed
      guard.body.velocity.y = 0
      guard.animations.play('right')
  }
}

function fixVase(player, vase) {

  // TODO Fixes your object
  game.add.sprite(vase.x,vase.y,'vase_fixed')
  vase.destroy()


  // Alleviate your bank account
  damages -= 10000
  damagesText.text = 'Damages Owed: $' + damages
}

function catchMom(guard) {
   //moving right
   if(guard.body.velocity.x > 0) {
      if((player.x <= guard.x + 200 && player.x >= guard.x) && (player.y >= guard.y - 100 && player.y <= guard.y + 100))
         alert('You got caught!')
   }

   //moving left
   if(guard.body.velocity.x < 0) {
      if((player.x >= guard.x - 200 && player.x <= guard.x) && (player.y >= guard.y - 100 && player.y <= guard.y + 100))
         alert('You got caught!')
   }


   //moving up
   if(guard.body.velocity.y < 0) {
      if((player.x <= guard.x + 100 && player.x >= guard.x - 100) && (player.y >= guard.y - 200 && player.y <= guard.y))
         alert('You got caught!')
   }


   //moving down
   if(guard.body.velocity.y > 0) {
      if((player.x <= guard.x + 100 && player.x >= guard.x - 100) && (player.y >= guard.y && player.y <= guard.y + 200))
         alert('You got caught!')
   }
}

function playerMovement(){
  //  We want the player to stop when not moving
  player.body.velocity.x = 0
  player.body.velocity.y = 0
  if (cursors.up.isDown){
    //TEST TO SEE IF AUDIO WILL START
    if (game.sound.context.state === 'suspended') {
      game.sound.context.resume();
    }

    if (cursors.left.isDown) {
      player.animations.play('upleft')
      player.body.velocity.x = -100
      player.body.velocity.y = -100
    } else if (cursors.right.isDown) {
      player.animations.play('upright')
      player.body.velocity.x = 100
      player.body.velocity.y = -100
    } else {
      player.body.velocity.y = -125
      player.animations.play('up')
    }
  } else if(cursors.down.isDown){
      if (cursors.left.isDown) {
        player.animations.play('downleft')
        player.body.velocity.x = -100
        player.body.velocity.y = 100
      } else if (cursors.right.isDown) {
        player.animations.play('downright')
        player.body.velocity.x = 100
        player.body.velocity.y = 100
      } else {
        player.animations.play('down')
        player.body.velocity.y = 125
      }
  } else {
    if (cursors.left.isDown) {
      player.body.velocity.x = -125
      player.animations.play('left')
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 125
      player.animations.play('right')
    }
  }
  if(!cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown){
    player.animations.stop(null,true)
  }
}


function createWalls() {
  borders = game.add.group()
  borders.enableBody = true
  //walls.body.immovable = true

  let walls = borders.create(0, 0, 'border_hor')
  walls.body.immovable = true

  // creates borders around map
  walls = borders.create(0, game_height - border_size, 'border_hor')
  walls.body.immovable = true
  walls = borders.create(0, 0, 'border_vert')
  walls.body.immovable = true
  walls = borders.create(game_width - border_size, 0, 'border_vert')
  walls.body.immovable = true

  // museum is 3x3 rooms
  // rooms are numbered 1-9 (left to right, top to bottom)

  // left wall between rooms 1 and 4
  walls = borders.create(border_size, (18*tile_size) + border_size, 'wall_hor_7')
  walls.body.immovable = true
  // right wall between rooms 1 and 4
  walls = borders.create((11*tile_size) + border_size, (18*tile_size) + border_size, 'wall_hor_7')
  walls.body.immovable = true
  // top wall between rooms 1 and 2
  walls = borders.create((18*tile_size) + border_size, border_size, 'wall_vert_7')
  walls.body.immovable = true
  // bottom wall between rooms 1 and 2
  walls = borders.create((18*tile_size) + border_size, (11*tile_size) + border_size, 'wall_vert_7')
  walls.body.immovable = true
  // wall between rooms 2 and 5
  walls = borders.create((18*tile_size) + border_size, (18*tile_size) + border_size, 'wall_hor_20')
  walls.body.immovable = true
  // top wall between rooms 2 and 3
  walls = borders.create(game_width - (18*tile_size + 2*border_size), border_size, 'wall_vert_7')
  walls.body.immovable = true
  // bottom wall between rooms 2 and 3
  walls = borders.create(game_width - (18*tile_size + 2*border_size), (11*tile_size) + border_size, 'wall_vert_7')
  walls.body.immovable = true
  // left wall between rooms 3 and 6
  walls = borders.create(game_width - (18*tile_size + border_size), (18*tile_size) + border_size, 'wall_hor_7')
  walls.body.immovable = true
  // right wall between rooms 3 and 6
  walls = borders.create(game_width - (7* tile_size + border_size), (18*tile_size) + border_size, 'wall_hor_7')
  walls.body.immovable = true
  // left wall between 4 and 7
  walls = borders.create(border_size, game_height - (16*tile_size + 2*border_size), 'wall_hor_7')
  walls.body.immovable = true
  // right wall between 4 and 7
  walls = borders.create((11*tile_size) + border_size, game_height - (16*tile_size + 2*border_size), 'wall_hor_7')
  walls.body.immovable = true
  // top wall between 4 and 5
  walls = borders.create((18*tile_size) + border_size, (18*tile_size) + (2*border_size), 'wall_vert_7')
  walls.body.immovable = true
  // bottom wall between 4 and 5
  walls = borders.create((18*tile_size) + border_size, game_height - (23*tile_size + 2*border_size), 'wall_vert_7')
  walls.body.immovable = true
  // left wall between 5 and 8
  walls = borders.create((18*tile_size) + (2*border_size), game_height - (16*tile_size + 2*border_size), 'wall_hor_7')
  walls.body.immovable = true
  // right wall between 5 and 8
  walls = borders.create((29*tile_size) + (2*border_size), game_height - (16*tile_size + 2*border_size), 'wall_hor_7')
  walls.body.immovable = true
  // top wall between 5 and 6
  walls = borders.create(game_width - (18*tile_size + 2*border_size), (18*tile_size) + (2*border_size), 'wall_vert_7')
  walls.body.immovable = true
  // bottom wall between 5 and 6
  walls = borders.create(game_width - ((18*tile_size) + 2*border_size), game_height - (23*tile_size + 2*border_size), 'wall_vert_7')
  walls.body.immovable = true
  // left wall between 6 and 9
  walls = borders.create(game_width - ((18*tile_size) + border_size), game_height - (16*tile_size + 2*border_size), 'wall_hor_7')
  walls.body.immovable = true
  // right wall between 6 and 9
  walls = borders.create(game_width - ((7*tile_size) + border_size), game_height - (16*tile_size + 2*border_size), 'wall_hor_7')
  walls.body.immovable = true
  // top wall between 7 and 8
  walls = borders.create(18*tile_size + border_size, game_height - (16*tile_size + 2*border_size), 'wall_vert_7')
  walls.body.immovable = true
  // bottom wall between 7 and 8
  walls = borders.create(18*tile_size + border_size, game_height - (7*tile_size + border_size), 'wall_vert_7')
  walls.body.immovable = true
  // wall between 8 and 9
  walls = borders.create(game_width - (18*tile_size + 2*border_size), game_height - (16*tile_size + border_size), 'wall_vert_17')
  walls.body.immovable = true
}