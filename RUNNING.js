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
  if (startmenu.startGame) {
    entityManager.update(du);
  }


}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');
var KEY_MUTE = keyCode('1');

var KEY_PLAYAGAIN = keyCode('Y');

var hasGameEnded = false;

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_MUTE)){
        volumeOnOff();
    }
    if (eatKey(keyCode('A'))) {
        startmenu.startGame=true;
        console.log("YESSIR");
    }

   /* if (eatKey(KEY_PLAYAGAIN) && entityManager.getMainCharacter().getLives()===0) {
        console.log("heyyy");
        entityManager.gameOver=false;
        entityManager.resetGameOver();
        score.reset();
        entityManager.didDie = false;
        Background.hasLostLife = false;
    }*/

}


function volumeOnOff() {
    for(var i in g_sounds){
        if(g_sounds.hasOwnProperty(i)){
            g_sounds[i].muted = !g_sounds[i].muted;
        }
    }
}

// Mini background class gerður til þess
// að renderSimulation verði ekki dirty
var Background = {
    x : 0,
    y : -1000,

    hasLostLife : false,

    render : function(ctx){
        if(this.x+g_sprites.Background.width<camera.getPos().posX){
            this.x=this.x+g_sprites.Background.width;
        }
        g_sprites.Background.drawAtAndEnlarge(ctx,this.x,this.y,g_sprites.Background.width, g_sprites.Background.height);
        g_sprites.Background.drawAtAndEnlarge(ctx,this.x+g_sprites.Background.width,this.y,g_sprites.Background.width, g_sprites.Background.height);
    },

    reset : function(){
        this.x=0;
    }

}
// =================
// RENDER SIMULATION
// =================
function renderSimulation(ctx) {
    startmenu.song();
    if (!startmenu.startGame) {
      startmenu.drawMenu(ctx);
    }
    // If the game is over, display the game over screen
     else if (Background.hasLostLife) {
        // Audio
        g_sounds.song.pause();
        g_sounds.song.currentTime=0;
        g_sounds.alwaysInstru.play();

        score.drawScoreBoard(ctx);

    } else {
    // Else draw the regular background
        Background.render(ctx);
        entityManager.render(ctx);

        if (g_renderSpatialDebug) spatialManager.render(ctx);

        // Audio
        g_sounds.song.play();
        if(g_sounds.alwaysInstru.currentTime > 0){
            g_sounds.alwaysInstru.pause();
            g_sounds.alwaysInstru.currentTime=0;
        }
    }
}



// =============
// PRELOAD STUFF
// =============
var requiredAudio = [

    "sounds/always.mp3",
    "sounds/explosion2.mp3",
    "sounds/explodeExtra.mp3",
    "sounds/gameover.mp3",
    "sounds/rainbow.mp3",
    "sounds/dash.mp3",
    "sounds/starExplosion.mp3",
    "sounds/explosion2extra.mp3",
    "sounds/jump.mp3",
    "sounds/alwaysInstru.mp3",
    "sounds/INTRO.mp3"

];



function preloadAudio(url) {
    var audio = new Audio();
    // once this file loads, it will call loadedAudio()
    // the file will be kept by the browser as cache
    audio.addEventListener('canplaythrough', loadedAudio, false);
    audio.src = url;
}

var loaded = 0;
function loadedAudio() {
    // this will be called every time an audio file is loaded
    // we keep track of the loaded files vs the requested files
    loaded++;
    if (loaded == requiredAudio.length){
        // all have loaded
        console.log("audio complete")
    	requestImagePreloads();
    }
}



// we start preloading all the audio files
function audioPreload(){
    for (var i in requiredAudio) {
        preloadAudio(requiredAudio[i]);
    }
}

var g_images = {};

