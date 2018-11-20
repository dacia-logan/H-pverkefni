// =====
// SCORE
// =====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var score = {
    // Counter for the score and variable for how fast it should go up.
    currentScore : 0,
    scoreSpeed : 2.5,

    // Array that stores the score for each of the three tries the player gets.
    allScores : [],
    highScores : [],

    // Variables for the combos, what the current combo is, how many combos the
    //    player has got in a row.
    shineCombo : 0,
    shineInRow : 0,

    gemCombo : 0,
    gemsInRow : 0,

    // Did the player get the last shine/last gem?
    gotLastShine : false,
    gotLastGem : false,


    // controlls the position handling when we want to draw
    gemCounter : 0,      
    shineCounter : 0,

    // the positions for the scores when the counters 
    // are zero 
    shineX : 0,   
    shineY : 0,  

    gemX : 0,     
    gemY : 0,    

    updateScore : function (du) {
      // Update the score
      this.currentScore += Math.floor(this.scoreSpeed * du);
    },

    updateShine : function (du) {
      // Decrease the lifespan.
      while (this.lifeSpan >= 0) {
        this.lifeSpan -= du;
      }

      if (this.lifeSpan < 0) { // óþörf if-setning?
        this.lifeSpan = 1000 / NOMINAL_UPDATE_INTERVAL;
        return;
      }
      //console.log(this.lifeSpan);
    },

    reset : function(){
        this.currentScore=0;
        this.scoreSpeed=2.5;
        this.allScores=[];
        this.shineCombo=0;
        this.shineInRow=0;
        this.gemCombo=0;
        this.gemsInRow=0;
        this.gotLastShine=false;
        this.gotLastGem=false;
        this.gemCounter=0;
        this.shineCounter=0;
        this.shineX=0;
        this.shineY=0;
        this.gemX=0;
        this.gemY=0;
    },

    calculateShineCombo : function () {
      if (this.gotLastShine) {
        this.shineInRow++;
        this.shineCombo += 10;
        this.currentScore += this.shineCombo;
        //console.log(this.shineInRow);
        //console.log(this.shineCombo);
      } else if (!this.gotLastShine) {
        //this.shineInRow = 1;
        //this.shineCombo = 0; // 10?
        this.currentScore += this.shineCombo;
      }
    },

    calculateGemCombo : function () {
      if (this.gotLastGem) {
        this.gemsInRow++;
        this.gemCombo += 100;
        this.currentScore += this.gemCombo;
        //console.log(this.gemsInRow);
        //console.log(this.gemCombo);
      } else if (!this.gotLastGem) {
       //  this.gemsInRow = 1;
       // this.gemCombo = 0;
        this.currentScore += this.gemCombo;
      }
    },

    drawShineCombo : function (ctx, xPos, yPos) {
  
      // if the conter is 0 we want to fetch the 
      // position sent to the function, else we
      // ceep the previous position (that is 0)
      if (this.shineCounter === 0) {
        this.shineX = xPos + 400; 
        this.shineY = yPos - 60; 
      }

      // increment the counter so next time 
      // we dont fetch a new position
      this.shineCounter++; 

      ctx.font = "bold 30px Consolas";
      ctx.textAlign = "center";

      // Color of the combo text
      ctx.fillStyle = "white";
    
      // Color of the shadow
      ctx.shadowColor = '#1c5e66';
      ctx.shadowBlur = 40;

      //var fadeThresh = this.lifeSpan / 3;

      /*
      if (this.lifeSpan < fadeThresh) {
          ctx.globalAlpha = this.lifeSpan / fadeThresh;
      }
      */

      // if the combo is 0 we dont want to draw 
      // else we want to draw the combo points
      if (this.shineCombo === 0) ctx.fillText("", this.shineX, this.shineY);
      else ctx.fillText("+" + this.shineCombo, this.shineX, this.shineY);
      
      ctx.fill();

      //ctx.globalAlpha = 1;

      // Make sure the shadow is only applied to the combo
      ctx.shadowBlur = 0;
      // ef það er liðin sekúnda, þá gerist þetta ->
      //this.shineCollision = false;
    },

    drawGemCombo : function (ctx, xPos, yPos) {

      // if the conter is 0 we want to fetch the 
      // position sent to the function, else we
      // ceep the previous position (that is 0)
      if (this.gemCounter === 0) {
        this.gemX = xPos + 400; 
        this.gemY = yPos - 60; 
      }

      // increment the counter so next time 
      // we dont fetch a new position
      this.gemCounter++;


      ctx.font = "bold 30px Consolas";
      ctx.textAlign = "center";

      // Color of the combo text
      ctx.fillStyle = "white";
    
      // Color of the shadow
      ctx.shadowColor = '#1c5e66';
      ctx.shadowBlur = 40;

      //var fadeThresh = this.lifeSpan / 3;

      /*
      if (this.lifeSpan < fadeThresh) {
          ctx.globalAlpha = this.lifeSpan / fadeThresh;
      }
      */

      // if the combo is 0 we dont want to draw 
      // else we want to draw the combo points
      if (this.gemCombo === 0) ctx.fillText("", this.gemX, this.gemY);
      else ctx.fillText("+" + this.gemCombo, this.gemX, this.gemY);
      
      ctx.fill();

      //ctx.globalAlpha = 1;

      // Make sure the shadow is only applied to the combo
      ctx.shadowBlur = 0;

      //this.shineCollision = false;
    },

    drawScore : function (ctx) {
      ctx.font = "bold 40px Consolas";
      ctx.textAlign = "center";
    
      // Color of the score
      ctx.fillStyle = "white";
    
      // Color of the shadow
      ctx.shadowColor = '#1c5e66';
      ctx.shadowBlur = 40;
    
      // Draw the score if the game is not over
      if (!entityManager.gameOver) {
        ctx.fillText(this.currentScore, g_canvas.width / 2 + camera.getPos().posX - 20,
                                70 + camera.getPos().posY);
      } else if (entityManager.gameOver) {
        // VIRKAR EKKI, IMPLEMENTA Á ANNAN HÁTT
        ctx.fillText("You got " + this.currentScore + "points", g_canvas.width / 2 - 20, 70);
      }
    
      ctx.fill();
    
      // Make sure the shadow is only applied to the score
      ctx.shadowBlur = 0;
    },

    drawScoreBoard : function(ctx){
      
        camera.reset(ctx);
        g_sprites.gameover.drawAtAndEnlarge(ctx,0,0,g_canvas.width,g_canvas.height);
        g_sprites.rainbowbg.drawAtAndEnlarge(ctx,0,0,g_canvas.width,g_canvas.height);
        
        ctx.globalAlpha = 0.5;
        
        // Yellow stars
        g_sprites.stars1.drawAtAndEnlarge(ctx,5,350,100,100);
        g_sprites.stars1.drawAtAndEnlarge(ctx,50,40,120,120);
        g_sprites.stars1.drawAtAndEnlarge(ctx,570,250,110,110);
        g_sprites.stars1.drawAtAndEnlarge(ctx,870,450,80,80);

        // Purple stars
        g_sprites.stars2.drawAtAndEnlarge(ctx,200,300,130,130);
        g_sprites.stars2.drawAtAndEnlarge(ctx,350,150,130,130);
        g_sprites.stars2.drawAtAndEnlarge(ctx,650,550,140,140);
        g_sprites.stars2.drawAtAndEnlarge(ctx,700,350,100,100);

        // Pink stars
        g_sprites.stars3.drawAtAndEnlarge(ctx,80,220,140,140);
        g_sprites.stars3.drawAtAndEnlarge(ctx,270,420,130,130);
        g_sprites.stars3.drawAtAndEnlarge(ctx,385,30,130,130);
        g_sprites.stars3.drawAtAndEnlarge(ctx,660,150,100,100);
        g_sprites.stars3.drawAtAndEnlarge(ctx,610,500,90,90);
        g_sprites.stars3.drawAtAndEnlarge(ctx,790,350,110,110);

        // Blue stars
        ctx.globalAlpha = 0.4;
        g_sprites.stars4.drawAtAndEnlarge(ctx,50,150,70,70);
        g_sprites.stars4.drawAtAndEnlarge(ctx,150,500,80,80);
        g_sprites.stars4.drawAtAndEnlarge(ctx,200,200,80,80);
        g_sprites.stars4.drawAtAndEnlarge(ctx,480,380,90,90);
        g_sprites.stars4.drawAtAndEnlarge(ctx,780,80,100,100);

        
        
        
        ctx.globalAlpha = 1;
        //g_sprites.stars1.drawAtAndEnlarge(ctx,100,100,300,280);
        
        //font-family: 'Patrick Hand', cursive;
        //font-family: 'Neucha', cursive;
        ctx.font = "bold 36px Goudy Old Style";
        ctx.fillStyle = "white";
        ctx.shadowColor = '#333333';
        ctx.shadowBlur = 10;
        ctx.textAlign = "center";
        if (!entityManager.gameOver) {
            ctx.fillText("Failed! Press Z to keep playing", 500, 50);
        } else if (entityManager.gameOver) {
            ctx.fillText("Game over! Press Y to play again", 500, 50);
        }
        ctx.fillStyle = "#FFD1DC";

        var boxExtra = 10;
        ctx.globalAlpha = 0.6;

        // Color of the shadow
        ctx.shadowColor = '#4C4C4C';
        ctx.shadowBlur = 15;

        var boxWidth = 600;
        var boxHeight = 55;

        var boxX = 200;
        var boxY = 80;
        var boxOffset = 60;

        ctx.font = "bold 24px Goudy Old Style";

        ctx.fillRect(boxX + (boxExtra / 2), boxY + (boxExtra / 2),
        boxWidth - boxExtra, boxHeight - boxExtra);

        ctx.fillRect(boxX + (boxExtra / 2), boxY + boxOffset + (boxExtra / 2),
        boxWidth - boxExtra, boxHeight - boxExtra);

        ctx.fillRect(boxX + (boxExtra / 2), boxY + boxOffset * 2 + (boxExtra / 2),
        boxWidth - boxExtra, boxHeight - boxExtra);

        ctx.globalAlpha = 1;
        // Make sure the shadow is only applied to the boxes.
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.shadowColor = '#A9A9A9';
        ctx.shadowBlur = 5;

        var textX = boxX + 50;
        var textY = boxY + 35;
        var textOffset = boxOffset;
        var finalScore = this.allScores[0] + this.allScores[1] + this.allScores[2];

        // Counter fyrir skiptin sem maður hefur spilað.
        var counter = 0;

        score.highScores[counter] = finalScore;

        for (var i = 0; i < this.highScores.length; i++) {
            if (finalScore > this.highScores[i]) {
                var temp = finalScore;
                finalScore = this.highScores[i];
                this.highScores = temp;
            }
        }

        // If the specific score is yet to be assigned, display an empty string instead of 'undefined'.
        for (var i = 0; i < 3; i++) {
            if (this.allScores[i] == undefined) {
                this.allScores[i] = "";
            }
        }

        ctx.fillText("1st try: " + this.allScores[0], textX, textY);
        ctx.fillText("2nd try: " + this.allScores[1], textX, textY + textOffset);
        ctx.fillText("3rd try: " + this.allScores[2], textX, textY + textOffset * 2);

        if (!entityManager.gameOver) return;

        ctx.globalAlpha = 0.5;
        ctx.rotate(-45 * Math.PI / 180);
        g_sprites.deaduni.drawAtAndEnlarge(ctx,90,820,400,200);
        ctx.rotate(45 * Math.PI / 180);
        ctx.globalAlpha = 1;

        ctx.fillStyle = "#FFD1DC";
        // Color of the shadow
        ctx.shadowColor = '#4C4C4C';
        ctx.shadowBlur = 15;
        ctx.globalAlpha = 0.6;

        ctx.fillRect(boxX + (boxExtra / 2), boxY + boxOffset * 3 + (boxExtra / 2),
        boxWidth - boxExtra, boxHeight * 1.3 - boxExtra);
        ctx.globalAlpha = 1;

        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.shadowColor = '#A9A9A9';
        ctx.shadowBlur = 5;

        ctx.font = "bold 30px Goudy Old Style";
        ctx.shadowColor = '#CCCCCC';
        ctx.shadowBlur = 10;
        ctx.fillText("Final score: " + finalScore, textX, textY + textOffset * 3 + boxExtra);

        //ctx.fillStyle = "#FFFFFF";
        ctx.fillStyle = "#FCF4A3";
        var boxExtra = 10;
        ctx.globalAlpha = 0.7;

        // Color of the shadow
        ctx.shadowColor = '#4C4C4C';
        ctx.shadowBlur = 15;

        ctx.fillRect(boxX + (boxExtra / 2), boxY + boxOffset * 5 - boxExtra * 2,
        boxWidth - boxExtra, boxHeight - boxExtra);
        ctx.globalAlpha = 1;
        // Make sure the shadow is only applied to the boxes.
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.shadowColor = '#A9A9A9';
        ctx.shadowBlur = 5;
        ctx.fillText("High scores", 500, boxY + boxOffset * 5 + boxExtra * 1.2);
        
        ctx.fillStyle = "#FFD1DC";
        ctx.shadowColor = '#4C4C4C';
        
        ctx.globalAlpha = 0.6;
        ctx.fillRect(boxX + (boxExtra / 2), boxY + boxOffset * 6 - boxExtra * 1.7,
        boxWidth - boxExtra, boxHeight * 1 - boxExtra);
        ctx.fillRect(boxX + (boxExtra / 2), boxY + boxOffset * 7 - boxExtra * 2,
        boxWidth - boxExtra, boxHeight * 1 - boxExtra);
        ctx.fillRect(boxX + (boxExtra / 2), boxY + boxOffset * 8 - boxExtra * 2,
        boxWidth - boxExtra, boxHeight * 1 - boxExtra);

        
        ctx.globalAlpha = 1;
        // Make sure the shadow is only applied to the boxes.
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.shadowColor = '#A9A9A9';
        ctx.shadowBlur = 5;

        for (var i = 0; i < score.highScores.length; i++) {
            ctx.fillText(score.highScores[i], 500, textY + textOffset * 5 + textOffset + i * textOffset - boxExtra * 2);
        }

    }


}