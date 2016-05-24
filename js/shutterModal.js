// Shutter Modal js
// Copyright (c) 2015 Sandeep MT - http://mtsandeep.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
;(function($){ 
	$.fn.extend({  
		shutterModal: function(options) {

			var defaults = {
				background: 'rgba(0,0,0,0.8)',
				zIndex:99,
				url: '',
				easing: 'swing',
				duration: 1000,
				showAfter: 0,
				hideAfter: 0,
				close: true,
				escClose: true,
				remove: false,
				onLoad : function(){},
				onClose : function(){}
			};
			  
			var options = $.extend(defaults, options); 
			return this.each(function() {
				var o = options; 
				var pageCover = '<div id="shutter-cover" style="position:fixed;top:0;left:0;width:100%;background:'+o.background+';z-index:'+o.zIndex+';margin-top:-'+$(window).height()+'px;overflow:auto;"></div>';
				var close ='<a class="shutter-close" href="#">X</a>';
				
				var element = $(this);
				var $this = prepareShutter(element);
				
				if(o.showAfter) {
					setTimeout(function() {
						shutter();
					}, o.showAfter);
				} else {
					shutter();
				}
				
				if(o.hideAfter){
					 setTimeout(function() {
						closeShutter();
					  }, o.showAfter+o.hideAfter);
				} else if(o.remove){
					closeShutter();
				}
				
				if(o.escClose) {
					$(document).bind('keyup.shutter', function(e){
					   if (e.which == 27) {
							closeShutter();
					   }
					});
				}
				
				$this.delegate('.shutter-close','click', function(e) { //replacing live with delegate to support v1.7
					e.preventDefault();
					closeShutter();
				});
				
				on_resize(function(){
					fixPosition();
				});
				
				function prepareShutter(element){
					$('body').append(pageCover); //added the page cover to body
					var contentWrapper = $('<div id="shutter-content"></div>');
					
					if(o.url){ //check if url is provided, if yes load that to the div
						$('body').find('#shutter-cover').html(contentWrapper);
						$.get( o.url, function(data) {
							$('body').find('#shutter-content').append(data).addClass('shutter'); // appending so as not to remove the close button
							fixPosition(); // make sure size is properly done after getting content
						});
					} else {
						var modalContent = contentWrapper.html(element.clone().show());
						modalContent.addClass('shutter');
						$('body').find('#shutter-cover').html(modalContent);
					}
					
					return $('body').find('#shutter-content');
				}
				
				function shutter(){
					showClose();
					
					$('body').data('orig-style',$('body').attr('style'));
					$('body').css('overflow','hidden');
					
					fixPosition();
					
					$('#shutter-cover').animate({marginTop:0}, o.duration, o.easing, function(){
						o.onLoad($this); //callback after shutter is loaded and displayed
					});					
				}
				
				function showClose(){
					if(o.close){
						if ($this.children('.shutter-close').length){
							$this.children('.shutter-close').show();
						} else {
							$this.prepend(close);
						}
					}
				}
				
				function fixPosition(){
					var windowHeight = $(window).height();
					var remainingHeight = windowHeight - $('#shutter-content').outerHeight(true);
					
					$('#shutter-cover').css({'height': windowHeight});
					if($('#shutter-content').outerHeight(true) <= windowHeight){ // if content is having lesss height than window we will center the content using top value
						$('#shutter-content').css('position', 'absolute').css({top: remainingHeight/2, left: ($('#shutter-content').width() <= $(window).width()) ? ($(window).width() - $('#shutter-content').width())/2 : 0, 'z-index': o.zIndex+9});
					} else { // when height is less, we remove our top values if any
						$('#shutter-content').removeAttr('style').css({'z-index': o.zIndex+9});
					}
				}
				
				// resize with delay
				function on_resize(c,t){
					$(window).bind('resize.shutter',function(){ 
						clearTimeout(t);	
						t = setTimeout(c, 50); 
					});
				}
					
				function closeShutter(){
					$(window).unbind('resize.shutter');
					$(document).unbind('keyup.shutter');
					$('#shutter-cover').animate({marginTop:-$(window).height()}, o.duration, o.easing, function(){
						o.onClose($this); //callback after shutter is removed
						$('#shutter-cover').remove(); //remove everything
						$('body').removeAttr('style').attr('style',$('body').data('orig-style'));
					});
				}
			
			}); 
		} 
	}); 
})(jQuery);
