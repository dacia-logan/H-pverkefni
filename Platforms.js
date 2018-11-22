function Platform(i, p, x, y) {

    // Common inherited setup logic from Entity
    this.setup(i);//?? i ??

    this.y = y || Math.floor(util.randRange(300, 520));
    this.x = x || camera.getPos().posX + g_canvas.width;             // position of the images

    this.primary = p || false;
    this.plat = i;
    this.platformPushed=false;

//==========================================
// Sizes of different types of platforms
//==========================================

    if(i===1){

        this.width = g_images.large.width*2.6;
        this.height = g_images.large.height*1.8;
    }

    else if(i===2){

        this.width = g_images.normal1.width*3;
        this.height = g_images.normal1.height*2.2;

    }

    else if(i===3){

        this.width = g_images.normal2.width*2.3;
        this.height = g_images.normal2.height*2.1;


    }

    else if(i===4){

        this.width = g_images.normal3.width*2.4;
        this.height = g_images.normal3.height*1.8;

    }

    else if(i===5){

        this.width = g_images.small.width*1.5
        this.height = g_images.small.height*1.4;

    }

    else if(i===6){

        this.width = g_images.esmall.width*1.7
        this.height = g_images.esmall.height*1.7;

    }

    else if(i===7){
        this.width = g_images.long.width*1.3;
        this.height = g_images.long.height*1.2;
    }


    this.type = "Platform";

};

Platform.prototype = new Entity();

// Föll  sem hjalpa entityManager að akvarða
// hvenær eigi að teikna næsta set af platformum 

Platform.prototype.setPlatformPushed = function(){
    this.platformPushed = !this.platformPushed;
};

Platform.prototype.getPlatformPushed = function(){
    return this.platformPushed;
};


Platform.prototype.getPrimary = function(){
    return this.primary;
}


Platform.prototype.update = function(du){

    spatialManager.unregister(this);

    if(this.x <= camera.getPos().posX-this.width){
        this.kill();
    }

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
    else  spatialManager.register(this);


};


Platform.prototype.drawPlat = function(ctx){

if(this.plat===1){
    g_platforms.large.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===2){
    g_platforms.normal1.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===3){
    g_platforms.normal2.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===4){
    g_platforms.normal3.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===5){
    g_platforms.small.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===6) {
    g_platforms.esmall.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

else if(this.plat===7) {
    g_platforms.long.drawAtAndEnlarge(ctx, this.x, this.y, this.width, this.height);
}

};

Platform.prototype.render = function(ctx){
    
    this.drawPlat(ctx);

}
