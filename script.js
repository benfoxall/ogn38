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


// window.addEventListener("orientationchange", function() {
//   alert(window.orientation);
// }, false);

// alert(window.orientation);


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