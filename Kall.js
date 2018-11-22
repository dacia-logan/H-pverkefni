// =======
// UNICORN
// =======

function Kall(descr) {

    // Common inherited setup logic from Entity.
    this.setup(descr);

    // Starting position and velocity.
    this.x = 200;
    this.y = 400;
    this.defVelX=9;
    this.velX=this.defVelX;
    this.velY=0;
    this.dashAccel=0.5;
    this.accelX=0;
    this.accelY=0;
    this.Speedup=0.0025;

    // Width and height of the unicorn.
    this.width = 170;
    this.height = 85;

    // Gravity and force.
    this.gravity = 0.5;
    this.jumpForce =- 15;

    // true if Kall is in the air, else false.
    this.inAir = true;

    // Jumpcounter counts down the amount of jumps left.
    this.jumpCounter = 2;

    // Framecounter is for the frames in the sprite animation.
    this.framecounter = 0;
    this.Jumpframecounter = 0;
    this.Dashframecounter = 0;

    // Dash delay to make a short brake between dashes.
    this.dashDelay = 0;

    // Is the unicorn exploding? true if it is, else false.
    this.isExploding = false;

    // Is Kall dashing? If true it gets extra speed, else not.
    this.isDashing = false;

    // Number of frames we want to be dashing.
    this.dashCounter = 20;

    // Lives.
    this.liveSize = 50;
    this.lives = 3;
    this.deaths = 0;

    // highscore
    //this.highscore = [];
    //this.nrOfTries = 0;

    this.type =  "Kall";


    this.stopDashingCountUp = 0;
    this.wasCollidingGem = false;
    this.savePrevDefVel = 0;
};


//=============
// ENTITY SETUP
//=============
Kall.prototype = new Entity();

//=====
// KEYS
//=====
Kall.prototype.KEY_JUMP= 'W'.charCodeAt(0); // Jump up.
Kall.prototype.KEY_DASH= 'D'.charCodeAt(0); // Fast speed forward, dashing.
Kall.prototype.RESET= 'U'.charCodeAt(0);    // Resets the game to starting position.


//======
// AUDIO
//======
Kall.prototype.shineCatch = new Audio("sounds/rainbow.wav");
Kall.prototype.die = new Audio("sounds/explosion2.wav");


//===============
// UPDATE ROUTINE
//===============
Kall.prototype.update = function (du) {

    spatialManager.unregister(this);

    // Controlling the dash delay, lowering the delay on each frame.
    if (this.dashDelay > 0) {
      this.dashDelay--;
    }

    //set the xVel of rethe unicorn based on if
    //it is dashing or not
    this.defVelX+=this.Speedup*du;
    if(this.inAir){
      this.Jumpframecounter+=0.378;
      if (this.Jumpframecounter>=26) {
        this.Jumpframecounter=31.1;
      }
    } else {
      this.framecounter += 1;
      this.framecounter %= 25;
    }

    // If the unicorn is done exploding, it loses a life.
    if (explode.done(g_explosionSprite.length, this.type)) {
      this.loseLife();
    }

    if (this.wasCollidingGem === true) {
      this.stopDashingCountUp++;
      this.handleAfterCollisionGem(du);
    }

    // Check for hit entity, if its hit it checks wwhich side it is on and acts accordingly,
    // resets or is on the platform.
    this.handleDash(du);
    this.Physics(this.accelX,this.accelY,du);
    this.collidesWith(du);

    // Check if out of canvas.
    if (this.y > g_canvas.height) {
      g_sounds.uniExplosion.play();
      this.loseLife();
    }

    // Check for death.
    if (this._isDeadNow) {
      if (this.nrOfTries < 2) {
        //this.highscore[this.nrOfTries] = score.currentScore;
      }
      this.nrOfTries++;
      return entityManager.KILL_ME_NOW
    }
    // Else register.
    else {
      spatialManager.register(this);
    }

    // Update the score
    score.updateScore(du);
};

Kall.prototype.getLives = function () {
  return this.lives;
}

//====================
// COLLISION FUNCTIONS
//====================

// This is the main collision function, it calls other functions
//    to handle different types of collisions.
Kall.prototype.collidesWith = function (du) {

  // We got these numbers that we add and subtract
  // by exploring in render() in spatialManager.
    if (spatialManager.isHit(this.x+65, this.y+30,
      this.width-125, this.height-40).length != 0) {
        var ent = spatialManager.isHit(this.x+65, this.y+30,
          this.width-125, this.height-40);

        for (i=0 ; i < ent.length; i++) {
          if(ent[i].getType() === "Gem"){                // Collision with the gem.
            score.gemCounter = 0;                        // Controlls the position handling for the score.
            this.wasCollidingGem = true;
            this.gemCollide(ent[i]);                     // Handle collision.
            this.jumpCounter = 1;                        // You get one more jump.
            this.dashDelay = 0;                          // Dash is not limited.

            //this.isDashing = false;                      // Stop dashing if we hit gem.
          } else if (ent[i].getType() === "Platform"){   // Collision with the platform.
            this.platformCollide(ent[i]);                // Handle collision.
            this.dashDelay = 0;                          // Dash is not limited.
          } else if (ent[i].getType() === "Shine") {     // Collision with shine.
            score.shineCounter = 0;                      // Controlls the position handling for the score.
            this.shineCollide(ent[i]);                   // Handle collision.
          }
        }
    } else {
        this.inAir = true;
    }
};


