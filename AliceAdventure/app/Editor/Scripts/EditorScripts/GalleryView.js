const { Event } = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const SceneObject = require('./SceneObject');
const View = require('./View');

// class
let GalleryView;

// variables
GalleryView = function(_bindElementID, _height = -1, _width = -1) {
  View.call(this, 'GalleryView', _height, _width, _bindElementID);
  this.vModel = null;
  this.objSelected = null;
};
GalleryView.prototype = new View();

GalleryView.ImageLibrary = {
  backdrop: [
    { name: 'Airplane', src: '../../Assets/backdrop/airplane.png' },
    { name: 'Airport', src: '../../Assets/backdrop/airport.png' },
    { name: 'Backdrop', src: '../../Assets/backdrop/backdrop.png' },
    { name: 'Bathroom', src: '../../Assets/backdrop/bathroom.png' },
    { name: 'Classroom', src: '../../Assets/backdrop/classroom.png' },
    { name: 'Galaxy', src: '../../Assets/backdrop/galaxy.png' },
    { name: 'Hill', src: '../../Assets/backdrop/Hill.png' },
    { name: 'Kitchen', src: '../../Assets/backdrop/kitchen.png' },
    { name: 'Library', src: '../../Assets/backdrop/library.png' },
    { name: 'Night', src: '../../Assets/backdrop/night.png' },
    {
      name: 'Indoor',
      src: '../../Assets/backdrop/pixel_indoor_env.png'
    },
    {
      name: 'Outdoor',
      src: '../../Assets/backdrop/pixel_outdoor_env.png'
    },
    { name: 'River', src: '../../Assets/backdrop/river.png' },
    { name: 'Room basic', src: '../../Assets/backdrop/room_basic.png' },
    { name: 'Room blue', src: '../../Assets/backdrop/room_blue.png' },
    { name: 'Sand', src: '../../Assets/backdrop/sand.png' },
    { name: 'Scifi indoor', src: '../../Assets/backdrop/scifi_indoor.png' },
    { name: 'Snow', src: '../../Assets/backdrop/snow.png' },
    { name: 'Win', src: '../../Assets/backdrop/win.png' },
    { name: 'Wood room', src: '../../Assets/backdrop/wood_room.png' }
  ],
  character: [
    {
      name: 'Alice',
      src: '../../Assets/character/alice_standing.png'
    },
    { name: 'Bear', src: '../../Assets/character/Bear.png' },
    { name: 'Bird', src: '../../Assets/character/Bird.png' },
    { name: 'Boy', src: '../../Assets/character/boy.png' },
    { name: 'Businessman', src: '../../Assets/character/businessman.png' },
    { name: 'Cat', src: '../../Assets/character/cat.png' },
    { name: 'Cat sad', src: '../../Assets/character/cat_sad.png' },
    { name: 'Chicken', src: '../../Assets/character/Chicken.png' },
    { name: 'Koala', src: '../../Assets/character/Coala.png' },
    { name: 'Dog', src: '../../Assets/character/dog_happy.png' },
    { name: 'Duck', src: '../../Assets/character/Duck.png' },
    { name: 'Fish', src: '../../Assets/character/Fish.png' },
    { name: 'Flamingo', src: '../../Assets/character/Flamingo.png' },
    { name: 'Frog', src: '../../Assets/character/Frog.png' },
    { name: 'Giraffe', src: '../../Assets/character/giraffe.png' },
    { name: 'Girl', src: '../../Assets/character/girl_unhappy.png' },
    { name: 'Hero', src: '../../Assets/character/hero1.png' },
    { name: 'Hero', src: '../../Assets/character/hero2.png' },
    { name: 'Hero', src: '../../Assets/character/hero3.png' },
    { name: 'Hero', src: '../../Assets/character/hero4.png' },
    { name: 'Mad hat', src: '../../Assets/character/mad_hat.png' },
    { name: 'Monkey', src: '../../Assets/character/Monkey.png' },
    { name: 'Monster', src: '../../Assets/character/monster1.png' },
    { name: 'Monster', src: '../../Assets/character/monster2.png' },
    { name: 'Monster', src: '../../Assets/character/Monster3.png' },
    { name: 'Monster', src: '../../Assets/character/Monster4.png' },
    { name: 'Monster', src: '../../Assets/character/Monster5.png' },
    { name: 'Orange cat', src: '../../Assets/character/orange_cat.png' },
    { name: 'Rayfish', src: '../../Assets/character/Rayfish.png' },
    { name: 'Robot', src: '../../Assets/character/robot.png' },
    { name: 'Seals', src: '../../Assets/character/Seals.png' },
    { name: 'Seaturtle', src: '../../Assets/character/Seaturtle.png' },
    { name: 'Shopper', src: '../../Assets/character/shopper.png' },
    { name: 'Sloth', src: '../../Assets/character/Sloth.png' },
    { name: 'Squarrel', src: '../../Assets/character/Squarrel.png' },
    { name: 'Tiger', src: '../../Assets/character/Tiger.png' },
    { name: 'Tweedle dee', src: '../../Assets/character/tweedle_dee.png' },
    {
      name: 'Wizard',
      src: '../../Assets/character/wizard_student.png'
    },
    {
      name: 'Wizard',
      src: '../../Assets/character/wizard_student2.png'
    },
    {
      name: 'Wizard',
      src: '../../Assets/character/wizard_student3.png'
    },
    { name: 'Bird', src: '../../Assets/character/Yellow_Bird.png' }
  ],
  container: [
    { name: 'Bag', src: '../../Assets/container/bag.png' },
    { name: 'Box', src: '../../Assets/container/box1.png' },
    { name: 'Box', src: '../../Assets/container/box2.png' },
    { name: 'Box', src: '../../Assets/container/Box3.png' },
    { name: 'Box', src: '../../Assets/container/Box4.png' },
    { name: 'Locked box', src: '../../Assets/container/Locked Box.png' },
    { name: 'Locked box', src: '../../Assets/container/Locked Box2.png' },
    { name: 'Locker', src: '../../Assets/container/locker.png' },
    { name: 'Locker open', src: '../../Assets/container/locker_open.png' },
    { name: 'Refrigerator', src: '../../Assets/container/refrigerator.png' },
    { name: 'Safe', src: '../../Assets/container/Safe.png' },
    { name: 'Wallet', src: '../../Assets/container/wallet.png' }
  ],
  entrance: [
    { name: 'Door', src: '../../Assets/entrance/door.png' },
    { name: 'Door', src: '../../Assets/entrance/Door3.png' },
    { name: 'Door', src: '../../Assets/entrance/Door4.png' },
    { name: 'Door open', src: '../../Assets/entrance/door_open.png' },
    { name: 'Hole', src: '../../Assets/entrance/Hole.png' },
    { name: 'Hole', src: '../../Assets/entrance/Hole2.png' },
    { name: 'Ladder', src: '../../Assets/entrance/Ladder2.png' },
    { name: 'Portal', src: '../../Assets/entrance/Portal.png' },
    { name: 'Portal', src: '../../Assets/entrance/Portal2.png' },
    { name: 'Vent', src: '../../Assets/entrance/Vent.png' },
    { name: 'Vent', src: '../../Assets/entrance/Vent2.png' },
    { name: 'Vent', src: '../../Assets/entrance/Vent3.png' }
  ],
  key: [
    { name: 'Button', src: '../../Assets/key/Button.png' },
    { name: 'Button', src: '../../Assets/key/Button2.png' },
    { name: 'Button', src: '../../Assets/key/Button3.png' },
    { name: 'Id card', src: '../../Assets/key/ID Card.png' },
    { name: 'Key stone', src: '../../Assets/key/Key Stone.png' },
    { name: 'Key', src: '../../Assets/key/key.png' },
    { name: 'Key', src: '../../Assets/key/Key2.png' },
    { name: 'Lever', src: '../../Assets/key/Lever3.png' },
    { name: 'Switch', src: '../../Assets/key/Switch.png' }
  ],
  others: [
    { name: 'Arrow down', src: '../../Assets/other/arrow_down.png' },
    { name: 'Arrow plain', src: '../../Assets/other/arrow_plain.png' },
    { name: 'Balloon', src: '../../Assets/other/Balloon.png' },
    { name: 'Blackboard', src: '../../Assets/other/blackboard.png' },
    { name: 'Blender', src: '../../Assets/other/blender.png' },
    { name: 'Bluepaint', src: '../../Assets/other/bluepaint.png' },
    { name: 'Book', src: '../../Assets/other/book.png' },
    { name: 'Bookshelf', src: '../../Assets/other/bookshelf.png' },
    { name: 'Bread', src: '../../Assets/other/bread.png' },
    { name: 'Breadwithjam', src: '../../Assets/other/breadwithjam.png' },
    { name: 'Calendar', src: '../../Assets/other/calendar.png' },
    { name: 'Car', src: '../../Assets/other/car.png' },
    { name: 'Clock', src: '../../Assets/other/clock.png' },
    { name: 'Coin', src: '../../Assets/other/Coin.png' },
    { name: 'Coin', src: '../../Assets/other/Coin2.png' },
    { name: 'Computer', src: '../../Assets/other/computer.png' },
    { name: 'Couch', src: '../../Assets/other/couch.png' },
    { name: 'Cup', src: '../../Assets/other/cup.png' },
    { name: 'Envelope', src: '../../Assets/other/envelope.png' },
    { name: 'Eraser', src: '../../Assets/other/eraser.png' },
    { name: 'Flashlight', src: '../../Assets/other/flashlight.png' },
    { name: 'Greenpaint', src: '../../Assets/other/greenpaint.png' },
    { name: 'Hammer', src: '../../Assets/other/Hammer.png' },
    { name: 'Hat', src: '../../Assets/other/Hat.png' },
    { name: 'Jam', src: '../../Assets/other/jam.png' },
    { name: 'Knife', src: '../../Assets/other/knife.png' },
    { name: 'Laptop', src: '../../Assets/other/laptop.png' },
    { name: 'Lock', src: '../../Assets/other/lock1.png' },
    { name: 'Lock', src: '../../Assets/other/lock2.png' },
    { name: 'Magicwand', src: '../../Assets/other/magicwand.png' },
    { name: 'Magnifier', src: '../../Assets/other/magnifier.png' },
    { name: 'Milk', src: '../../Assets/other/milk.png' },
    { name: 'Money', src: '../../Assets/other/money.png' },
    { name: 'Monster', src: '../../Assets/other/Monster.png' },
    { name: 'Newspaper', src: '../../Assets/other/newspaper.png' },
    { name: 'Old photo', src: '../../Assets/other/old_photo.png' },
    { name: 'Pencil', src: '../../Assets/other/pencil.png' },
    { name: 'Phone', src: '../../Assets/other/phone.png' },
    { name: 'Pineapple', src: '../../Assets/other/Pineapple.png' },
    { name: 'Planet', src: '../../Assets/other/Planet.png' },
    { name: 'Post-it', src: '../../Assets/other/post-it.png' },
    { name: 'Radio', src: '../../Assets/other/radio.png' },
    { name: 'Redcone', src: '../../Assets/other/redcone.png' },
    { name: 'Satellite', src: '../../Assets/other/satellite.png' },
    { name: 'Skull', src: '../../Assets/other/Skull.png' },
    { name: 'Smartphone', src: '../../Assets/other/smartphone.png' },
    { name: 'Soda', src: '../../Assets/other/soda.png' },
    { name: 'Spaceship', src: '../../Assets/other/Spaceship.png' },
    {
      name: 'Painting',
      src: '../../Assets/other/starrylight_painting.png'
    },
    { name: 'Stool', src: '../../Assets/other/stool.png' },
    { name: 'Sword', src: '../../Assets/other/sword.png' },
    { name: 'Table', src: '../../Assets/other/table.png' },
    { name: 'Whitecone', src: '../../Assets/other/whitecone.png' },
    { name: 'Whitepaint', src: '../../Assets/other/whitepaint.png' },
    { name: 'Window day', src: '../../Assets/other/window_day.png' },
    { name: 'Window night', src: '../../Assets/other/window_night.png' }
  ]
};

