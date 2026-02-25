window.addEventListener('load', function () {
  class GlobalNavigation {
    constructor() {
      this.header = document.querySelector('header');
      this.gnavi = document.querySelector('.global_navigation[data-navigation-type="overlay"]');
      this.button = document.querySelector('header .menu');
      this.bg_button = document.querySelector('.bg_button');

      this.scrolled = window.scrollY;
      this.prev_pos = window.scrollY;
      this.scroll_end_timer = null;
      this.is_scrolling = false;

      this.init();
    }

    init() {
      this.adjust_menu_height();
      this.prev_pos_observe();
      this.bind();
    }

    adjust_menu_height() {
      const hh = this.header.offsetHeight;
      const wh = window.innerHeight;
      const nh = wh - hh;

      //this.gnavi.style.height = nh + 'px';
      this.gnavi.style.top = '0px';
      this.gnavi.querySelector('.panel').style.paddingTop = hh + 'px';
    }

    bind() {
      window.addEventListener('resize', this.adjust_menu_height.bind(this));

      window.addEventListener('scroll', () => {
        this.is_scrolling = true;
        this.set_scroll_pos();
        this.header_observe();

        clearTimeout(this.scroll_end_timer);
        this.scroll_end_timer = setTimeout(() => {
          this.is_scrolling = false;
        }, 100);

      });

      this.button.addEventListener('click', this.toggle.bind(this));
      this.bg_button.addEventListener('click', this.toggle.bind(this));

      const links = this.gnavi.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', this.close.bind(this));
      });
    }

    toggle(event) {
      this.header.classList.toggle('active');
      this.menu_fix();
      if (event) event.stopPropagation();
    }

    close(event) {
      this.header.classList.remove('active');

      const is_anchor = event?.target?.getAttribute('href')?.startsWith('#');
      this.menu_fix(true, is_anchor);
      if (event) event.stopPropagation();
    }

    menu_fix(close = false, skip_scroll = false) {
      const body = document.body;
      const bodyTop = parseInt(window.getComputedStyle(body).top) || 0;
      const scrolled = -1 * bodyTop;

      if (!this.header.classList.contains('active') || close) {
        body.style.width = 'auto';
        body.style.height = 'auto';
        body.style.overflow = 'visible';
        body.style.top = '0';

        // ここでスクロールのキャンセルを防ぐ
        if (!skip_scroll) {
          window.scrollTo(0, scrolled);
        }

      } else {
        body.style.width = '100%';
        body.style.height = '100%';
        body.style.overflow = 'hidden';
        body.style.top = `-${this.scrolled}px`;
      }
    }

    header_observe(){

      //ある程度スクロールしたらスクロールドクラス付与
      const threshold = 100;
      
      if(this.scrolled >= threshold){
        this.header.classList.add('_scrolled');
      }else{
        this.header.classList.remove('_scrolled');
      }

      // 上方向のスクロール検知
      const move = document.documentElement.dataset.device == "smartphone"? -100 : -200;

      if(!this.header.classList.contains('_scroll_up') && this.scrolled - this.prev_pos < move){
        this.header.classList.add('_scroll_up');
      }
      if(this.scrolled - this.prev_pos > 30){
        this.header.classList.remove('_scroll_up');
      }

    }

    set_scroll_pos(){

      this.scrolled = window.scrollY || document.documentElement.scrollTop;

    }

    prev_pos_observe(){

      this.scroll_observer_timer = setInterval(()=>{
        
        if(!this.is_scrolling) return;
        this.prev_pos = this.scrolled;

      }, 100);
      
    }

  }

  window._global_navigation = new GlobalNavigation();
});