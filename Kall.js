function Kall(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);

    // stating position and velocity
    this.x = 200;
    this.y = 400;
    this.defVelX=5;
    this.velX=this.defVelX;
    this.velY=0;

    // width and height
    this.width = 170;
    this.height = 85;

    // Hæð og breidd á jump-spriteinum
    //this.jumpWidth = g_jumpSprite[0].width;
    //this.jumpHeight = g_jumpSprite[0].height;

    // Hæð og breidd á dash-spriteinum
    //this.dashWidth = g_dashSprite[0].width;
    //this.dashHeight = g_dashSprite[0].height;

    // gravity and force
    this.gravity = 0.5;
    this.jumpForce =- 15;

    // true if Kall is in the air, else false
    this.inAir = true;

    // jumpcounter counts down the amount of jums left
    this.jumpCounter = 2;

    //frameCounter is for the frames in sprite animation
    this.framecounter = 0;
    this.Jumpframecounter = 0;
    this.Dashframecounter = 0;

    // dash delay to make a short brake between dashes
    this.dashDelay = 0;        

    // is the unicorn exploding? true if it is, else false
    this.isExploding = false;

    // is kall dashing, if true gets extra speed else not
    this.isDashing = false;

    // number of frames we want to be dashing
    this.dashCounter = 20;

    // lives
    this.liveSize = 50;
    this.lives = 3;
    this.deaths = 0;
    this.hasLostLife = false;

    // Score
    //this.score = 0;
    //this.scoreSpeed = 2.5;

    // highscore
    this.highscore = [];
    this.nrOfTries = 0;

    this.type =  "Kall";

    // collision helper with shineCollide
    /*
    this.hasShineCombo = false;
    this.combo = 0;
    */
};


//=============
// ENTITY SETUP 
//=============
Kall.prototype = new Entity();


//=====
// KEYS 
//=====
Kall.prototype.KEY_JUMP= 'W'.charCodeAt(0); // jump up 
Kall.prototype.KEY_DASH= 'D'.charCodeAt(0); // fast speed forward, dashing
Kall.prototype.RESET= 'U'.charCodeAt(0);    // resets the game to starting position


//======
// AUDIO
//======
Kall.prototype.shineCatch = new Audio("sounds/rainbow.wav");
Kall.prototype.die = new Audio("sounds/explosion2.wav"); 


//===============
// UPDATE ROUTINE 
//===============
Kall.prototype.update = function(du){

    spatialManager.unregister(this);

    this.comboLifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    // controlling the dash delay
    // lowering the delay on each frame
    if (this.dashDelay > 0) {
      this.dashDelay--;
    }

    //set the xVel of the unicorn based on if
    //it is dashing or not
    this.setSpeed(du);
    this.defVelX+=0.003*du;
    //console.log(this.defVelX);
    if(this.inAir){
      this.Jumpframecounter+=0.378;
      if (this.Jumpframecounter>=26) {
        this.Jumpframecounter=31.1;
      }
    }
    else {
      this.framecounter+=1;
      this.framecounter%=25;
    }

    // if the unicorn is done exploding then kill it
    if (explode.done(g_explosionSprite.length, this.type)) {
      //this.kill();
      this.loseLife();
      //this.isExploding = false; 
    }

    // Check for hit entity, if its hit it checks wwhich side it is on and acts accordingly,
    // resets or is on the platform.
    this.handleKeys(du);
    this.applyAccel(0,this.gravity,du);
    this.collidesWith(du);

     //check if out of canvas
    if (this.y > g_canvas.height) {
      this.die.play();
      this.loseLife();
    }

    // Check for death
    if(this._isDeadNow){
      if (this.nrOfTries < 2) {
        this.highscore[this.nrOfTries] = score.currentScore;
      }
      this.nrOfTries++;
     // console.log(this.highscore);
      return entityManager.KILL_ME_NOW
    }
    //else register
    else
      spatialManager.register(this);

    // Update the score
    score.updateScore(du);

    // skoða þetta!!
    /*if (score.gotLastShine) {
      score.updateShine(du);
    }*/
    if (score.shineCollision) {
      while (score.lifeSpan < 0) {
        score.lifeSpan -= du;
      }
      score.lifeSpan = 1000 / NOMINAL_UPDATE_INTERVAL;
      score.shineCollision = false;
    }
    //this.score += Math.floor(this.scoreSpeed*du);
    //console.log(this.score);
    console.log(score.lifeSpan);
};


