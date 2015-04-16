var _animator = document.getElementById('animator');

var _canvas_style = {
			position: 'fixed',
			top: 0,
			left: 0,
			zIndex: 1,
		};

for(var key in _canvas_style) {
	_animator.style[key] = _canvas_style[key];
}

var Content = {
	getAnimator: function() {
		return _animator;
	}
};

var sizingCanvas = function() {
	var _c = _animator;
	_c.width = window.innerWidth;
	_c.height = window.innerHeight;

	_c.style.width = _c.width + "px";
	_c.style.height = _c.height + "px";
}

sizingCanvas();
window.addEventListener("resize", function() {
	sizingCanvas();
	ScrollingHandler.forceFireEvent();
});


var section_imgs = [],
	section_height = 700,   // Number: each section height in term of px
	pixel_per_frame, 		// Number: term of how many pixel height for each frame. It is defined as section_height/number_of_frames_per_section
	current_section,
	bottom_textboxs,
	max_frame_index,		// Max frame have
	num_sections,			// Number of section have in this page
	leading_zero;
section_imgs[0] = [];

var playAnimation = function(section, top, _c) {
	current_section = section;
	pixel_per_frame = section_height / section_imgs[current_section].length;	
	var frame_play = parseInt((top % (section_imgs[current_section].length * pixel_per_frame))/pixel_per_frame);
	
	if(frame_play >= 0){
		var ctx = _c.getContext("2d");

		// retrieve frame size
		var frame_width = _c.width, 
			frame_height = _c.width * 380 / 470,
			offset_left = 0, 
			offset_top = 0;

		if(_c.width >= 470){
			// tablet
			frame_width = 470;

			if(_c.width >= 1000) {
				// large desktop
				frame_width = 600;
			}else if(_c.width >= 720){
				// desktop
				frame_width = 600;
			}
			// auto height as given ratio
			frame_height = frame_width * 380 / 470;
			offset_left = (_c.width - frame_width) / 2;
		}

		// offset_top configuration
		if(top < 300){
			var middle_top = (_c.height - frame_height)/2;
			offset_top = middle_top - (middle_top / 300 * top);
		}
		

		// animation at very bottom configuration
		if(top >= section_imgs.length * section_height ){
			// make sure the last animation remains showing
			frame_play = section_imgs[current_section].length - 1;
		}

		// playing frame
		ctx.clearRect ( 0 , 0 , _c.width, _c.height );
		ctx.drawImage(section_imgs[current_section][frame_play],offset_left,offset_top,frame_width,frame_height);
	}
};

