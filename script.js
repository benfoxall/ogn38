// This is all hacks
// --------

var transformProp = vendorCSSProp('transform');


function _className(className){
  return function(){
    document.getElementsByTagName('body')[0].className = className   
  }
}

function _content(html){
  return function(){
    document.getElementById('content').innerHTML = html   
  }
}

// position within the space
var x = 0.5, y = 0.5;

function localCoords(from){
  var mapBearing = 45,
      mapScale = 0.017,
      _x = (x-0.5)*-1, // flip the x because of something
      _y = y-0.5,
      bearing, distance;

  bearing = Math.atan2(_x, _y);

  if(bearing < 0) bearing += Math.PI*2;

  bearing = (((bearing/Math.PI)*180) + mapBearing) % 360;

  distance = Math.sqrt((_x*_x) + (_y*_y)) * mapScale;

  // console.log(bearing, distance)

  return from.destinationPoint(bearing, distance)
}


var locator = (function(){
  var element = document.getElementById('locator'),
      started;

  var floor_width = 421,
      floor_height = 541,
      window_width = window.innerWidth,
      window_height = window.innerHeight;

  bean.on(window,'resize', function(){
    window_width = window.innerWidth,
    window_height = window.innerHeight;
  })

  var x0 = 0.5, y0 = 0.5;

  function displayPosition(){
    var bx = (window_width*0.5) + ((x-0.5) * floor_width * -1) - (floor_width/2),
        by = (window_height*0.5) + ((y-0.5) * floor_height * -1) - (floor_height/2);
    

    element.style.backgroundPosition = bx + 'px ' + by + 'px';
  }


  var hammertime = new Hammer(element, {recognizers:[[Hammer.Pan, {threshold: 0}]]});
  hammertime.on('pan', function(ev) {

    x = (x0 - (ev.deltaX/floor_width));
    y = (y0 - (ev.deltaY/floor_height));


    if(x < 0) x = 0;
    if(x > 1) x = 1;
    if(y < 0) y = 0;
    if(y > 1) y = 1;

    if(ev.isFinal){
      x0 = x;
      y0 = y;

      origin = localCoords(places.jt.coords);
    }

    // uncomment to find local positions
    // var ll = localCoords(places.jt.coords);
    // console.log('new LatLon(%s,%s),', ll.lat.toPrecision(9), ll.lon.toPrecision(9))
  });


  var active, t;
  function render(){
    if(!active) return;
    requestAnimationFrame(render);
    displayPosition();
  }


  return {
    start:function(){
      if(active) return;
      active = true;
      render();
      element.className = 'active';  
    },
    stop:function(){
      if(!active) return;
      active = false;
      element.className = '';
      origin = localCoords(places.jt.coords);
    },
    toggle:function(){
      this[active ? 'stop' : 'start']();
    }
  }

})()



var places = {
  jt: {
    coords: new LatLon(51.760161, -1.266465),
    name: "Jericho Tavern"
  },

  jt_bar: {
    coords: new LatLon(51.7602440,-1.26647774),
    name: "The Bar"
  },
  // doesn't seem accurate enough
  // jt_bar_pump_left: {
  //   coords: new LatLon(51.7602301,-1.26647203),
  //   name: "The Bar - left pump"
  // },
  // jt_bar_pump_right: {
  //   coords: new LatLon(51.7602419,-1.26645298),
  //   name: "The Bar - right pump"
  // },
  jt_centre: {
    coords: new LatLon(51.7601654,-1.26637984),
    name: "JS Oxford"
  },
  jt_corner: {
    coords: new LatLon(51.7601633,-1.26631441),
    name: "The corner"
  },
  jt_round_corner: {
    coords: new LatLon(51.7602036,-1.26641366),
    name: "People who can't see the stage" // round corner who make noise
  },
  jt_round_pillar: {
    coords: new LatLon(51.7601567,-1.26643798),
    name: "More people who can't see the stage" // on the right as you come in
  },
  jt_stage: {
    coords: new LatLon(51.7601072,-1.26650463),
    name: "Me"
  },



  st_clements: {
    coords: new LatLon(51.750794, -1.238725),
    name: "My House"
  },
  wo: {
    coords: new LatLon(51.747683, -1.239902),
    name: "White October"
  },
  pri: {
    coords: new LatLon(56.396033, -3.453172),
    name: "Perth Royal Infirmary"
  },
  castle: {
    coords: new LatLon(51.751757, -1.263117),
    name: "Oxford Castle"
  },
  train_station: {
    coords: new LatLon(51.753464, -1.269833),
    name: "Oxford Train Station"
  },
  pheonix: {
    coords: new LatLon(51.760297, -1.266662),
    name: "Pheonix Picture House"
  },
  pitt_rivers: {
    coords: new LatLon(51.758787, -1.255327),
    name: "Pitt Rivers Museum"
  },
  big_ben: {
    coords: new LatLon(51.500729, -0.124625),
    name: "London (Big Ben)"
  },
  jsac: {
    coords: new LatLon(51.476020, -3.17931),
    name: "Super Secret Place" // it's cardiff! You're allowed to know, because you're reading this.
  }
}

