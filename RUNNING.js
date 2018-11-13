// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function init() {



}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();
    entityManager.update(du);


}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;




}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

var KEY_PLAYAGAIN = keyCode('P');

function renderSimulation(ctx) {

    var gameOverOffset = 50;
    // If the game is over, display the game over screen
    if (main._isGameOver) {
        camera.reset(ctx);
        g_sprites.gameover.drawAtAndEnlarge(ctx,-gameOverOffset,0,g_canvas.width,g_canvas.height);
    } else {
    // Else draw the regular background
      
        g_sprites.Background.drawAtAndEnlarge(ctx,0,-g_canvas.height*5,g_canvas.width*10,g_canvas.height*10);

    }
    entityManager.render(ctx);
    
    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        leftPlat : "images/tundraCliffLeft.png",
        midPlat : "images/tundraMid.png",
        rightPlat : "images/tundraCliffRight.png",
        Run0 :  "images/Unicorn/run/run_000.png",
        Run1 :  "images/Unicorn/run/run_001.png",
        Run2 :  "images/Unicorn/run/run_002.png",
        Run3 :  "images/Unicorn/run/run_003.png",
        Run4 :  "images/Unicorn/run/run_004.png",
        Run5 :  "images/Unicorn/run/run_005.png",
        Run6 :  "images/Unicorn/run/run_006.png",
        Run7 :  "images/Unicorn/run/run_007.png",
        Run8 :  "images/Unicorn/run/run_008.png",
        Run9 :  "images/Unicorn/run/run_009.png",
        Run10 :  "images/Unicorn/run/Run_010.png",
        Run11 :  "images/Unicorn/run/run_011.png",
        Run12 :  "images/Unicorn/run/run_012.png",
        Run13 :  "images/Unicorn/run/run_013.png",
        Run14 :  "images/Unicorn/run/run_014.png",
        Run15 :  "images/Unicorn/run/run_015.png",
        Run16 :  "images/Unicorn/run/run_016.png",
        Run17 :  "images/Unicorn/run/run_017.png",
        Run18 :  "images/Unicorn/run/run_018.png",
        Run19 :  "images/Unicorn/run/run_019.png",
        Run20 :  "images/Unicorn/run/Run_020.png",
        Run21 :  "images/Unicorn/run/run_021.png",
        Run22 :  "images/Unicorn/run/run_022.png",
        Run23 :  "images/Unicorn/run/run_023.png",
        Run24 :  "images/Unicorn/run/run_024.png",
        Run25 :  "images/Unicorn/run/run_025.png",
        Run26 :  "images/Unicorn/run/run_026.png",
        Run27 :  "images/Unicorn/run/run_027.png",
        Run28 :  "images/Unicorn/run/run_028.png",
        Run29 :  "images/Unicorn/run/run_029.png",
        Run30 :  "images/Unicorn/run/Run_030.png",
        Run31 :  "images/Unicorn/run/run_031.png",
        Run32 :  "images/Unicorn/run/run_032.png",
        Run33 :  "images/Unicorn/run/run_033.png",
        Run34 :  "images/Unicorn/run/run_034.png",
        Run35 :  "images/Unicorn/run/run_035.png",
        Run36 :  "images/Unicorn/run/run_036.png",
        Run37 :  "images/Unicorn/run/run_037.png",
        Run38 :  "images/Unicorn/run/run_038.png",
        Run39 :  "images/Unicorn/run/run_039.png",
        /*Run0 :  "images/Unicorn/run_1.png",
        Run1 :  "images/Unicorn/run_2.png",
        Run2 :  "images/Unicorn/run_3.png",
        Run3 :  "images/Unicorn/run_4.png",
        Run4 :  "images/Unicorn/run_5.png",
        Run5 :  "images/Unicorn/run_6.png",
        Run6 :  "images/Unicorn/run_7.png",
        Run7 :  "images/Unicorn/run_8.png",
        Run8 :  "images/Unicorn/run_9.png",
        Run9 :  "images/Unicorn/run_10.png",
        Run10 :  "images/Unicorn/run_11.png",
        Run11 :  "images/Unicorn/run_12.png",
        Run12 :  "images/Unicorn/run_13.png",
        Run13 :  "images/Unicorn/run_14.png",
        Run14 :  "images/Unicorn/run_15.png",
        Run15 :  "images/Unicorn/run_16.png",
        Run16 :  "images/Unicorn/run_17.png",
        Run17 :  "images/Unicorn/run_18.png",*/
        Jump0 : "images/Unicorn/jump/jump_000.png",
        Jump1 : "images/Unicorn/jump/jump_001.png",
        Jump2 : "images/Unicorn/jump/jump_002.png",
        Jump3 : "images/Unicorn/jump/jump_003.png",
        Jump4 : "images/Unicorn/jump/jump_004.png",
        Jump5 : "images/Unicorn/jump/jump_005.png",
        Jump6 : "images/Unicorn/jump/jump_006.png",
        Jump7 : "images/Unicorn/jump/jump_007.png",
        Jump8 : "images/Unicorn/jump/jump_008.png",
        Jump9 : "images/Unicorn/jump/jump_009.png",
        Jump10 : "images/Unicorn/jump/jump_010.png",
        Jump11 : "images/Unicorn/jump/jump_011.png",
        Jump12 : "images/Unicorn/jump/jump_012.png",
        // Sprites for when it's dashing
        Dash0 : "images/Unicorn/dash/dash_000.png",
        Dash1 : "images/Unicorn/dash/dash_001.png",
        Dash2 : "images/Unicorn/dash/dash_002.png",
        Dash3 : "images/Unicorn/dash/dash_003.png",
        Dash4 : "images/Unicorn/dash/dash_004.png",
        Dash5 : "images/Unicorn/dash/dash_005.png",
        Dash6 : "images/Unicorn/dash/dash_006.png",
        Dash7 : "images/Unicorn/dash/dash_007.png",
        Dash8 : "images/Unicorn/dash/dash_008.png",
        Dash9 : "images/Unicorn/dash/dash_009.png",
        Dash10 : "images/Unicorn/dash/dash_010.png",
        Dash11 : "images/Unicorn/dash/dash_011.png",
        
        // Sprites for when it's going down
        Down0 : "images/Unicorn/down/down_000.png",
        Down1 : "images/Unicorn/down/down_001.png",
        Down2 : "images/Unicorn/down/down_002.png",
        Down3 : "images/Unicorn/down/down_003.png",
        Down4 : "images/Unicorn/down/down_004.png",
        Down5 : "images/Unicorn/down/down_005.png",
        Down6 : "images/Unicorn/down/down_006.png",
        Down7 : "images/Unicorn/down/down_007.png",
        Down8 : "images/Unicorn/down/down_008.png",
        Down9 : "images/Unicorn/down/down_009.png",
        Down10 : "images/Unicorn/down/down_010.png",
        Down11 : "images/Unicorn/down/down_011.png",
        Down12 :  "images/Unicorn/down/down_012.png",
        Down13 :  "images/Unicorn/down/down_013.png",
        Down14 :  "images/Unicorn/down/down_014.png",
        Down15 :  "images/Unicorn/down/down_015.png",
        Down16 :  "images/Unicorn/down/down_016.png",
        Down17 :  "images/Unicorn/down/down_017.png",
        Down18 :  "images/Unicorn/down/down_018.png",

        normal1 : "images/Platforms/normalSize.png",
        normal2 : "images/Platforms/normalSize2.png",
        normal3 : "images/Platforms/normalSize3.png",
        small : "images/Platforms/smallSize.png",
        esmall : "images/Platforms/extraSmallSize.png",
        large : "images/Platforms/largeSize.png",
        long : "images/Platforms/long.png",
    
        //the still star image
        Star : "images/Star/star.png",
        //the exploding star image
        Explosion0 : "images/Explosion/exp_000.png",
        Explosion1 : "images/Explosion/exp_001.png",
        Explosion2 : "images/Explosion/exp_002.png",
        Explosion3 : "images/Explosion/exp_003.png",
        Explosion4 : "images/Explosion/exp_004.png",
        Explosion5 : "images/Explosion/exp_005.png",
        Explosion6 : "images/Explosion/exp_006.png",
        Explosion7 : "images/Explosion/exp_007.png",
        Explosion8 : "images/Explosion/exp_008.png",
        Explosion9 : "images/Explosion/exp_009.png",
        Explosion10 : "images/Explosion/exp_010.png",
        Explosion11 : "images/Explosion/exp_011.png",

        Heart : "images/Lives/heart.png",
        Gameover : "images/Lives/gameover.png",
        Background : "images/background.png",

        //the rainbow image
        Rainbow : "images/Rainbow/rainbow_000.png"


    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites={};
var g_platforms = {};
var g_runSprite=[];
var g_jumpSprite=[];
var g_downSprite=[];
var g_dashSprite=[];
var g_starSprite=[];        //the still star sprite
var g_explosionSprite=[];   //the explosion sprite
var g_rainbowSprite = [];     //the rainbow sprite

function preloadDone() {
    g_sprites.Background = new Sprite(g_images.Background);
    g_sprites.gameover = new Sprite(g_images.Gameover);
    g_platforms.normal1 = new Sprite(g_images.normal1);
    g_platforms.normal2 = new Sprite(g_images.normal2);
    g_platforms.normal3 = new Sprite(g_images.normal3);
    g_platforms.small = new Sprite(g_images.small);
    g_platforms.esmall = new Sprite(g_images.esmall);
    g_platforms.large = new Sprite(g_images.large);
    g_platforms.long = new Sprite(g_images.long);
    g_sprites.heart = new Sprite(g_images.Heart);

/*
    for (var i = 0; i < g_runSprite.length; i++) {
        var run = "g_images.Run" + i;
        g_runSprite[i]=new Sprite(run);
    }
*/
    g_runSprite[0]=new Sprite(g_images.Run0);
    g_runSprite[1]=new Sprite(g_images.Run1);
    g_runSprite[2]=new Sprite(g_images.Run2);
    g_runSprite[3]=new Sprite(g_images.Run3);
    g_runSprite[4]=new Sprite(g_images.Run4);
    g_runSprite[5]=new Sprite(g_images.Run5);
    g_runSprite[6]=new Sprite(g_images.Run6);
    g_runSprite[7]=new Sprite(g_images.Run7);
    g_runSprite[8]=new Sprite(g_images.Run8);
    g_runSprite[9]=new Sprite(g_images.Run9);
    g_runSprite[10]=new Sprite(g_images.Run10);
    g_runSprite[11]=new Sprite(g_images.Run11);
    g_runSprite[12]=new Sprite(g_images.Run12);
    g_runSprite[13]=new Sprite(g_images.Run13);
    g_runSprite[14]=new Sprite(g_images.Run14);
    g_runSprite[15]=new Sprite(g_images.Run15);
    g_runSprite[16]=new Sprite(g_images.Run16);
    g_runSprite[17]=new Sprite(g_images.Run17);
    g_runSprite[18]=new Sprite(g_images.Run18);
    g_runSprite[19]=new Sprite(g_images.Run19);
    g_runSprite[20]=new Sprite(g_images.Run20);
    g_runSprite[21]=new Sprite(g_images.Run21);
    g_runSprite[22]=new Sprite(g_images.Run22);
    g_runSprite[23]=new Sprite(g_images.Run23);
    g_runSprite[24]=new Sprite(g_images.Run24);
    g_runSprite[25]=new Sprite(g_images.Run25);
    g_runSprite[26]=new Sprite(g_images.Run26);
    g_runSprite[27]=new Sprite(g_images.Run27);
    g_runSprite[28]=new Sprite(g_images.Run28);
    g_runSprite[29]=new Sprite(g_images.Run29);
    g_runSprite[30]=new Sprite(g_images.Run30);
    g_runSprite[31]=new Sprite(g_images.Run31);
    g_runSprite[32]=new Sprite(g_images.Run32);
    g_runSprite[33]=new Sprite(g_images.Run33);
    g_runSprite[34]=new Sprite(g_images.Run34);
    g_runSprite[35]=new Sprite(g_images.Run35);
    g_runSprite[36]=new Sprite(g_images.Run36);
    g_runSprite[37]=new Sprite(g_images.Run37);
    g_runSprite[38]=new Sprite(g_images.Run38);
    g_runSprite[39]=new Sprite(g_images.Run39);

    g_jumpSprite[0]=new Sprite(g_images.Jump0);
    g_jumpSprite[1]=new Sprite(g_images.Jump1);
    g_jumpSprite[2]=new Sprite(g_images.Jump2);
    g_jumpSprite[3]=new Sprite(g_images.Jump3);
    g_jumpSprite[4]=new Sprite(g_images.Jump4);
    g_jumpSprite[5]=new Sprite(g_images.Jump5);
    g_jumpSprite[6]=new Sprite(g_images.Jump6);
    g_jumpSprite[7]=new Sprite(g_images.Jump7);
    g_jumpSprite[8]=new Sprite(g_images.Jump8);
    g_jumpSprite[9]=new Sprite(g_images.Jump9);
    g_jumpSprite[10]=new Sprite(g_images.Jump10);
    g_jumpSprite[11]=new Sprite(g_images.Jump11);
    g_jumpSprite[12]=new Sprite(g_images.Jump12);

    g_dashSprite[0]=new Sprite(g_images.Dash0);
    g_dashSprite[1]=new Sprite(g_images.Dash1);
    g_dashSprite[2]=new Sprite(g_images.Dash2);
    g_dashSprite[3]=new Sprite(g_images.Dash3);
    g_dashSprite[4]=new Sprite(g_images.Dash4);
    g_dashSprite[5]=new Sprite(g_images.Dash5);
    g_dashSprite[6]=new Sprite(g_images.Dash6);
    g_dashSprite[7]=new Sprite(g_images.Dash7);
    g_dashSprite[8]=new Sprite(g_images.Dash8);
    g_dashSprite[9]=new Sprite(g_images.Dash9);
    g_dashSprite[10]=new Sprite(g_images.Dash10);
    g_dashSprite[11]=new Sprite(g_images.Dash11);
    //the star sprite
    g_starSprite=new Sprite(g_images.Star);
    //the explosion sprite
    g_explosionSprite[0]=new Sprite(g_images.Explosion0);
    g_explosionSprite[1]=new Sprite(g_images.Explosion1);
    g_explosionSprite[2]=new Sprite(g_images.Explosion2);
    g_explosionSprite[3]=new Sprite(g_images.Explosion3);
    g_explosionSprite[4]=new Sprite(g_images.Explosion4);
    g_explosionSprite[5]=new Sprite(g_images.Explosion5);
    g_explosionSprite[6]=new Sprite(g_images.Explosion6);
    g_explosionSprite[7]=new Sprite(g_images.Explosion7);
    g_explosionSprite[8]=new Sprite(g_images.Explosion8);
    g_explosionSprite[9]=new Sprite(g_images.Explosion9);
    g_explosionSprite[10]=new Sprite(g_images.Explosion10);
    g_explosionSprite[11]=new Sprite(g_images.Explosion11);
    //the rainbow
    g_rainbowSprite= new Sprite(g_images.Rainbow);
    entityManager.init();
    init();

    main.init();
}

// Kick it off
requestPreloads();
