var r = repeater()
.when(4, function(timestamp){
  // this.pause();
  // show the animation
  // this.resume();
  console.log("4 times", timestamp)
})
.when(8, function(timestamp){
  console.log("8 times")
  // this.pause();
  // show the animation
  // this.resume();
})







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