
var Alice = {
    Application : PIXI.Application,
    Object : PIXI.Sprite,
    Container : PIXI.Container,
    Texture: PIXI.Texture,
    Scene: PIXI.Container,
    Ticker: PIXI.ticker.Ticker,
    Text: PIXI.Text,
    AnimatedObject: PIXI.extras.AnimatedSprite,
    Sound: PIXI.sound
}


var baseURL = {
    requireAssets: './Resources/Assets/require/',
    nomalAssets: './Resources/Assets/'
}

function DebugSystem(_open) {
    this.open = _open;
    this.log = function(info) {
        if(this.open) {
            console.log(info);
        }
    }
}

var debug = new DebugSystem(true);


function StateManager(_states, _eventSys) {
    this.states = _states;
    this.eventSystem = _eventSys;
    
    this.setState = function(_state_name, _value) {
        if(this.states[_state_name] != _value) {
            var message = _state_name + this.eventSystem.template.state + _value;
            this.states[_state_name] = _value;
            
            this.eventSystem.callEvent(message);
        }
    }

}

function AliceReactionSystem(_game) {
    
    this.game = _game;
    
    this.setState = function(_stateName, _value) {
        this.game.stateManager.setState(_stateName, _value);
    }
    
    this.transitToScene = function(_sceneIndex) {
        this.game.sceneManager.jumpToScene(_sceneIndex);
    }
    
    this.addToInventory = function(_obj) {
        this.game.inventory.add(_obj);
    }
    
    this.removeObject = function(_obj) {
        if(!_obj.parent) return;
        _obj.prevParent = _obj.parent;
        _obj.prevParent.removeChild(_obj);
        //_obj.inInventory = false;
    }
    
    this.removeFromInventory = function(_obj) {
        this.game.inventory.remove(_obj);
    }
    
    this.makeObjVisible = function(_obj) {
        _obj.visible = true;
        if(_obj.inInventory) {
            this.game.inventory.update();
        }
    }
    
    this.makeObjInvisible = function(_obj) {
        _obj.visible = false;
        if(_obj.inInventory) {
            //console.log(_obj.name +": hide")
            this.game.inventory.update();
        }
    }
    
    
    this.makeInteractive = function(_obj) {
        if(_obj.interactive)
            return;
        
        _obj.interactive = true;
        _obj.buttonMode = true;
        
        _obj
            .on('pointerdown', onMouseDown)
            .on('pointerup', onMouseUp)
            //.on('pointerupoutside', onMouseUp)
            .on('pointermove', onMouseMove);
    }
    
    this.makeNonInteractive = function(_obj) {
        if(!_obj.interactive)
            return;
        
        _obj.interactive = false;
        _obj.buttonMode = false;
        
        _obj
            .off('pointerdown', onMouseDown)
            .off('pointerup', onMouseUp)
            .off('pointermove', onMouseMove);
    }
    
    this.makeClickable = function(_obj) {
        this.makeInteractive(_obj);
        _obj.clickable = true;
    }
    
    this.makeUnClickable = function(_obj) {
        _obj.clickable = false;
        if(!_obj.dragable)
        {
            this.makeNonInteractive(_obj)
        }
    }
    
    this.makeDraggable = function(_obj) {
        this.makeInteractive(_obj);
        _obj.dragable = true;
    }
    
    this.makeUnDraggable = function(_obj) {
        _obj.dragable = false;
        if(!_obj.clickable)
        {
            this.makeNonInteractive(_obj)
        }
    }
   
    
    this.playAudio = function(_audio) {
        this.game.soundManager.play(_audio);
    }
    
    this.showInventory = function() {
        this.game.showInventory();
    }
    
    this.hideInventory = function() {
        this.game.hideInventory();
    }
    
    this.moveObjectToScene= function(_obj, _scene_index, x = null , y = null) {
        this.game.moveObjectToScene(_obj,_scene_index,x,y);
    }
    
    this.setObjectLocation = function(_obj, _x, _y) {
        _obj.x = _x;
        _obj.y = _y;
    }
    
}

