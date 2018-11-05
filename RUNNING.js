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


function renderSimulation(ctx) {

    var gameOverOffset = 50;
    // If the game is over, display the game over screen
    if (main._isGameOver) {
        g_sprites.gameover.drawAtAndEnlarge(ctx,- gameOverOffset,0,g_canvas.width + gameOverOffset,g_canvas.height);
    } else {
    // Else draw the regular background    
        g_sprites.Background.drawAtAndEnlarge(ctx,0,0,g_canvas.width,g_canvas.height);
        
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
        leftPlat : "images/grassCliffLeft.png",
        midPlat : "images/grassMid.png",
        rightPlat : "images/grassCliffRight.png",
        Run0 :  "images/Run/Run__000.png",
        Run1 :  "images/Run/Run__001.png",
        Run2 :  "images/Run/Run__002.png",
        Run3 :  "images/Run/Run__003.png",
        Run4 :  "images/Run/Run__004.png",
        Run5 :  "images/Run/Run__005.png",
        Run6 :  "images/Run/Run__006.png",
        Run7 :  "images/Run/Run__007.png",
        Run8 :  "images/Run/Run__008.png",
        Run9 :  "images/Run/Run__009.png",
        Jump0 : "images/Jump/Jump__000.png",
        Jump1 : "images/Jump/Jump__001.png",
        Jump2 : "images/Jump/Jump__002.png",
        Jump3 : "images/Jump/Jump__003.png",
        Jump4 : "images/Jump/Jump__004.png",
        Jump5 : "images/Jump/Jump__005.png",
        Jump6 : "images/Jump/Jump__006.png",
        Jump7 : "images/Jump/Jump__007.png",
        Jump8 : "images/Jump/Jump__008.png",
        Jump9 : "images/Jump/Jump__009.png",
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
        Throw0 : "images/Throw/Throw__000.png",
        Throw1 : "images/Throw/Throw__001.png",
        Throw2 : "images/Throw/Throw__002.png",
        Throw3 : "images/Throw/Throw__003.png",
        Throw4 : "images/Throw/Throw__004.png",
        Throw5 : "images/Throw/Throw__005.png",
        Throw6 : "images/Throw/Throw__006.png",
        Throw7 : "images/Throw/Throw__007.png",
        Throw8 : "images/Throw/Throw__008.png",
        Throw9 : "images/Throw/Throw__009.png",
        Kunai : "images/Throw/Kunai.png",
        Heart : "images/Lives/heart.png",
        Gameover : "images/Lives/gameover.png",
        Background : "images/BG.jpg"


    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var g_runSprite=[];
var g_jumpSprite=[];
var g_starSprite=[];        //the still star sprite
var g_explosionSprite=[];   //the explosion sprite
var g_throwSprite=[];

function preloadDone() {
    g_sprites.Kunai =new Sprite(g_images.Kunai);
    g_sprites.Background = new Sprite(g_images.Background);
    g_sprites.gameover = new Sprite(g_images.Gameover);
    g_sprites.leftPlat = new Sprite(g_images.leftPlat);
    g_sprites.midPlat = new Sprite(g_images.midPlat);
    g_sprites.rightPlat = new Sprite(g_images.rightPlat);
    g_sprites.heart = new Sprite(g_images.Heart);
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
    g_throwSprite[0]=new Sprite(g_images.Throw0);
    g_throwSprite[1]=new Sprite(g_images.Throw1);
    g_throwSprite[2]=new Sprite(g_images.Throw2);
    g_throwSprite[3]=new Sprite(g_images.Throw3);
    g_throwSprite[4]=new Sprite(g_images.Throw4);
    g_throwSprite[5]=new Sprite(g_images.Throw5);
    g_throwSprite[6]=new Sprite(g_images.Throw6);
    g_throwSprite[7]=new Sprite(g_images.Throw7);
    g_throwSprite[8]=new Sprite(g_images.Throw8);
    g_throwSprite[9]=new Sprite(g_images.Throw9);
    entityManager.init();
    init();

    main.init();
}

// Kick it off
requestPreloads();