GalleryView.SoundLibrary = [
  /* {
		index: 0, 
		src: "../../Assets/door.wav", 
		name: "Door"
	}, */
];

GalleryView.NewView = function(_elementID) {
  const view = new GalleryView(_elementID);
  view.InitView();
  return view;
};

// functions
GalleryView.prototype.InitView = function() {
  View.prototype.InitView.apply(this); // call super method
  // init data binding
  this.vModel = new Vue({
    el: `#${this.bindElementID}`,
    data: {
      searchWord: '',
      images: GalleryView.ImageLibrary,
      sounds: GalleryView.SoundLibrary,
      importedImages: null,
      importedSounds: null,
      showCategory: {
        backdrop: true,
        character: true,
        container: true,
        entrance: true,
        key: true,
        others: true,
        sound: false,
        myImage: true,
        mySound: true
      }
    },
    methods: {
      imageDragstart: (ev, d, type) => {
        d.type = type;
        View.HandleDragstart(ev, View.DragInfo.GalleryImage, d);
      },
      soundDragstart: (ev, d) => {
        View.HandleDragstart(ev, View.DragInfo.GallerySound, d);
      },
      chooseObj: _obj => {
        this.ChooseObj(_obj);
      },
      setImage: img => {
        this.SetImage(img);
      },
      previewSound: sound => {
        new Audio(sound.src).play();
      }, // TODO: compatible path with both imported and default
      needShow: img => {
        if (!this.vModel || this.vModel.searchWord.length === 0) return true;
        console.log(this.vModel.searchWord);
        const re = new RegExp(`\\w*${this.vModel.searchWord}\\w*`);
        return img.name.match(re);
      },
      forceUpdate: () => {
        console.log(this.vModel.searchWord);
        this.vModel.$forceUpdate();
      }
    }
  });

  // events
  Event.AddListener('reload-project', () => {
    this.ReloadView();
  });
};

GalleryView.prototype.ReloadView = function() {
  View.prototype.ReloadView.apply(this); // call super method

  if (GameProperties.instance == null) {
    this.vModel.importedImages = null;
    this.vModel.importedSounds = null;
    this.vModel.searchWord = '';
  } else {
    this.vModel.importedImages = GameProperties.instance.imageList;
    this.vModel.importedSounds = GameProperties.instance.soundList;
    this.vModel.searchWord = '';
  }
};

GalleryView.prototype.ChooseObj = function(_obj) {
  this.objSelected = _obj;
  Event.Broadcast('add-gallery-object', this.objSelected);
};

GalleryView.prototype.SetImage = function(img) {
  const obj = View.Selection.object;
  if (obj == null) return;
  obj.SetSprite(img.src);
  View.Selection.selectObject(obj);
};

module.exports = GalleryView;
