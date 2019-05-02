module.exports = {
    ifeq: function(a, b, options){
      if (a === b) {
        return options.fn(this);
        }
      return options.inverse(this);
    },
    bar: function(){
      return "BAR!";
    },
    getOra: function(data){
      let x = new Date(data);
      return x.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    },
    getGiorno: function(data){
      let x = new Date(data);
      return x.toDateString();
    }
  
  }