// var JTBack  = new LatLon(51.760162, -1.266468),
//     JTFront = new LatLon(51.760128, -1.266528);

var origin = places.jt.coords,
    current = places.jt.coords,
    offset_bearing = 47;



function display(place, instant){
  if(instant){
    current = place.coords
  }

  var t = new TWEEN.Tween( { lon: current.lon, lat: current.lat } )
    .to( place.coords, 3000 )
    .onStart( function(){
      document.getElementById('place_name').innerHTML = place.name;
    })
    .onUpdate( function () {
      var distance = origin.distanceTo(this);
      var bearing = origin.bearingTo(this) + offset_bearing;
      document.getElementById('place_distance').innerHTML = format_distance(distance);
      document.getElementById('arrow').style[transformProp] = 'rotate(' + bearing + 'deg)';
    })
    // .start();

  current = place.coords;

  return t;

}


function animate() {
  requestAnimationFrame( animate );
  TWEEN.update();
}
animate();



function start_talk(){
  var t = new Talk();
  t.start();
}



function vis_a(offset, done){
  // console.log("offf", offset)

  var _ = timeoutQueue();

  // animate text out, and tick in
  _
  (_className(state('ready')))
  (1000)
  (_className(state(0)))

  // sync up
  (offset || 0)

  (_content(''))


  for(var i = 1 ; i <= 4; i++){_
    (1500)
    (_className(state(i%4)))
  }

  _(2000)


  for(var i = 1 ; i <= 4; i++){_
    (1000)
    (_className(state(i%4)))
  }

  _(2000)

  // for(var i = 1 ; i <= 4; i++){_
  //   (500)
  //   (_className(state(i%4)))
  // }

  // _(2000)

  // for(var i = 1 ; i <= 4; i++){_
  //   (250)
  //   (_className(state(i%4)))
  // }

  // _(2000)

  (_className(state('x')))

  (done||0)

  function state(i){
    return 'started s-' + i;
  }

}




var r = repeater()
.when(4, function(timestamp){
  var self = this;

  // 5 seconds after the average of samples
  // possibly slightly might be negative
  var start = 5000 - ((+ new Date()) - Math.floor(timestamp));

  self.pause();
  vis_a(start, function(){
    self.resume();
  })

})
.when(6, function(timestamp){
  displaySlide('last')
})
.when(8, function(timestamp){
  this.pause();

  // todo delay based on timestamp?
  // console.log(timestamp)
  start_talk();
})
.when(10, function(){
  document.location = 'http://emergingtechweekender.co.uk/img/mentors-ben-f.jpg';
})
.when(12, function(){
  displaySlide('sound-text')
})




// pretty rubbish animation keyframing (but interesting api)
function timeoutQueue(initial){
  var time = initial || 0;

  function add(obj){
    if(typeof obj == 'function'){
      if(time >= 0) setTimeout(obj, time)
    } else {
      time += obj;
    }
    return add;
  }

  return add;
}