function requestImagePreloads() {

    var requiredImages = {

        // Sprites for when unicorn is running
        Run17 :  "images/Unicorn/run/run_000.png",
        Run16 :  "images/Unicorn/run/run_001.png",
        Run15 :  "images/Unicorn/run/run_002.png",
        Run14 :  "images/Unicorn/run/run_003.png",
        Run13 :  "images/Unicorn/run/run_004.png",
        Run12 :  "images/Unicorn/run/run_005.png",
        Run11 :  "images/Unicorn/run/run_006.png",
        Run10 :  "images/Unicorn/run/run_007.png",
        Run9 :  "images/Unicorn/run/run_008.png",
        Run8 :  "images/Unicorn/run/Run_010.png",
        Run7 :  "images/Unicorn/run/run_011.png",
        Run6 :  "images/Unicorn/run/run_012.png",
        Run5 :  "images/Unicorn/run/run_013.png",
        Run4 :  "images/Unicorn/run/run_014.png",
        Run3 :  "images/Unicorn/run/run_015.png",
        Run2 :  "images/Unicorn/run/run_016.png",
        Run1 :  "images/Unicorn/run/run_017.png",
        Run0 :  "images/Unicorn/run/run_018.png",
        Run26 :  "images/Unicorn/run/Run_020.png",
        Run25 :  "images/Unicorn/run/run_021.png",
        Run24 :  "images/Unicorn/run/run_022.png",
        Run23 :  "images/Unicorn/run/run_023.png",
        Run22 :  "images/Unicorn/run/run_024.png",
        Run21 :  "images/Unicorn/run/run_025.png",
        Run20 :  "images/Unicorn/run/run_026.png",
        Run19 :  "images/Unicorn/run/run_027.png",
        Run18 :  "images/Unicorn/run/run_028.png",

        // Sprites for when unicorn is jumping
        Jump12 : "images/Unicorn/jump/jump_000.png",
        Jump11: "images/Unicorn/jump/jump_001.png",
        Jump10 : "images/Unicorn/jump/jump_002.png",
        Jump9 : "images/Unicorn/jump/jump_003.png",
        Jump8 : "images/Unicorn/jump/jump_004.png",
        Jump7 : "images/Unicorn/jump/jump_005.png",
        Jump6 : "images/Unicorn/jump/jump_006.png",
        Jump5 : "images/Unicorn/jump/jump_007.png",
        Jump4 : "images/Unicorn/jump/jump_008.png",
        Jump3 : "images/Unicorn/jump/jump_009.png",
        Jump2 : "images/Unicorn/jump/jump_010.png",
        Jump1 : "images/Unicorn/jump/jump_011.png",
        Jump0 : "images/Unicorn/jump/jump_012.png",

        // Sprites for when unicorn is dashing
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

        // Sprites for when unicorn is going down
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

        // Platforms
        normal1 : "images/Platforms/normalSize.png",
        normal2 : "images/Platforms/normalSize2.png",
        normal3 : "images/Platforms/normalSize3.png",
        small : "images/Platforms/smallSize.png",
        esmall : "images/Platforms/extraSmallSize.png",
        large : "images/Platforms/largeSize.png",
        long : "images/Platforms/long.png",

        // Gems
        Gem0 : "images/Gem/gem_000.png",
        Gem1 : "images/Gem/gem_001.png",
        Gem2 : "images/Gem/gem_002.png",
        Gem3 : "images/Gem/gem_003.png",
        Gem4 : "images/Gem/gem_004.png",
        Gem5 : "images/Gem/gem_005.png",

        // Explosion
        Explosion0 : "images/Explosion/tile000.png",
        Explosion1 : "images/Explosion/tile001.png",
        Explosion2 : "images/Explosion/tile002.png",
        Explosion3 : "images/Explosion/tile003.png",
        Explosion4 : "images/Explosion/tile004.png",
        Explosion5 : "images/Explosion/tile005.png",
        Explosion6 : "images/Explosion/tile006.png",
        Explosion7 : "images/Explosion/tile007.png",
        Explosion8 : "images/Explosion/tile008.png",
        Explosion9 : "images/Explosion/tile009.png",
        Explosion10 : "images/Explosion/tile010.png",
        Explosion11 : "images/Explosion/tile011.png",
        Explosion12 : "images/Explosion/tile012.png",
        Explosion13 : "images/Explosion/tile013.png",
        Explosion14 : "images/Explosion/tile014.png",
        Explosion15 : "images/Explosion/tile015.png",
        Explosion16 : "images/Explosion/tile016.png",
        Explosion17 : "images/Explosion/tile017.png",
        Explosion18 : "images/Explosion/tile018.png",
        Explosion19 : "images/Explosion/tile019.png",
        Explosion20 : "images/Explosion/tile020.png",
        Explosion21 : "images/Explosion/tile021.png",
        Explosion22 : "images/Explosion/tile022.png",
        Explosion23 : "images/Explosion/tile023.png",
        Explosion24 : "images/Explosion/tile024.png",
        Explosion25 : "images/Explosion/tile025.png",
        Explosion26 : "images/Explosion/tile026.png",
        Explosion27 : "images/Explosion/tile027.png",
        Explosion28 : "images/Explosion/tile028.png",
        Explosion29 : "images/Explosion/tile029.png",
        Explosion30 : "images/Explosion/tile030.png",
        Explosion31 : "images/Explosion/tile031.png",

        // Hearts/lives
        Alive : "images/Lives/alive.png",
        Dead : "images/Lives/dead.png",

        // Gameover screen
        Gameover : "images/playagain.png",
        Stars1 : "images/stars1.png",
        Stars2 : "images/stars2.png",
        Stars3 : "images/stars3.png",
        Stars4 : "images/stars4.png",

        // Background screen
        Background : "images/background.png",
        RainbowBG : "images/rainbowbg.png",
        DeadUnicorn : "images/deadUni.png",

        // Shine
        Shine0 : "images/Shine/shine_000.png",
        Shine1 : "images/Shine/shine_001.png",
        Shine2 : "images/Shine/shine_002.png",
        Shine3 : "images/Shine/shine_001.png",
        Shine4 : "images/Shine/shine_000.png",

        Menuframe0 : "images/fat-unicorn/frame_00_delay-0.08s.gif",
        Menuframe1 : "images/fat-unicorn/frame_01_delay-0.08s.gif",
        Menuframe2 : "images/fat-unicorn/frame_02_delay-0.08s.gif",
        Menuframe3 : "images/fat-unicorn/frame_03_delay-0.08s.gif",
        Menuframe4 : "images/fat-unicorn/frame_04_delay-0.08s.gif",
        Menuframe5 : "images/fat-unicorn/frame_05_delay-0.08s.gif",
        Menuframe6 : "images/fat-unicorn/frame_06_delay-0.08s.gif",
        Menuframe7 : "images/fat-unicorn/frame_07_delay-0.08s.gif",
        Menuframe8 : "images/fat-unicorn/frame_08_delay-0.08s.gif",
        Menuframe9 : "images/fat-unicorn/frame_09_delay-0.08s.gif",
        Menuframe10 : "images/fat-unicorn/frame_10_delay-0.08s.gif",
        Menuframe11 : "images/fat-unicorn/frame_11_delay-0.08s.gif",
        Menuframe12 : "images/fat-unicorn/frame_12_delay-0.08s.gif",
        Menuframe13 : "images/fat-unicorn/frame_13_delay-0.08s.gif",
        Menuframe14 : "images/fat-unicorn/frame_14_delay-0.08s.gif",
        Menuframe15 : "images/fat-unicorn/frame_15_delay-0.08s.gif",
        Menuframe16 : "images/fat-unicorn/frame_16_delay-0.08s.gif",
        Menuframe17 : "images/fat-unicorn/frame_17_delay-0.08s.gif",
        Menuframe18 : "images/fat-unicorn/frame_18_delay-0.08s.gif",
        Menuframe19 : "images/fat-unicorn/frame_19_delay-0.08s.gif",
        Menuframe20 : "images/fat-unicorn/frame_20_delay-0.08s.gif",
        Menuframe21 : "images/fat-unicorn/frame_21_delay-0.08s.gif",
        Menuframe22 : "images/fat-unicorn/frame_22_delay-0.08s.gif",
        Menuframe23 : "images/fat-unicorn/frame_23_delay-0.08s.gif",
        Menuframe24 : "images/fat-unicorn/frame_24_delay-0.08s.gif",
        Menuframe25 : "images/fat-unicorn/frame_25_delay-0.08s.gif",
        Menuframe26 : "images/fat-unicorn/frame_26_delay-0.08s.gif",
        Menuframe27 : "images/fat-unicorn/frame_27_delay-0.08s.gif",
        Menuframe28 : "images/fat-unicorn/frame_28_delay-0.08s.gif",
        Menuframe29 : "images/fat-unicorn/frame_29_delay-0.08s.gif",
        Menuframe30 : "images/fat-unicorn/frame_30_delay-0.08s.gif",
        Menuframe31 : "images/fat-unicorn/frame_31_delay-0.08s.gif",
        Menuframe32 : "images/fat-unicorn/frame_32_delay-0.08s.gif",
        Menuframe33 : "images/fat-unicorn/frame_33_delay-0.08s.gif",
        Menuframe34 : "images/fat-unicorn/frame_34_delay-0.08s.gif",
        Menuframe35 : "images/fat-unicorn/frame_35_delay-0.08s.gif",
        Menuframe36 : "images/fat-unicorn/frame_36_delay-0.08s.gif",
        Menuframe37 : "images/fat-unicorn/frame_37_delay-0.08s.gif",
        Menuframe38 : "images/fat-unicorn/frame_38_delay-0.08s.gif",
        Menuframe39 : "images/fat-unicorn/frame_39_delay-0.08s.gif"
    };

    imagesPreload(requiredImages, g_images, preloadDone);

}

