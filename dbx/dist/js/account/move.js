'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _domove = require('../common/domove');

var _domove2 = _interopRequireDefault(_domove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _domove2.default)();

(0, _jquery2.default)(function () {
	var w = (0, _jquery2.default)(window).width();
	var left = parseInt((w - 320) / 2);
	(0, _jquery2.default)(".logres").css({ "left": left + "px" });
	(0, _jquery2.default)(".register .hd ul li").click(function () {
		(0, _jquery2.default)(this).addClass("active").siblings().removeClass("active");
		(0, _jquery2.default)(".register .bd .reg-action").eq((0, _jquery2.default)(this).index()).css({ "display": "block" }).siblings().css({ "display": "none" });
	});
	var regBtn = true;
	var logBtn = true;
	(0, _jquery2.default)(".registerBtn").click(function () {

		if (regBtn) {
			(0, _jquery2.default)(".shade").css("display", "block");
			(0, _jquery2.default)("body").css("overflow", "hidden");
			(0, _jquery2.default)(".register").css({ "display": "block" }).doMove({ opacity: 100, top: 90 }, 1, function () {
				regBtn = false;
			});
		}
	});

	(0, _jquery2.default)(".close-reg").click(function () {
		if (!regBtn) {
			(0, _jquery2.default)(".shade").css("display", "none");
			(0, _jquery2.default)("body").css("overflow", "auto");
			(0, _jquery2.default)(".register").doMove({ opacity: 0, top: 120 }, 1, function () {
				(0, _jquery2.default)(this).css({ "display": "none" });
				regBtn = true;
			});
		}
	});

	(0, _jquery2.default)(".loginBtn").click(function () {
		if (logBtn) {
			(0, _jquery2.default)(".shade").css("display", "block");
			(0, _jquery2.default)("body").css("overflow", "hidden");
			(0, _jquery2.default)(".login").css({ "display": "block" }).doMove({ opacity: 100, top: 90 }, 1, function () {
				logBtn = false;
			});
		}
	});

	(0, _jquery2.default)(".close-log").click(function () {
		if (!logBtn) {
			(0, _jquery2.default)(".shade").css("display", "none");
			(0, _jquery2.default)("body").css("overflow", "auto");
			(0, _jquery2.default)(".login").doMove({ opacity: 0, top: 120 }, 1, function () {
				(0, _jquery2.default)(this).css({ "display": "none" });
				logBtn = true;
			});
		}
	});
	(0, _jquery2.default)(".reglogBtn").click(function () {
		if (regBtn == false) {
			(0, _jquery2.default)(".register").doMove({ opacity: 0, top: 120 }, 1, function () {
				(0, _jquery2.default)(this).css({ "display": "none" });
				regBtn = true;
				(0, _jquery2.default)(".login").css({ "display": "block" }).doMove({ opacity: 100, top: 90 }, 1, function () {
					logBtn = false;
				});
			});
		}
	});
});