function AliceEventSystem() {
    
    this.template = {
        use: " is used on ",
        combine: " is combined with ",
        observe: " is observed ",
        state: " is changed to ",
        transit: " transit to "
    }
    
    this.emptySprite = new Alice.Object;
    this.eventMessageList = {};
    
    this.addUsedEvent = function(objA, objB, func) {
        var eventMessage = objA.name + this.template.use + objB.name;
        debug.log("msg: " + eventMessage);
        this.eventMessageList[eventMessage] = true; 
        this.emptySprite.on(eventMessage,function() {
           func(); 
        });
    }
    
    this.addCombineEvent = function(objA, objB, func) {
        var eventMessage = objA.name + this.template.combine + objB.name;
        debug.log("msg: " + eventMessage);
        this.eventMessageList[eventMessage] = true; 
        this.emptySprite.on(eventMessage,function() {
           func(); 
        });
        
        eventMessage = objB.name + this.template.combine + objA.name;
        debug.log("msg: " + eventMessage);
        this.eventMessageList[eventMessage] = true; 
        this.emptySprite.on(eventMessage,function() {
           func(); 
        });
    }
    
    this.addObserveEvent = function(obj, func) {
        var eventMessage = obj.name + this.template.observe;
        debug.log("msg: " + eventMessage);
        this.eventMessageList[eventMessage] = true;
        this.emptySprite.on(eventMessage,function() {
           func(); 
        });
    }
    
    this.addStateEvent = function(_state, _toBe, func) {
        var eventMessage = _state + this.template.state + _toBe;
        this.eventMessageList[eventMessage] = true;
        this.emptySprite.on(eventMessage,function() {
           func(); 
        });
    }
    
    this.addSceneTransitEvent = function(_scene, func) {
        var eventMessage = this.template.transit + _scene;
        //debug.log("add scene transit: " + eventMessage)
        this.eventMessageList[eventMessage] = true;
        this.emptySprite.on(eventMessage,function() {
           func(); 
        });
    }
    
    //-------------//
    this.checkEventExist = function(message) {
        if(this.eventMessageList[message] == undefined || this.eventMessageList[message] == false) {
            //debug.log("not valid");
            return false;
        }
        return true;
    }
    
    this.callEvent = function(message) {
        this.emptySprite.emit(message);
    }
    
    
}