//======
// SPEED 
//======
Kall.prototype.setSpeed = function(du) {
  //is the unicorn dashing and is the dashcounter not zero?
    if (this.isDashing && this.dashCounter !== 0) {
      this.dashCounter--;         //dash for only 15 frames
      this.applyAccel(1,0,du) ;   //set velocity to more speed
      this.jumpCounter=1;         //unicorn can jump once after it has dashed
      this.velY=0;                // no vertical velocity while dashing
      this.Dashframecounter+=1;
      if (this.Dashframecounter>11) {
        this.Dashframecounter=11.1;
        this.Jumpframecounter=6;
      }
    //unicorn is not dashing anymore move as usual
    } else {
      this.isDashing = false;     //not dashing
      this.velX=this.defVelX;     //set velocity to normal speed
      this.dashCounter = 15;      //reset the dashCounter to 15 again
    }
};


//====================
// COLLISION FUNCTIONS 
//====================

// this is the main collision function
// it calls other functions to handle 
// different types of collisions
Kall.prototype.collidesWith = function(du){

    if (spatialManager.isHit(this.x+65, this.y+30,
      this.width-125, this.height-40).length != 0){              //þessar tölur fengum við út með því að prófa okkur áfram í render á spatial manager
        var ent = spatialManager.isHit(this.x+65, this.y+30,     //Þær gera collideboxið hjá einhyrningnum minna, munu koma 2-3 fyrir aftur í platformcollide
          this.width-125, this.height-40);                    

        for(i=0 ; i < ent.length; i++){
          if(ent[i].getType() === "Gem"){                // collision with the gem
            this.gemCollide(ent[i]);                     // handle collision
            this.jumpCounter = 1;                        // you get one more jump
            this.dashDelay = 0;                          // dash is not limited
            this.isDashing = false;                      // stop dashing if we hit Gem
          } else if (ent[i].getType() === "Platform"){   // collision with the platform
            this.platformCollide(ent[i]);                // handle collision
            this.dashDelay = 0;                          // dash is not limited
          } else if (ent[i].getType() === "Shine") {     // collision with shine
            this.shineCollide(ent[i], du);                   // handle collision
          }
        }
    } else {
        this.inAir=true;
    }
};


// this handles when the unicorn and 
// the gem collide
Kall.prototype.gemCollide = function(gem){

  //if we dash into the gem the gem explodes
  if (this.isDashing) {
    g_sounds.starExplosion.play();
    g_sounds.starExplosionExtra.play();

    score.counter = 0;

    score.gemCollision = true;
    score.gotLastGem = true;
    score.calculateGemCombo();
    gem.explodes();
    //score.gemCollision = false;
  //else the unicorn is exploding and will lose life
  } else  {
    this.defVelX = 0;         // "stop" the game
    this.velY = 0;            // -''-
    this.isExploding = true;  // the unicorn is exploding
    g_sounds.uniExplosion.play();
  }
};


// this handles unicorn collision with platforms
Kall.prototype.platformCollide = function(entity){
    //where are we colliding with platform?
    var posX = entity.getPos().posX+20;         //Ég breytti platform collide boxinu
    var posY = entity.getPos().posY*1.035;      //til þess að þetta looki meira smooth
    var eWidth = entity.getWidth()-30;          //Breytti því líka þegar X er togglað
    var eHeight = entity.getHeight()*0.6;
    var x = this.x+65;
    var y = this.y+30;
    var w = this.width-125;
    var h = this.height-40;

    //LEFT EDGE - character should explode and lose a life
    if (x < posX  &&  y+h >= posY+12)  //Gerði y coord til að collisionið sé
    /*&& this.x+this.width-5 < entity.getPos().posX)*/                            //meira forgiving utaf collisionið er stundum ekkert
    {                                                                             // alltor nakvæmt miðað við platforms
      while (Math.floor(x+w) > posX) {
        this.x--;
        x = this.x + 70;
      }

      //this.die.play();
      this.defVelX = 0;         // "stop" the game
      this.velY = 0;            // -''-
      this.isExploding = true;  // the unicorn is exploding
      g_sounds.uniExplosion.play();
      return;
      
    }

    //TOP EDGE - character should run on platform
    else if (y < posY)
    {
        //make sure to drag it out of the ground if it
        //went to far on the last frame
        while(Math.floor(y+h) > posY+eHeight)
        {
          this.y--;
          var y=this.y+30;
        }
        this.y = posY-this.height-(30-40);   //y and height difference
        this.velY=0;
        this.jumpCounter=2;
        this.inAir=false;
    }

    //BOTTOM EDGE - character should stop rising and start falling
    else if (y+h >
        posY + eHeight)
    {

        //make sure to drag it out of the ground if it
        //went to far on the last frame
        while(Math.floor(y) < posY+eHeight)
        {
          this.y++;
          var y=this.y+30;
        }
        this.velY*=-0.5;
        // TODO ÞEGAR AÐ DASH ER KOMIÐ ÞARF AÐ SKODÐA ÞETTA BETUR
        // ERFITT AÐ EIGA VIÐ BOTNINN NÚNA.
    }
};


