import $ from 'jquery';
import jQuery from 'jquery';
import move from "../common/domove";
move();

$(function(){
				var w=$(window).width();
				var left=parseInt((w-320)/2);
				$(".logres").css({"left":left+"px"});
				$(".register .hd ul li").click(function(){
					$(this).addClass("active").siblings().removeClass("active");
					$(".register .bd .reg-action").eq($(this).index()).css({"display":"block"}).siblings()
					.css({"display":"none"});
				})
				var regBtn=true;
				var logBtn=true;
					$(".registerBtn").click(function(){
						
						if(regBtn){
							$(".shade").css("display","block");
							$("body").css("overflow","hidden");
							$(".register").css({"display":"block"}).doMove({opacity:100,top:90},1,function(){regBtn=false;});
						}
				})
	
					$(".close-reg").click(function(){
						if(!regBtn){
							$(".shade").css("display","none");
							$("body").css("overflow","auto");
							$(".register").doMove({opacity:0,top:120},1,function(){
							$(this).css({"display":"none"});
							regBtn=true;
						});
						}
					})
					
					$(".loginBtn").click(function(){
						if(logBtn){
							$(".shade").css("display","block");
							$("body").css("overflow","hidden");
							$(".login").css({"display":"block"}).doMove({opacity:100,top:90},1,function(){logBtn=false;});
						}
						
					})
					
					$(".close-log").click(function(){
						if(!logBtn){
							$(".shade").css("display","none");
							$("body").css("overflow","auto");
							$(".login").doMove({opacity:0,top:120},1,function(){
							$(this).css({"display":"none"});
							logBtn=true;
					})
						}
						
			})
			$(".reglogBtn").click(function(){
				if(regBtn==false){
					$(".register").doMove({opacity:0,top:120},1,function(){
							$(this).css({"display":"none"});
							regBtn=true;
							$(".login").css({"display":"block"}).doMove({opacity:100,top:90},1,function(){logBtn=false;});
				})
				}
			})
			})