var preloaded = 0;

var g_sounds = {};
var g_sprites={};
var g_platforms = {};
var g_runSprite=[];
var g_jumpSprite=[];
var g_downSprite=[];
var g_dashSprite=[];
var g_gemSprites = [];      // the gem
var g_explosionSprite=[];   // the explosion
var g_shineSprite = [];   // the shine
var g_menuSprite=[];

function preloadDone() {

    // Audio
    g_sounds.song = new Audio(requiredAudio[0]);
    g_sounds.uniExplosion = new Audio(requiredAudio[1]);
    g_sounds.eExtra = new Audio(requiredAudio[2]);
    g_sounds.gameOver = new Audio(requiredAudio[3]);
    g_sounds.rainbow = new Audio(requiredAudio[4]);
    g_sounds.dash = new Audio(requiredAudio[5]);
    g_sounds.starExplosion = new Audio(requiredAudio[6]);
    g_sounds.starExplosionExtra = new Audio(requiredAudio[2]);
    g_sounds.jump = new Audio(requiredAudio[8]);
    g_sounds.alwaysInstru = new Audio(requiredAudio[9]);
    g_sounds.INTRO = new Audio(requiredAudio[10]);


    // Volume of all the non-song sounds
    g_sounds.uniExplosion.volume = 0.5;
    g_sounds.eExtra.volume = 0.5;
    g_sounds.gameOver.volume = 0.5;
    g_sounds.rainbow.volume = 0.5;
    g_sounds.dash.volume = 0.5;
    g_sounds.starExplosion.volume = 0.5;
    g_sounds.starExplosionExtra.volume = 0.9;
    g_sounds.jump.volume = 0.9;

    //starting position for intro song
    g_sounds.INTRO.currentTime=119;
    // Images

    // background
    g_sprites.Background = new Sprite(g_images.Background);
    g_sprites.stars1 = new Sprite(g_images.Stars1);
    g_sprites.stars2 = new Sprite(g_images.Stars2);
    g_sprites.stars3 = new Sprite(g_images.Stars3);
    g_sprites.stars4 = new Sprite(g_images.Stars4);
    g_sprites.rainbowbg = new Sprite(g_images.RainbowBG);
    g_sprites.deaduni = new Sprite(g_images.DeadUnicorn);
    g_sprites.gameover = new Sprite(g_images.Gameover);

    // platforms
    g_platforms.normal1 = new Sprite(g_images.normal1);
    g_platforms.normal2 = new Sprite(g_images.normal2);
    g_platforms.normal3 = new Sprite(g_images.normal3);
    g_platforms.small = new Sprite(g_images.small);
    g_platforms.esmall = new Sprite(g_images.esmall);
    g_platforms.large = new Sprite(g_images.large);

    // lives
    g_sprites.alive = new Sprite(g_images.Alive);
    g_sprites.dead = new Sprite(g_images.Dead);
    g_platforms.long = new Sprite(g_images.long);

    // unicorn related
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
    g_jumpSprite[13]=new Sprite(g_images.Down18);
    g_jumpSprite[14]=new Sprite(g_images.Down17);
    g_jumpSprite[15]=new Sprite(g_images.Down16);
    g_jumpSprite[16]=new Sprite(g_images.Down15);
    g_jumpSprite[17]=new Sprite(g_images.Down14);
    g_jumpSprite[18]=new Sprite(g_images.Down13);
    g_jumpSprite[19]=new Sprite(g_images.Down12);
    g_jumpSprite[20]=new Sprite(g_images.Down11);
    g_jumpSprite[21]=new Sprite(g_images.Down10);
    g_jumpSprite[22]=new Sprite(g_images.Down9);
    g_jumpSprite[23]=new Sprite(g_images.Down8);
    g_jumpSprite[24]=new Sprite(g_images.Down7);
    g_jumpSprite[25]=new Sprite(g_images.Down6);
    g_jumpSprite[26]=new Sprite(g_images.Down5);
    g_jumpSprite[27]=new Sprite(g_images.Down4);
    g_jumpSprite[28]=new Sprite(g_images.Down3);
    g_jumpSprite[29]=new Sprite(g_images.Down2);
    g_jumpSprite[30]=new Sprite(g_images.Down1);
    g_jumpSprite[31]=new Sprite(g_images.Down0);

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

    // gem
    g_gemSprites[0] = new Sprite(g_images.Gem0);
    g_gemSprites[1] = new Sprite(g_images.Gem1);
    g_gemSprites[2] = new Sprite(g_images.Gem2);
    g_gemSprites[3] = new Sprite(g_images.Gem3);
    g_gemSprites[4] = new Sprite(g_images.Gem4);
    g_gemSprites[5] = new Sprite(g_images.Gem5);

    // explosion
    g_explosionSprite[0] = new Sprite(g_images.Explosion0);
    g_explosionSprite[1] = new Sprite(g_images.Explosion1);
    g_explosionSprite[2] = new Sprite(g_images.Explosion2);
    g_explosionSprite[3] = new Sprite(g_images.Explosion3);
    g_explosionSprite[4] = new Sprite(g_images.Explosion4);
    g_explosionSprite[5] = new Sprite(g_images.Explosion5);
    g_explosionSprite[6] = new Sprite(g_images.Explosion6);
    g_explosionSprite[7] = new Sprite(g_images.Explosion7);
    g_explosionSprite[8] = new Sprite(g_images.Explosion8);
    g_explosionSprite[9] = new Sprite(g_images.Explosion9);
    g_explosionSprite[10] = new Sprite(g_images.Explosion10);
    g_explosionSprite[11] = new Sprite(g_images.Explosion11);
    g_explosionSprite[12] = new Sprite(g_images.Explosion12);
    g_explosionSprite[13] = new Sprite(g_images.Explosion13);
    g_explosionSprite[14] = new Sprite(g_images.Explosion14);
    g_explosionSprite[15] = new Sprite(g_images.Explosion15);
    g_explosionSprite[16] = new Sprite(g_images.Explosion16);
    g_explosionSprite[17] = new Sprite(g_images.Explosion17);
    g_explosionSprite[18] = new Sprite(g_images.Explosion18);
    g_explosionSprite[19] = new Sprite(g_images.Explosion19);
    g_explosionSprite[20] = new Sprite(g_images.Explosion20);
    g_explosionSprite[21] = new Sprite(g_images.Explosion21);
    g_explosionSprite[22] = new Sprite(g_images.Explosion22);
    g_explosionSprite[23] = new Sprite(g_images.Explosion23);
    g_explosionSprite[24] = new Sprite(g_images.Explosion24);
    g_explosionSprite[25] = new Sprite(g_images.Explosion25);
    g_explosionSprite[26] = new Sprite(g_images.Explosion26);
    g_explosionSprite[27] = new Sprite(g_images.Explosion27);
    g_explosionSprite[28] = new Sprite(g_images.Explosion28);
    g_explosionSprite[29] = new Sprite(g_images.Explosion29);
    g_explosionSprite[30] = new Sprite(g_images.Explosion30);
    g_explosionSprite[31] = new Sprite(g_images.Explosion31);

    // shine
    g_shineSprite[0] = new Sprite(g_images.Shine0);
    g_shineSprite[1] = new Sprite(g_images.Shine1);
    g_shineSprite[2] = new Sprite(g_images.Shine2);

    g_menuSprite[0]=new Sprite(g_images.Menuframe0);
    g_menuSprite[1]=new Sprite(g_images.Menuframe1);
    g_menuSprite[2]=new Sprite(g_images.Menuframe2);
    g_menuSprite[3]=new Sprite(g_images.Menuframe3);
    g_menuSprite[4]=new Sprite(g_images.Menuframe4);
    g_menuSprite[5]=new Sprite(g_images.Menuframe5);
    g_menuSprite[6]=new Sprite(g_images.Menuframe6);
    g_menuSprite[7]=new Sprite(g_images.Menuframe7);
    g_menuSprite[8]=new Sprite(g_images.Menuframe8);
    g_menuSprite[9]=new Sprite(g_images.Menuframe9);
    g_menuSprite[10]=new Sprite(g_images.Menuframe10);
    g_menuSprite[11]=new Sprite(g_images.Menuframe11);
    g_menuSprite[12]=new Sprite(g_images.Menuframe12);
    g_menuSprite[13]=new Sprite(g_images.Menuframe13);
    g_menuSprite[14]=new Sprite(g_images.Menuframe14);
    g_menuSprite[15]=new Sprite(g_images.Menuframe15);
    g_menuSprite[16]=new Sprite(g_images.Menuframe16);
    g_menuSprite[17]=new Sprite(g_images.Menuframe17);
    g_menuSprite[18]=new Sprite(g_images.Menuframe18);
    g_menuSprite[19]=new Sprite(g_images.Menuframe19);
    g_menuSprite[20]=new Sprite(g_images.Menuframe20);
    g_menuSprite[21]=new Sprite(g_images.Menuframe21);
    g_menuSprite[22]=new Sprite(g_images.Menuframe22);
    g_menuSprite[23]=new Sprite(g_images.Menuframe23);
    g_menuSprite[24]=new Sprite(g_images.Menuframe24);
    g_menuSprite[25]=new Sprite(g_images.Menuframe25);
    g_menuSprite[26]=new Sprite(g_images.Menuframe26);
    g_menuSprite[27]=new Sprite(g_images.Menuframe27);
    g_menuSprite[28]=new Sprite(g_images.Menuframe28);
    g_menuSprite[29]=new Sprite(g_images.Menuframe29);
    g_menuSprite[30]=new Sprite(g_images.Menuframe30);
    g_menuSprite[31]=new Sprite(g_images.Menuframe31);
    g_menuSprite[32]=new Sprite(g_images.Menuframe32);
    g_menuSprite[33]=new Sprite(g_images.Menuframe33);
    g_menuSprite[34]=new Sprite(g_images.Menuframe34);
    g_menuSprite[35]=new Sprite(g_images.Menuframe35);
    g_menuSprite[36]=new Sprite(g_images.Menuframe36);
    g_menuSprite[37]=new Sprite(g_images.Menuframe37);
    g_menuSprite[38]=new Sprite(g_images.Menuframe38);
    g_menuSprite[39]=new Sprite(g_images.Menuframe39);
      entityManager.init();
      init();
      main.init();
}

// Kick it off
audioPreload();
