// This is all hacks
// --------

function htmlC(name){
  document.getElementsByTagName('html')[0].className = name
}

function _className(className){
  return function(){
    document.getElementsByTagName('html')[0].className = className   
  }
}

function _content(html){
  return function(){
    document.getElementById('content').innerHTML = html   
  }
}

// position within the space
var x = 0.5, y = 0.5;



var locator = (function(){
  var element = document.getElementById('locator'),
      started;

  var floor_width = 500,
      floor_height = 589,
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
    }
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
    },
    toggle:function(){
      this[active ? 'stop' : 'start']();
    }
  }

})()








function vis_a(offset, done){
  console.log("offf", offset)

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

  for(var i = 1 ; i <= 4; i++){_
    (500)
    (_className(state(i%4)))
  }

  _(2000)

  for(var i = 1 ; i <= 4; i++){_
    (250)
    (_className(state(i%4)))
  }

  _(2000)

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
.when(8, function(timestamp){
  console.log("8 times")
  // this.pause();
  // show the animation
  // this.resume();
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
