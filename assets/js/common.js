class AnchorScroll{

    constructor(target){
      this.target = target;
      this.offset = document.querySelector('header').offsetHeight;
      this.speed = 3000;
    }
  
    get_position(){
      const href = this.target.getAttribute('href');
      const destination = document.querySelector(href == '#' || href ==""? 'html' : href);
      const position = destination.getBoundingClientRect().top + window.scrollY;
      return destination? position : window.scrollY;
    }
  
    scroll(){
      console.log(this);
      const position = this.get_position();
      window.scrollTo({
        top: position - this.offset,
        behavior: "smooth",
      });
  
    }
  
  }
  
  document.addEventListener('DOMContentLoaded', function(){
    
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link){
  
      link.addEventListener('click', function(e){
  
        e.preventDefault();
  
        const scroller = new AnchorScroll(e.currentTarget);
  
        scroller.scroll();
  
  
      }, {passive: false});
  
    });
  
  });