function Inventory(game) { //always on the top
    //tools container
    this.game = game;
    
    this.inventory_area = {x1: game.screenWidth, x2:game.screenWidth+game.inventoryWidth, y1:0, y2: game.screenHeight}
    
    this.inventory_w = game.inventoryWidth;
    this.gridStartY = game.inventoryWidth / 2;
    
    this.inventory_size = game.inventorySize;
    
    this.magic_scale = 0.8;
    
    this.objectList = [];
    this.baseX= game.screenWidth + this.inventory_w / 2;
    this.baseY = game.screenHeight / (this.inventory_size+1) / 2 + this.gridStartY;
    
    //init//
    this.inventoryContainer = new PIXI.Container();
    //this.inventoryContainer.interactive = true;

    
    this.inventoryBackgroundGrp = new PIXI.Container();
    
    var background_scale = this.inventory_w / 144;
    
    
    var inventUp = Alice.Object.fromImage( baseURL.requireAssets+'up.png');
    
    inventUp.scale.set(background_scale);
    inventUp.x = game.screenWidth;
    inventUp.y = 0;
    inventUp.interactive = true;
    inventUp.buttonMode = true;
    
    var nextPage = function() {
        this.nextPage();
    }

    var prevPage = function() {
        this.prevPage();
    }
    
    inventUp.on('click', prevPage);
    this.inventoryBackgroundGrp.addChild(inventUp);
    
    
    for(var i = 0; i < this.inventory_size; i++) {
        var inventBack = Alice.Object.fromImage( baseURL.requireAssets+'inventory.png');
        inventBack.scale.set(background_scale);
        inventBack.x = game.screenWidth;
        inventBack.y = this.gridStartY + i*this.inventory_w;
        this.inventoryBackgroundGrp.addChild(inventBack); 
    }
    
    var inventDown = Alice.Object.fromImage( baseURL.requireAssets+'down.png');
    inventDown.scale.set(background_scale);
    inventDown.x = game.screenWidth;
    inventDown.y = this.gridStartY + this.inventory_size*this.inventory_w;
    inventDown.interactive = true;
    inventDown.buttonMode = true;
    inventDown.on('click', nextPage);
    this.inventoryBackgroundGrp.addChild(inventDown); 
    
    
    ////////functions//////////
    
    this.page = 0;    
    
    this.init = function() {
        //TODO
    }
    
    this.scaleDown = function(tool) {
        tool.scale.set(1);
        var scale = Math.min(this.inventory_w/tool.width, this.inventory_w/tool.height)
        tool.scale.set(scale * this.magic_scale);
        
    }
    
    this.isInsideInventory = function(tool) {        
        //console.log(this.inventoryContainer.children.length)
        
        for(i in this.inventoryContainer.children) {
            //console.log(obj.name)
            obj = this.inventoryContainer.children[i];
            if(obj.name == tool.name)
                return true
        }
        
        return false;
    }
    
    this.add = function(tool) {
        
        if(this.isInsideInventory(tool))
        {
            return;
        }
        
        //remove tool from the original scene and add to inventory container
        this.inventoryContainer.addChild(tool); //[INTERESTING: remove it from the original container]
        
        //scale down
        this.scaleDown(tool);
        
        //!???????????!
        this.game.reactionSystem.makeDraggable(tool);
        
        tool.inInventory = true;
        this.page = Math.floor((this.countValidObj()-1) / 5)
        this.update();
    }
    
    this.remove = function(tool) {
        this.inventoryContainer.removeChild(tool);
        tool.inInventory = false;
        this.page = Math.floor((this.countValidObj()-1) / 5)
        this.update();
    }
    
    this.update = function() {
        var len  = this.inventoryContainer.children.length;
        //console.log("invent len = " + len);
        var count = 0;
        var start = this.page * this.inventory_size
        for(var i = 0; i < len ; i++) {
            var child = this.inventoryContainer.getChildAt(i);
            if(!child.visible) {
                continue;
            } else {
                child.x = this.baseX;
                var offset = count % 5;
                var inPage = Math.floor(count/5);
                child.y = this.baseY + offset * this.inventory_w - (this.page - inPage) * this.game.screenHeight;
                child.inventPos = {x:child.x, y:child.y}
                count++;
            }
        }
        this.updateArrow();
        //debug.log(this.page)
    }
    
    this.countValidObj = function() {
        var count = 0;
        for(var i = 0; i < this.inventoryContainer.children.length; i ++) {
            var child = this.inventoryContainer.getChildAt(i);
            if(child.visible)
                count++;
        }
        return count;
    }
    
    this.hasNextPage = function() {
        var count = 0;
        
        for(var i = 0; i < this.inventoryContainer.children.length; i ++) {
            var child = this.inventoryContainer.getChildAt(i);
            if(!child.visible) {
                continue;
            }else {
                count ++;
                if(count > (this.page+1) * this.inventory_size) {
                    return true;
                }
            }
        }
        
        return false;
        
    }
    
    this.hasPrevPage = function() {
        if(this.page > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    // turn page
    this.nextPage = function() {
        if(this.hasNextPage()) {
            this.page += 1;
            this.update();
        }
    }
    
    this.prevPage = function() {
        if(this.hasPrevPage()) {
            this.page -= 1;
            this.update();
        }
    } 
    
    this.updateArrow = function() {
//        if(this.hasPrevPage()) {
//            inventUp.alpha = 1
//        }else {
//            inventUp.alpha = 0.8
//        }
//        
//        if(this.hasNextPage()) {
//            inventDown.alpha = 1
//        }else {
//            inventDown.alpha = 0.8
//        }
        inventUp.interactive = this.hasPrevPage();
        inventDown.interactive = this.hasNextPage();
    }
    
    
    this.inventoryObserved = function(tool) {
        var message = tool.name + " is observed";
        if(this.interactionSystem.checkEventExist(message))
            this.interactionSystem.callEvent(message);
        
    }
    
    
    this.inventoryUse = function(tool) {

        var res = this.getCollisionMap(tool);
        var sceneCollider = res.scene;
        var inventoryCollider = res.inventory;
        
        if(inventoryCollider.length > 0) {
            var message = tool.name + this.game.eventSystem.template.combine + inventoryCollider.pop().name;
            if(this.game.eventSystem.checkEventExist(message)){
                //game.sound.play('good');
                //this.game.soundManager.play('good');
                this.game.eventSystem.callEvent(message);
                return;
            }
        }
        
        if(sceneCollider.length > 0) {
            var message = tool.name + this.game.eventSystem.template.use + sceneCollider.pop().name;
            //console.log(message);
            if(this.game.eventSystem.checkEventExist(message)){
                //game.sound.play('good');
                //this.game.soundManager.play('good');
                this.game.eventSystem.callEvent(message);
                return;
            }
        }
        
        //game.sound.play('bad');
        this.game.soundManager.play('bad');
        tool.x = tool.inventPos.x;
        tool.y = tool.inventPos.y;
         
    }
    
    this.clearUp= function() {
        this.inventoryContainer.removeChildren();
    }
    
    this.popUp = function(tool) {
        this.inventoryContainer.removeChild(tool);
        this.inventoryContainer.addChild(tool);
    }
    
    this.getCollisionMap = function(tool) {
        var SceneCollideList = [];
        var objectsInCurrentScene = this.game.sceneManager.getCurrentScene().children;
        //console.log(objectsInCurrentScene)
        objectsInCurrentScene.forEach(function(obj) {
            if(obj.visible && hitTestRectangle(tool,obj)) {
                //debug.log(obj.name);
                SceneCollideList.push(obj);
            }
        });
        
        var InventoryCollideList = [];
        var objectsInInventory = this.inventoryContainer.children;
        //console.log(objectsInInventory);
        objectsInInventory.forEach(function(obj) {
            if(obj.name!=tool.name && obj.visible && hitTestRectangle(tool,obj)) {
                //console.log(obj.name);
                InventoryCollideList.push(obj);
            }
        });
        var sceneObjName = [];
        SceneCollideList.forEach(function(obj){
            sceneObjName.push(obj.name);
        })
        
        var invObjName = [];
        InventoryCollideList.forEach(function(obj){
            invObjName.push(obj.name);
        })

        return {scene:SceneCollideList,inventory:InventoryCollideList};
    }
    
    this.update();
    
}

function SoundManager() {
    this.sound = PIXI.sound;
    this.baseURL = './Resources/Assets/require/sound/';
    
    
    
    this.initSystemSound = function() {
        this.sound.add('add', this.baseURL + 'add.wav');
        this.sound.add('good', this.baseURL + 'use_good.wav');
        this.sound.add('bad', this.baseURL + 'use_bad.wav');
    }
    
    this.play = function(_name) {
        this.sound.play(_name);
    }
    
    this.load = function(_name, _url) {
        this.sound.add(_name, _url);
    }
    
    this.initSystemSound();
    
}

function SceneManager(game) {
    this.currentScene;

    this.game = game;
    this.sceneContainer = new PIXI.Container();
    
    this.getCurrentScene = function() {
        return this.currentScene;
    }
    
    this.getSceneByIndex = function(index) {
        return this.sceneContainer.getChildAt(index);
    }
    
    this.createScenes = function(num) {
        for(var i = 0; i < num; i++) {
            var scene = new Alice.Scene();
            this.addScene(scene);
        }
    }
    
    this.addScene = function(scene) {
        this.sceneContainer.addChild(scene);
        scene.visible = false;
    }
    
    this.nextScene = function() {
        var currentSceneIndex = this.sceneContainer.getChildIndex(this.currentScene);
        this.currentScene.visible = false;
        currentSceneIndex ++;
        
        if(currentSceneIndex >= this.sceneContainer.children.length)
            return;
        
        this.currentScene =  this.sceneContainer.getChildAt(currentSceneIndex);
        this.currentScene.visible = true; 
    }
    
    
    this.previousScene = function() {
        var currentSceneIndex = this.sceneContainer.getChildIndex(this.currentScene);
        this.currentScene.visible = false;
        
        if(currentSceneIndex-1 < 0)
            return;
        
        currentSceneIndex --;
        
        this.currentScene =  this.sceneContainer.getChildAt(currentSceneIndex);
        this.currentScene.visible = true; 
    }
    
    //transit to scene index
    this.jumpToScene = function(scene) {
        //clear messsage box
        this.game.messageBox.stopConversation();
        
        var message = this.game.eventSystem.template.transit + scene;
        this.game.eventSystem.callEvent(message);
        
        var toScene = this.sceneContainer.getChildAt(scene);
        
        if(this.currentScene)
            this.currentScene.visible = false;
        
        toScene.visible = true;
        this.currentScene = toScene;
    }
    
    this.start = function(index) {
        this.jumpToScene(index);
    }
    
}



function GameManager() {
    
    //game
    this.screenWidth;
    this.screenHeight;
    this.inventorySize;
    this.inventoryWidth;
    
    this.app;
    this.inventory;
    this.sceneManager;
    this.topContainer;
    this.messageBox;
    this.stateManager;
    this.eventSystem;
    this.reactionSystem;
    this.soundManager;
    this.utilities;
    
    //sound
    this.sound = PIXI.sound;
    
    this.init = function(width,height,invent_size = 5) {
        if(invent_size < 5)
            invent_size = 5;
        
        this.screenWidth = width;
        this.screenHeight = height;

        this.inventorySize = invent_size;
        this.inventoryWidth = height/(invent_size+1)
        
        this.size = [this.screenWidth + this.inventoryWidth, this.screenHeight];
        this.ratio = this.size[0] / this.size[1];
        this.stage = new PIXI.Stage(0x333333, true);
        this.renderer = PIXI.autoDetectRenderer(this.size[0], this.size[1], null);
        
        //this.app = new Alice.Application(this.screenWidth + this.inventoryWidth, this.screenHeight, {backgroundColor : 0x1099bb});
        
        //this.app.rende
        
        document.body.appendChild(this.renderer.view);
    
               
        this.sceneManager = new SceneManager(this);
        this.inventory = new Inventory(this);
        this.topContainer = new Alice.Container();
        
        this.messageBox = new MessageBox({w:width,
                                          h:height,
                                          scale:1, 
                                          url: baseURL.requireAssets+'textbox.png',
                                          a:1},
                                         false, 
                                         this);
        
        this.eventSystem = new AliceEventSystem();
        this.reactionSystem = new AliceReactionSystem(this);
        this.soundManager = new SoundManager();
        this.utilities = new Utilities(this)
        
//        this.app.stage.addChild(this.sceneManager.sceneContainer);
//        this.app.stage.addChild(this.inventory.inventoryBackgroundGrp); 
//        this.app.stage.addChild(this.inventory.inventoryContainer);
//        this.app.stage.addChild(this.messageBox.holder);
 
        this.stage.addChild(this.sceneManager.sceneContainer);
        this.stage.addChild(this.inventory.inventoryBackgroundGrp); 
        this.stage.addChild(this.inventory.inventoryContainer);
        this.stage.addChild(this.messageBox.holder);
        this.stage.addChild(this.topContainer);
        
    }

    this.initStateManager = function(_states) {
        this.stateManager = new StateManager(_states, this.eventSystem);
    }
    
    this.moveObjectToScene= function(_obj, _scene_index, x = null , y = null) {
        this.scene(_scene_index).addChild(_obj);
        if(x)
            _obj.x = x;
        if(y)
            _obj.y = y;
    }
    
    this.showInventory = function() {
        this.renderer.resize(this.screenWidth + this.inventoryWidth,this.screenHeight);
        this.ratio = this.size[0] / this.size[1];
        this.resize();
    }
    
    
    this.hideInventory = function() {
        this.renderer.resize(this.screenWidth,this.screenHeight);
        this.ratio = (this.size[0] - this.inventoryWidth) / this.size[1];
        this.resize();
    }
    
    this.scene = function(index) {
        return this.sceneManager.getSceneByIndex(index);
    }
    
    this.awake = function() {
        
    }
    
    this.start = function(index) {
        //console.log("in start");
        
        this.resize();
        this.sceneManager.start(index);
        this.awake();
    }
    
    this.resize = function() {
        if (window.innerWidth / window.innerHeight >= this.ratio) {
            var w = window.innerHeight * this.ratio;
            var h = window.innerHeight;
        } else {
            var w = window.innerWidth;
            var h = window.innerWidth / this.ratio;
        }
        this.renderer.view.style.width = w + 'px';
        this.renderer.view.style.height = h + 'px';
    }
    
    this.getCollisionMap = function(tool) {
        var SceneCollideList = [];
        var objectsInCurrentScene = this.sceneManager.getCurrentScene().children;
        //console.log(objectsInCurrentScene)
        objectsInCurrentScene.forEach(function(obj) {
            if(obj.visible && hitTestRectangle(tool,obj) && tool.name!=obj.name ) {
                debug.log(obj.name);
                SceneCollideList.push(obj);
            }
        });
        
        var InventoryCollideList = [];
        var objectsInInventory = this.inventory.inventoryContainer.children;
        //console.log(objectsInInventory);
        objectsInInventory.forEach(function(obj) {
            if(obj.name!=tool.name && obj.visible && hitTestRectangle(tool,obj)) {
                //console.log(obj.name);
                InventoryCollideList.push(obj);
            }
        });
        var sceneObjName = [];
        SceneCollideList.forEach(function(obj){
            sceneObjName.push(obj.name);
        })
        
        var invObjName = [];
        InventoryCollideList.forEach(function(obj){
            invObjName.push(obj.name);
        })
//        console.log("sceneObjName:");
//        console.log(sceneObjName);
//        console.log("invObjName:");
//        console.log(invObjName);
        
        return {scene:SceneCollideList,inventory:InventoryCollideList};
    }
    
    

}

function Message(_text, _style, _avatar, _narrator="") {
//    this.defaultStyle = new PIXI.TextStyle({
//        fontFamily: 'Arial',
//        fontSize: 20,
//        fontWeight: 'bold',
//        wordWrap: true,
//        wordWrapWidth: 600
//    });
    
    this.text = _text;
    this.style = _style;
    this.avatar;
    this.narrator = _narrator;
}

/*
the original settings for 1280*720 screen
    url: baseURL.requireAssets+'textbox.png'
    pixel: 1051*231
    alpha: 0.8
    font_size: 25
*/

function MessageBox(background, avatarEnable, game) {
    
    this.game = game;
    
    this.holder = new Alice.Container();
    
    //the original background asset is built for 1280*720 screen
    this.backgronud = Alice.Object.fromImage(background.url);
    //this.backgronud = Alice.Object.fromImage("Assets/require/textbox.png");
    this.backgronud.anchor.set(0.5);
    
    //horizontal center
    this.backgronud.x = background.w/2;
    this.backgronud.alpha = 0.8;
    
    var scale = (this.game.screenWidth / 1280) * 0.7;
    
    this.backgronud.scale.set(scale);
    
    this.backgronud.y = background.h - (220 * scale)/2 - 10 * scale;
    
    this.backgronud.interactive = true;
    this.backgronud.buttonMode = true;
    
    this.messageBuffer = [];
    this.currentMsgIndex = 0;
    this.callBack = function(){};
    
    this.nextConversation = function() {
        
        this.currentMsgIndex++;
        //console.log("next " + this.currentMsgIndex);
        if(this.currentMsgIndex < this.messageBuffer.length)
        {
            this.currentMsg.text = this.messageBuffer[this.currentMsgIndex];
            //console.log("speak " + this.messageBuffer[this.currentMsgIndex]);
        } else {
            this.messageBuffer = [];
            this.currentMsg.text = "";
            this.currentMsgIndex = 0;
            this.holder.visible = false;
            this.callBack();           
        }

    }
    
    this.backgronud.on('pointerdown', messageBoxOnClick);
    
    this.holder.addChild(this.backgronud);
    this.holder.visible = false;
    
    
    this.defaltStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 46 * scale,
        fontWeight: 'bold',
        wordWrap: true,
        wordWrapWidth: 1051 * scale * 0.8
    });
    

    this.currentMsg = new PIXI.Text("", this.defaltStyle);
    this.currentMsg.anchor.set(0.5);
    this.currentMsg.x = this.backgronud.x;
    this.currentMsg.y = this.backgronud.y;
    
    this.holder.addChild(this.currentMsg);
    
    this.addMessage = function(msg) {
        this.messageBuffer.push(msg);
    }
    
    this.addMessages = function(msgs) {
        this.messageBuffer = this.messageBuffer.concat(msgs);
    }
    
    this.startConversation= function(msgs, func = null) {
        
        this.stopConversation();
        
        if(msgs.length == 0)
            return
        
        if(this.messageBuffer.length > 0) {
            this.addMessages(msgs);
            return;
        }
            
        if(func)
            this.callBack = func;
        
        this.messageBuffer = msgs;
        
        this.currentMsgIndex = 0;
        this.currentMsg.text = this.messageBuffer[this.currentMsgIndex];
        this.holder.visible = true;
    }
    
    this.stopConversation= function() {
            this.messageBuffer = [];
            this.currentMsg.text = "";
            this.currentMsgIndex = 0;
            this.holder.visible = false;
            this.callBack = function(){};

    }
}