// this handles collision with the shine
// and unicorn
Kall.prototype.shineCollide = function (shine, du) {

  //TODO LAGA ÞETTA ÞANNIG AÐ COMBO DETTI ÚT.

      //console.log(this.hasShineCombo);
      this.hasShineCombo = true;

      var xNow = this.x;
      var yNow = this.y;

      score.counter = 0;

    //if (score.shineCollision) {
     //score.drawShineCombo(g_ctx, xNow, yNow);

     score.drawGemCombo(g_ctx, xNow, yNow);
    //score.shineCollision = false;
  //}
      score.lifeSpan -= du;
      
     // console.log(this.score);
    g_sounds.rainbow.play(); 

    score.shineCollision = true;
    score.gotLastShine = true;
    score.calculateShineCombo();
    shine.kill();
};
//========================
// COLLISION FUNCTIONS END
//========================


//==========
// LOSE LIFE
//==========
Kall.prototype.loseLife = function () {
      
    //this.die.play();
    //this.drawFailScreen();
    entityManager.didDie = true;
    Background.hasLostLife = true;

    console.log(this.deaths);

    // Put the score the player got for the current try in the
    //  array that holds all three scores for the three tries.
    score.allScores[this.deaths] = score.currentScore;
    score.currentScore = 0;
    console.log(score.allScores);

    this.lives--;
    this.deaths++;

    score.shineCombo = 0;
    score.gemCombo = 0;

    score.shineInRow = 0;
    score.gemsInRow = 0;

    if (this.lives === 0) {
        g_sounds.gameOver.play();
        this.kill();
        //hasGameEnded = true;
        main.gameOver();
      // TODO
      // Play game over sound
    }

    else {
      entityManager.reset();
      this.defVelX=5;
      this.y =200;
      this.x =500;
      this.isExploding = false; 
    }

};


//=================
// HANDLE KEY PRESS
//=================
Kall.prototype.handleKeys = function(du){

    if (eatKey(this.KEY_JUMP)) {
      if (this.jumpCounter!==0) {
        if(!this.inAir) g_sounds.jump.play();
        this.Jumpframecounter=0;
        this.velY=0;
        this.jumpCounter-=1;
        this.inAir=true;
        this.applyAccel(0,this.jumpForce, du);
      }
    }
    if (eatKey(this.RESET)||this.y>g_canvas.height) {
      this.x=200;
      this.y=400;
      this.velY=0;
    }
    // the dashDelay stops 'abuse' of the dash
    // element. There is slight delay for the 
    // next possible dash.
    if (eatKey(this.KEY_DASH) && this.dashDelay === 0) {
      g_sounds.dash.play();
      
      this.isDashing = true;      //more speed access
      this.Dashframecounter=0;
      this.dashDelay = 70;        // the frames to wait for next dash 
    }
};


//=============
// ACCELERATION 
//=============
Kall.prototype.applyAccel= function(accelX,accelY,du){
  // u=original velocity

  var oldVelY= this.velY;
  var oldVelX= this.velX;
  //v = u + at

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
Kall.prototype.drawLives = function(ctx) {
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
  this.x=200;
  this.y=400;
};


//============
// GET defVelX
//============
Kall.prototype.getDefVelX = function(){
  return this.defVelX;
}


//===============
// RENDER FUCTION 
//===============
Kall.prototype.render = function(ctx) {

  if (main._isGameOver) return;

  if (this.isExploding) {
      // this draws the explosion
      explode.draw(ctx,this.x,this.y,this.width,this.height,g_explosionSprite, this.type);
      // this increases the framecount for the explosion animation
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
  
  this.drawLives(ctx);
  score.drawScore(ctx);

  //console.log(score.gotLastShine);

  var xNow = camera.getPos().PosX;
  var yNow = camera.getPos().posY;

   if (score.gemCollision) {
    score.drawGemCombo(ctx, xNow, yNow);
  }
};