var ScrollingHandler = {
	_event: function(top) {
		var _c = Content.getAnimator();
		
		if(top <= 200) {
			var es = document.getElementsByClassName('title')
			for (var i = 0; i < es.length; i++) {
				es[i].style.display = 'block';
				es[i].style.opacity = 1.0 - (top/200.0);
			};
		}else{
			var es = document.getElementsByClassName('title')
			for (var i = 0; i < es.length; i++) {
				es[i].style.display = 'none';
			};
		}

		// canvas animation
		if(top <= 0) {
			var ctx = _c.getContext("2d");
			ctx.clearRect ( 0 , 0 , _c.width, _c.height );
		}else if(top > 0 && top < section_height) {
			// section one
			playAnimation(0 ,top, _c);
		}else if(top > (section_height) && top <= (section_height*2)) {
			// section two
			playAnimation(1 ,top, _c);
		}else if(top > (section_height*2)) {
			// section three
			playAnimation(2 ,top, _c);
		}

		// text at bottom
		var offset = 200;
		var triggle_height = section_height / 2;
		if(_c.width > 500) {
			triggle_height = 600;
			offset = 300;
		}

		for(var i = 0; i < bottom_textboxs.length; i += 1){
			var textbox_top = bottom_textboxs[i].getBoundingClientRect().top;
			// console.log(bottom_textboxs[i].className + " " + bottom_textboxs[i].getBoundingClientRect().top);
			if(textbox_top < triggle_height && section_imgs.length * section_height > top){
				// var offset = 200;
				var decline_vertical = (section_height / 2 ) - offset;
				var opacity = (textbox_top - offset) / decline_vertical;
				if(opacity <= 0){
					bottom_textboxs[i].style.opacity = 0.0;
				}else{
					bottom_textboxs[i].style.opacity = opacity;
				}
				
			}else{
				bottom_textboxs[i].style.opacity = 1.0;
			}
		}
		
	},
	forceFireEvent: function(){
		this._event(window.pageYOffset);
	},
	initial: function() {
		max_frame_index = 0;
		bottom_textboxs = document.getElementsByClassName('bottom');

		// load image
		// section 1 image
		for (var i = 0; i < 42; i++) {
			if(i < 32){
				// unsaturated state
				leading_zero = "000000" + i;	
			}else{
				// saturated state
				leading_zero = "00000031";
			}
			
			leading_zero = leading_zero.substr(leading_zero.length - 3);

			section_imgs[0][i] = new Image();
			section_imgs[0][i].src = "frames/obj1/reactjs_explain0"+leading_zero+".png";
			max_frame_index += 1;
		};

		// section 2 image
		section_imgs[1] = [];
		for (var i = 0; i < 65; i++) {

			if(i < 53){
				// unsaturated state
				leading_zero = "000000" + (i + 62);
			}else{
				// saturated state
				leading_zero = "000000114";
			}
			leading_zero = leading_zero.substr(leading_zero.length - 3);

			section_imgs[1][i] = new Image();
			section_imgs[1][i].src = "frames/obj1/reactjs_explain0"+leading_zero+".png";
			max_frame_index += 1;
		};

		// section 3 image
		section_imgs[2] = [];
		for (var i = 0; i < 62; i++) {
			leading_zero = "000000" + (i + 151);
			leading_zero = leading_zero.substr(leading_zero.length - 3);

			section_imgs[2][i] = new Image();
			section_imgs[2][i].src = "frames/obj1/reactjs_explain0"+leading_zero+".png";
			max_frame_index += 1;
		};


		// initial text
		// var _c = Content.getAnimator();
		// ctx = _c.getContext('2d');
		// ctx.textAlign='center';
		// ctx.font='30px Arial';
		// ctx.fillText('<Flux> playground', _c.width/2,_c.height/2);

	}
};


var FLAG_SHOW = 1,
	FLAG_HIDE = 0;

var ScrollDownInstructor = {
	height: 62, // scroll-down.png image height
	stateShowFlag: true,  // true when this components is show, and false when this components is hidden
	componentDidMount: function() {
		if(window.pageYOffset < 50){
			this.show();
		}else{
			this.hide();
		}
		var self = this;
		var _event = function() {
			if(window.pageYOffset < 50){
	    		// false means, this component is in hide state
	    		if(!self.stateShowFlag){
	    			// doing this action when scrollDown component is hide
	    			self.show();
	    		}
	    	}else{
	    		if(self.stateShowFlag){
	    			self.hide();
	    		}
	    	}
		}
		window.addEventListener('scroll', _event, false);
	},
	componentWillUnmount: function() {
        window.removeEventListener('scroll', this.onScroll, false);
    },
	getInitialState: function() {
		this.ele = document.getElementsByClassName("scroll-down")[0];
		this.ele.style.bottom = '50px';
  	},
  	hide: function() {
  		this.ele.style.bottom = (- 2 * this.height - 50)+'px';
  		this.stateShowFlag = false;
  	},
  	show: function() {
  		this.ele.style.bottom = '50px';
  		this.stateShowFlag = true;
  	},
	render: function() {
		this.getInitialState();
		this.componentDidMount();

		var s1 = {
			// backgroundColor: 'red'
		};
		var _style = {
			width: this.height + 'px',
			position: 'fixed',
			left: ((window.innerWidth - this.height) / 2) + 'px',

			// transition
			webkitTransition: '0.5s ease-in-out',
			mozTransition: '0.5s ease-in-out',
			oTransition: '0.5s ease-in-out',
			transition: '0.5s ease-in-out',
		};

		var _img_style = {
			margin: '0 auto',
			display: 'block',
			width: this.height + 'px'
		};
		
		for(var key in _style) {
			this.ele.style[key] = _style[key];
		}
		var _img = this.ele.getElementsByTagName("img")[0];
		console.log(_img);
		for(var key in _img_style) {
			_img.style[key] = _img_style[key];
		}
	},
};
ScrollDownInstructor.render();

ScrollingHandler.initial();
ScrollingHandler.forceFireEvent();

var currentTop = 0;
// interval event
setInterval(function() {
	if(currentTop !== window.pageYOffset){
		currentTop = window.pageYOffset;
		ScrollingHandler._event(currentTop);
	}
	
}, 1000 / 30);