// Handles when the unicorn and the gem collide.
Kall.prototype.gemCollide = function (gem) {
  // If we dash into the gem the gem explodes.
  if (this.isDashing) {
    g_sounds.starExplosion.play();
    g_sounds.starExplosionExtra.play();
    score.gotLastGem = true;
    score.calculateGemCombo();
    gem.explodes();

  // Else the unicorn is exploding and will lose life
  } else {
    this.defVelX = 0;               // "stop" the game.
    this.velY = 0;                  // -||-
    this.isExploding = true;        // The unicorn is exploding.
    g_sounds.uniExplosion.play();
  }
};


// Handles when the unicorn collides with the platforms.
Kall.prototype.platformCollide = function (entity) {
    // Where are we colliding with platform?
    var posX = entity.getPos().posX+20;             // Þessar tölur fengum við með þvi að
    var posY = entity.getPos().posY*1.035;          // nota render i spatialManager þar sem
    var eWidth = entity.getWidth()-30;              // við gerðum collision boxið eins og við
    var eHeight = entity.getHeight()*0.6;           // vildum hafa það.
    var x = this.x+65;
    var y = this.y+30;                              // þessar lika
    var w = this.width-125;
    var h = this.height-40;

    // LEFT EDGE - character should explode and lose a life.
    if (x < posX  &&  y + h >= posY + 12) {
      while (Math.floor(x+w) > posX) {
        this.x--;
        x = this.x + 70;
      }
      this.defVelX = 0;                  // "stop" the game.
      this.velY = 0;                     // -||-
      this.isExploding = true;           // The unicorn is exploding.
      g_sounds.uniExplosion.play();
      return;
    }

    // TOP EDGE - character should run on platform.
    else if (y < posY) {
        // Make sure to drag it out of the ground if it
        //    went too far on the last frame.
        while (Math.floor(y+h) > posY+eHeight) {
          this.y--;
          y = this.y+30;
        }
        this.dashDelay=0;
        this.y = posY - this.height - (30-40);   //y and height difference
        this.velY = 0;
        this.jumpCounter = 2;
        this.inAir = false;
    }

    // BOTTOM EDGE - character should stop rising and start falling.
    else if (y + h > posY + eHeight) {
        // Make sure to drag it out of the ground if it
        //    went too far on the last frame.
        while (Math.floor(y) < posY + eHeight) {
          this.y++;
          y = this.y+30;
        }
        this.velY *= -0.5;

    }
};


// Handles collision between the shine and the unicorn.
Kall.prototype.shineCollide = function (shine) {
    g_sounds.rainbow.play();
    score.gotLastShine = true;
    score.calculateShineCombo();
    shine.kill();
};


Kall.prototype.handleAfterCollisionGem = function(du) {
  // when 3 frames have past since we collided with the gem
  // stop for 3 frames and on the next frame stop dashing
  // but resume the old velocity

  if (this.stopDashingCountUp === 3) {
      this.savePrevDefVel = this.defVelX;
      this.savePrevVelX = this.velX;
      this.velX = 0;
      this.defVelX = 0;
  }
  if (this.stopDashingCountUp === 6) {
    this.isDashing = false;
    this.velX = this.savePrevVelX;
    this.defVelX = this.savePrevDefVel;
    this.wasCollidingGem = false;
    this.stopDashingCountUp = 0;
  }
};


//========================
// COLLISION FUNCTIONS END
//========================


//==========
// LOSE LIFE
//==========
Kall.prototype.loseLife = function () {
    entityManager.didDie = true;
    Background.hasLostLife = true;

    // Put the score the player got for the current try in the
    //  array that holds all three scores for the three tries.
    score.allScores[this.deaths] = score.currentScore;
    score.currentScore = 0;

    this.lives--;
    this.deaths++;

    // Reset the combo variables.
    score.shineCombo = 0;
    score.gemCombo = 0;

    score.shineInRow = 0;
    score.gemsInRow = 0;

    if (this.lives === 0) {
        entityManager.gameOver = true;
    } else {
      entityManager.reset();
      this.defVelX = 5;
      this.y = 200;
      this.x = 500;
      this.isExploding = false;
    }
};


//=================
// HANDLE KEY PRESS
//=================
Kall.prototype.handleJump = function () {
  if (eatKey(this.KEY_JUMP)) {
    if (this.jumpCounter!==0) {
      if(!this.inAir) g_sounds.jump.play();
      this.Jumpframecounter=0;
      this.velY=0;
      this.jumpCounter-=1;
      this.inAir=true;
      return this.jumpForce;
    }
    else return 0;
  }
  else return 0;
};