function Utilities(_game) {
    this.game = _game;
    
    this.checkObjInsideWindow = function(obj) {    
        if(obj.x > 0 && obj.x < this.game.size[0] && obj.y > 0 && obj.y < this.game.size[1])
            return true;
        else
            return false;
    }
    
    this.checkObjInsideScene = function(obj) {
        
    }

}


/*
    2D collision detection
*/
function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x //+ r1.width / 2; 
  r1.centerY = r1.y //+ r1.height / 2; 
  r2.centerX = r2.x //+ r2.width / 2; 
  r2.centerY = r2.y //+ r2.height / 2; 

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};

function distance(x1,y1,x2,y2) {
    return Math.pow((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2), 0.5);
}


// game instances //
var myGame = new GameManager();


var animate = function() {
    requestAnimationFrame(animate);
    myGame.renderer.render(myGame.stage);
}

requestAnimationFrame(animate);


window.onresize = function(event) {
    myGame.resize();
};

function messageBoxOnClick() {
    if(myGame.messageBox) {
        myGame.messageBox.nextConversation();
    }
}

function toFrontLayer(obj) {
    //placeholder
    obj.temp = new Alice.Object;
    obj.originalParent = obj.parent;
    obj.originalParent.addChild(obj.temp);
    //console.log(obj.originalParent)
    obj.originalParent.swapChildren(obj,obj.temp)
    myGame.topContainer.addChild(obj);
    //console.log(obj.originalParent)
}