// detect repeated clicks/touches/keypresses
// I've totally worked out how this could work better
function repeater(){
  var self       = this,
      wait       = 2000, // time to wait before processing
      deviation  = 80,   // (milliseconds) max deviation from mean
      timestamps = [],
      timeout, 
      paused;

  // api code
  self.pause = function(){
    paused = true;
    return self;
  }
  self.resume = function(){
    paused = false;
    return self;
  }
  self.when = function(n, fn){ 
    bean.on(self, 'found', function(_n, mean){
      if(n == _n) fn.call(self, mean);
    });
    return self;
  }

  bean.on(document.body, 'keydown', handler)
  bean.on(window, 'touchstart', handler)
  
  return self;

  function handler(e){
    if(paused) return;

    timestamps.unshift(+new Date);
    clearTimeout(timeout);
    timeout = setTimeout(process, wait);

    // play a blank sound for iOS to start audio
    if(window.play){
      window.play();
    }
  }

  //check which handlers should be fired
  function process(){

    // find the gaps between each of the timestamps
    var gaps = [];
    for(var i = 1; i < timestamps.length; i++){
      gaps[i-1] = timestamps[i-1] - timestamps[i]
    }

    if(!gaps.length){
      // console.log("early exit")
      return found(1);
    }
    
    // go through the gaps until we see a higher deviation
    for(var i = 1; i < gaps.length; i++){
      var s = stats(gaps.slice(0,i));
      if(s.sd > deviation){
        // console.log("loop", gaps.slice(0,i), gaps);
        return found(i);
      }
    }

    // console.log('all cool')
    found(timestamps.length)

  }

  function found(n){

    // console.log(">>>>", n);

    var s = stats(timestamps.slice(0,n));

    bean.fire(self, 'found', [n,s.mean]);
    
    timestamps = [];

  }

  function stats(values){

    var count = values.length,
        mean  = values.reduce(sum) / count,
        sd    = Math.sqrt(
          values
            .map(diff(mean))
            .map(square)
            .reduce(sum) / count
        )

    return {
      count: count,
      mean: mean,
      sd: sd
    }

    function sum(a,b){
      return a + b;
    }

    function square(v){
      return Math.pow(v, 2)
    }

    function diff(a){
      return function(b){
        return a - b;
      }
    }
  }
}




// bean.on(document.getElementById('fullscreen'), 'click', toggleFullScreen)

// function toggleFullScreen() {
//   if (!document.fullscreenElement &&    // alternative standard method
//       !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods


//     var element = document.getElementsByTagName('body')[0];

//     if (element.requestFullscreen) {
//       element.requestFullscreen();
//     } else if (element.msRequestFullscreen) {
//       element.msRequestFullscreen();
//     } else if (element.mozRequestFullScreen) {
//       element.mozRequestFullScreen();
//     } else if (element.webkitRequestFullscreen) {
//       element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
//     }
//   } else {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.msExitFullscreen) {
//       document.msExitFullscreen();
//     } else if (document.mozCancelFullScreen) {
//       document.mozCancelFullScreen();
//     } else if (document.webkitExitFullscreen) {
//       document.webkitExitFullscreen();
//     }
//   }
// }



// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik MÃller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


// polyfill Date.now
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}


function format_distance(km){
  
  // less than a cm
  if(km < 0.00001)
    return '<1cm'
  
  // less than a m
  if(km < 0.001)
    return Math.round(km*100000) + 'cm'
  
  // less than a km
  if(km < 1)
    return Math.round(km*1000) + 'm'
  
  // 10 km
  if(km < 10)
    return (km).toPrecision(3) + 'km'


  return Math.round(km) + 'km'

}


function vendorCSSProp (prop) {
  var     vendorPrefixes = ['Moz','Webkit','O', 'ms']
      ,   style     = document.createElement('div').style
      ,   upper     = prop.charAt(0).toUpperCase() + prop.slice(1)
      ,   pref, len = vendorPrefixes.length;

  while (len--) {
      if ((vendorPrefixes[len] + upper) in style) {
          pref = (vendorPrefixes[len])
      }
  }
  if (!pref && prop in style) {
      pref = prop
      return perf
  }
  if (pref) {
      return pref + upper
  }
  return ''
}


// debug
if(window.parent !== window){
  console.log("listening")
  window.addEventListener('message', function(e){
    
    var data = e.data || {};
    if(data.setup){
      x = data.setup.x;
      y = data.setup.y;
    } else if(data.go){
      start_talk()
    } else {
      console.log("unhandled message ", data)
    }

  }, false)
}