// Used in handle dash, plays different audio objects with the same sound
Kall.prototype.dashSoundi=0;

Kall.prototype.handleDash = function(du){
    // the dashDelay stops 'abuse' of the dash
    // element. There is slight delay for the
    // next possible dash.
    if (eatKey(this.KEY_DASH) && this.dashDelay === 0) {
        
        if(this.dashSoundi===0){
          g_sounds.dash.play();
        }
        else if(this.dashSoundi===1){
          g_sounds.dash1.play();
        }
        else if(this.dashSoundi===2){
          g_sounds.dash2.play();
        }
        else if(this.dashSoundi===3){
          g_sounds.dash3.play();
        }
        this.dashSoundi++;
        if(this.dashSoundi===4){
          this.dashSoundi=0;
        }
      this.isDashing = true;      // More speed access.
      this.Dashframecounter = 0;
      this.dashDelay = 70;        // The frames to wait for next dash.
    }
    //is the unicorn dashing and is the dashcounter not zero?
      if (this.isDashing && this.dashCounter > 0) {
        this.dashCounter=this.dashCounter-1*du;      //dash for only 15 frames
        this.jumpCounter=1;                       //unicorn can jump once after it has dashed
        this.velY=0;                          // no vertical velocity while dashing
        this.Dashframecounter+=1;
        this.accelX+=this.dashAccel;
        if (this.Dashframecounter>11) {
          this.Dashframecounter=11.1;
        }
        this.Jumpframecounter=6;
      //unicorn is not dashing anymore move as usual
      } else {
        this.isDashing = false;     //not dashing
        this.velX=this.defVelX;     //set velocity to normal speed
        this.dashCounter = 15;
        this.accelX=0;    //reset the dashCounter to 15 again
      }
};


//=============
// Physics
//=============
Kall.prototype.Physics= function(accelX,accelY,du){
  var jumpforce=this.handleJump();
  accelY=jumpforce+this.gravity;
  this.applyAccel(accelX,accelY,du);
};

Kall.prototype.applyAccel= function(accelX,accelY,du){
  // u=original velocity

  var oldVelY= this.velY;
  var oldVelX= this.velX;
  // v = u + at

  this.velY += accelY * du;
  this.velX += accelX * du;
  // v_ave = (u + v) / 2

  var aveVelY = (oldVelY + this.velY) / 2;
  var aveVelX = (oldVelX + this.velX) / 2;
  // s = s + v_ave * t

  this.y += aveVelY*du;
  this.x += aveVelX*du;
};


//===========
// DRAW LIVES
//===========
// Draw the unicorns at the top left corner of the screen which represents
//  how many lives the player has left.
Kall.prototype.drawLives = function (ctx) {
  // Space between the unicorns.
  var livesOffset = 55;

  // Draw as many unicorns as lives the player has left.
  for (var i = 0; i < this.lives; i++) {
    g_sprites.alive.drawAtAndEnlarge(ctx, camera.getPos().posX+15 + livesOffset * i,
                                      camera.getPos().posY+20, this.liveSize, this.liveSize);
  }

  // Draws as many "dead" unicorn as lives the player has lost, next to the ones he has left.
  for (var j = 0; j < this.deaths; j++) {
    g_sprites.dead.drawAtAndEnlarge(ctx, camera.getPos().posX+125 - livesOffset * j,
                                      camera.getPos().posY+20, this.liveSize, this.liveSize);
  }
};


//===============
// RESET FUNCTION
//===============
Kall.prototype.reset = function() {
  this.x = 200;
  this.y = 400;
};

Kall.prototype.resetGameOver = function () {
  this.x = 200;
  this.y = 400;
  this.lives = 3;
  this.deaths = 0;
};
//============
// GET defVelX
//============
Kall.prototype.getDefVelX = function (){
  return this.defVelX;
};

//===============
// RENDER FUCTION
//===============
Kall.prototype.render = function (ctx) {

  if (main._isGameOver) return;

  if (this.isExploding) {
      // Draw the explosion.
      explode.draw(ctx,this.x,this.y,this.width,this.height,g_explosionSprite, this.type);
      // Increase the framecount for the explosion animation.
      explode.frames(this.type,g_explosionSprite.length);
  } else {
    if (this.isDashing) {
      g_dashSprite[Math.floor(this.Dashframecounter)].drawAtAndEnlarge(ctx,this.x-150,this.y,this.width+150,this.height);
    } else if (this.inAir) {
      g_jumpSprite[Math.floor(this.Jumpframecounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width-20,this.height+20);
    } else {
      g_runSprite[Math.floor(this.framecounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }
  }

  // Draw the lives and the score on the canvas.
  this.drawLives(ctx);
  score.drawScore(ctx);

  // Draw the text that appears when you get a shine/hit a gem.
  score.drawShineCombo(ctx, this.x, this.y);
  score.drawGemCombo(ctx, this.x, this.y);
};