function toOriginalLayer(obj) {
    //console.log(obj.originalParent)
    obj.originalParent.addChild(obj);
    obj.originalParent = null;
    obj.parent.swapChildren(obj, obj.temp)
    obj.parent.removeChild(obj.temp)
    obj.temp = null;
}

function onMouseDown(event) {
    
    if(this.mouseIsDown)
        return;
    this.data = event.data;
    //this.alpha = 0.5;
    
    this.mouseIsDown = true;
    this.original = [this.x,this.y]
    this.offset = {
        x: this.data.getLocalPosition(this.parent).x - this.x,
        y: this.data.getLocalPosition(this.parent).y - this.y
    }
    this.dragStart = false;

}

function onMouseMove() {
    if (this.mouseIsDown && this.dragable) {
        this.newPosition = this.data.getLocalPosition(this.parent);
        this.x = this.newPosition.x - this.offset.x;
        this.y = this.newPosition.y - this.offset.y;
        
        if(distance(this.x,this.y, this.original[0],this.original[1]) > 0.3) {
            this.alpha = 0.5;
            if(!this.dragStart) {
                this.dragStart = true;
                toFrontLayer(this);
                debug.log("drag start")
                if(this.DIY_DRAG != undefined)
                    this.DIY_DRAG();
            }
        }
    }
}

function backToOrigin(obj,x,y) {
    myGame.inventory.update();
}


function onMouseUp(e) {
    
    if(!this.mouseIsDown)
        return;

    //debug.log("oh")
    
    if(this.dragStart)
        toOriginalLayer(this)
    
    this.alpha = 1;
    this.mouseIsDown = false;
    this.data = null;
    
    //debug.log("mouseUp")
    
    
    if(!this.dragStart)
    {
        this.x = this.original[0];
        this.y = this.original[1];
        debug.log("click: " + this.name);
        if(this.clickable) {
            if(this.DIY_CLICK != undefined)
                this.DIY_CLICK();
        }
    }
    else {
        //debug.log("drag");
        var res = myGame.getCollisionMap(this);
        var sceneCollider = res.scene;
        var inventoryCollider = res.inventory;
        
        for(var i in inventoryCollider) {
        //if(inventoryCollider.length > 0) {
            var item = inventoryCollider[i];
            
            var message = this.name + myGame.eventSystem.template.use + item.name;
            if(myGame.eventSystem.checkEventExist(message)){
                myGame.eventSystem.callEvent(message);
                //return;
            }
            
            message = this.name + myGame.eventSystem.template.combine + item.name;
            if(myGame.eventSystem.checkEventExist(message)){
                myGame.eventSystem.callEvent(message);
                //return;
            }
        }
        
        for(var i in sceneCollider) {
        //if(sceneCollider.length > 0) {
            
            var item = sceneCollider[i];
            var message = this.name + myGame.eventSystem.template.use + item.name;
            //console.log(message);
            if(myGame.eventSystem.checkEventExist(message)){
                myGame.soundManager.play('good');
                myGame.eventSystem.callEvent(message);
                //return;
            }
            
            message = this.name + myGame.eventSystem.template.combine + item.name;
            
            //console.log("combine msg: " + message)
            if(myGame.eventSystem.checkEventExist(message)){
                myGame.soundManager.play('good');
                myGame.eventSystem.callEvent(message);
                //return;
            }
        }
        
        backToOrigin(this,this.original[0],this.original[1]);
    }
  
}

function nextPage() {
    myGame.inventory.nextPage();
}

function prevPage() {
    myGame.inventory.prevPage();
}

//mousPos Point
//area rectangular
function mouseInArea(mousePos, area) {
    if(mousePos.x > area.x1 && mousePos.x < area.x2 && mousePos.y > area.y1 && mousePos.y < area.y2)
        return true;
    else {
        return false;
    }
}

document.addEventListener('mousewheel', (ev) => {

    if(ev.wheelDelta > 0) {
        prevPage()
    } else if(ev.wheelDelta < 0) {
        nextPage()
    }
    
});



