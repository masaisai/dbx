﻿///#source 1 1 /js/hybicon.core.js
/* ======================================================================================= */
/*                                   hybicon.core.js                                       */
/* ======================================================================================= */
/* This is a small JavaScript library for animated SVG based icons.                        */
/* Requires Raphaël JavaScript Vector Library (http://raphaeljs.com)                       */
/* ======================================================================================= */
/* Check http://hybicon.softwaretailoring.net for samples.                                 */
/* Fork https://github.com/softwaretailoring/hybicon for contribution.                     */
/* ======================================================================================= */
/* Copyright © 2015 Gábor Berkesi (http://softwaretailoring.net)                           */
/* Licensed under MIT (https://github.com/softwaretailoring/hybicon/blob/master/LICENSE)   */
/* ======================================================================================= */

/* ======================================================================================= */
/* Documentation: http://hybicon.softwaretailoring.net                                     */
/* ======================================================================================= */

hybicon = function (divId) {

    this.version = "1.0.1";
    this.holderId = "hybicon";

    if (divId !== undefined &&
        divId !== null) {
        this.holderId = divId;
    }

    this.holderDiv = document.getElementById(divId);

    if ((this.holderDiv === null ||
        this.holderDiv === undefined)) {
        return this;
    }
    
    //Prepare raphael's div
    var removeChildrens = [];
    for (var i = 0; i < this.holderDiv.children.length; i++) {
        if (this.holderDiv.children[i].localName === "svg") {
            removeChildrens.push(this.holderDiv.children[i]);
        }
    }

    for (var i = 0; i < removeChildrens.length; i++) {
        this.holderDiv.removeChild(removeChildrens[i]);
    }

    //Private properties
    this.icon1X = null;
    this.icon1Y = null;
    this.icon1Height = null;
    this.icon1Width = null;
    this.icon1Scale = null;
    this.icon1XAnim = null;
    this.icon1YAnim = null;
    this.icon1HeightAnim = null;
    this.icon1WidthAnim = null;
    this.icon1ScaleAnim = null;
    this.icon2X = null;
    this.icon2Y = null;
    this.icon2Height = null;
    this.icon2Width = null;
    this.icon2Scale = null;
    this.icon2XAnim = null;
    this.icon2YAnim = null;
    this.icon2HeightAnim = null;
    this.icon2WidthAnim = null;
    this.icon2ScaleAnim = null;

    //Public properties
    this.icon1Path = null;
    this.icon2Path = null;

    if (window["hybiconbase"] !== undefined) {
        this.icon1Path = hybiconbase.user;
        this.icon2Path = hybiconbase.idea;
    }

    this.icon1Color = "#222";
    this.icon1Stroke = "none";
    this.icon1StrokeWidth = 0;
    this.icon1PathAnim = null;

    this.icon1InitSettings = null;
    this.icon1Init = new this.hybiconSettings();

    this.icon1AnimSettings = null;
    this.icon1Anim = new this.hybiconSettings();

    this.icon2Color = "#222";
    this.icon2Stroke = "none";
    this.icon2StrokeWidth = 0;
    this.icon2PathAnim = null;

    this.icon2InitSettings = null;
    this.icon2Init = new this.hybiconSettings();
    
    this.icon2AnimSettings = null;
    this.icon2Anim = new this.hybiconSettings();

    this.animateTime = null;
    this.animateEasing = null;
    this.hoverMode = null;
    this.clickMode = null;
    this.hovered = false;
    this.clicked = false;
    this.infoMode = null;
    this.infoText = "HYBICON";
    this.infoFillColor = "#939393";
    this.infoStrokeColor = "#939393";
    this.infoTextColor = "#FFF";

    this.hybiconSize = 100;
    this.hybiconAlign = "center";
    this.hybiconBorder = "";
    this.hybiconBorderRadius = "";
    this.hybiconBackground = "";

    this.positioning = "topright";

    this.parseIcon();

    return this;
};

hybicon.prototype.createIcon = function () {

    var iconWidth = 100;
    var iconHeight = 100;

    var infoType = null;
    var infoSize = 0;

    if (this.infoMode !== null) {
        var infoModeParams = this.infoMode.split('-');
        if (infoModeParams.length > 1) {
            infoType = infoModeParams[0];
            infoSize = Number(infoModeParams[1]);
        }
        else {
            infoType = this.infoMode;
            if (infoType === "right") { infoSize = 200; }
        }
    }

    iconWidth += infoSize;

    // Set style
    if (this.hybiconSize !== "css") { // When size via JavaScript
        this.holderDiv.style.width = ((iconWidth / 100) * this.hybiconSize).toString() + "px";
        this.holderDiv.style.height = this.hybiconSize + "px";
    }

    switch (this.hybiconAlign) {
        case "left":
            this.holderDiv.style.marginRight = "auto";
            break;
        case "right":
            this.holderDiv.style.marginLeft = "auto";
            break;
        default:
            this.holderDiv.style.margin = "auto";
    }

    this.raphael = new Raphael(this.holderId);
    this.raphael.canvas.id = this.getSvgId();

    this.raphael.setViewBox(0, 0, iconWidth, iconHeight, true);

    // Set style of svg
    if (this.hybiconSize === "css") { // Responsive behaviour is possible via CSS
        this.holderDiv.firstChild.style.width = "100%";
        this.holderDiv.firstChild.style.height = "100%";
    }
    this.holderDiv.firstChild.style.border = this.hybiconBorder;
    this.holderDiv.firstChild.style.borderRadius = this.hybiconBorderRadius;
    this.holderDiv.firstChild.style.background = this.hybiconBackground;

    this.setDefaultProps();

    this.icon1Transform = this.getTransformString(this.icon1X, this.icon1Y, this.icon1Scale, this.icon1Init.rotate);
    this.icon1TransformAnim = this.getTransformString(this.icon1XAnim, this.icon1YAnim, this.icon1ScaleAnim, this.icon1Anim.rotate);
    if (this.icon2Path !== null) {
        this.icon2Transform = this.getTransformString(this.icon2X, this.icon2Y, this.icon2Scale, this.icon2Init.rotate);
        this.icon2TransformAnim = this.getTransformString(this.icon2XAnim, this.icon2YAnim, this.icon2ScaleAnim, this.icon2Anim.rotate);
    }

    if ((this.hoverMode !== null) || (this.clickMode != null)) {
        this.icon1 = this.raphael.path(this.icon1Path);
        this.icon1.attr({ transform: this.icon1Transform });
        if (this.icon2Path !== null) {
            this.icon2 = this.raphael.path(this.icon2Path);
            this.icon2.attr({ transform: this.icon2Transform });
        }
    }
    else {
        this.icon1 = this.raphael.path(this.icon1PathAnim);
        this.icon1.attr({ transform: this.icon1TransformAnim });
        if (this.icon2PathAnim !== null) {
            this.icon2 = this.raphael.path(this.icon2PathAnim);
            this.icon2.attr({ transform: this.icon2TransformAnim });
        }
    }

    if (infoType !== null) {

        if (infoType === "" ||
            infoType === "bottomright") {
            this.infoFont = '100 12px Arial, Helvetica, sans-serif';
            var infobottomright = "M50,100,L100,50,L100,85,Q100,100,85,100,z";
            this.info = this.raphael.path(infobottomright);
            this.infotext = this.raphael.text(82, 82, this.infoText).attr({ transform: "r-45" });
        }

        if (infoType === "right") {
            this.infoFont = '100 50px Arial, Helvetica, sans-serif';
            var infoScaleX = (infoSize / 200);
            var infoTranslateX = ((infoSize - 200) / 2) - 3;
            var inforight = "m 297.34441,21.317398 q 0,-9.703729 -12.41277,-9.703729 l -161.36591,0 q -12.41276,0 -12.41276,9.703729 l 0,19.407449 -11.112757,9.703727 11.112757,9.703722 0,19.407453 q 0,9.703728 12.41276,9.703728 l 161.36591,0 q 12.41277,0 12.41277,-9.703728 z";
            this.info = this.raphael.path(inforight).attr({ transform: "s" + infoScaleX + ",1,T" + infoTranslateX + ",0" });
            this.infotext = this.raphael.text(100 + (infoSize / 2), 50, this.infoText);
        }

        if (this.info != null) {
            this.info.attr({ fill: this.infoFillColor, stroke: this.infoStrokeColor, 'stroke-width': 2, override: 'hidden' });
            this.infotext.attr({ font: this.infoFont, fill: this.infoTextColor, stroke: 'none' });
            this.info.id = this.getInfoId();
            this.info.node.id = this.info.id;
            this.infotext.id = this.getInfoTextId();
            this.infotext.node.childNodes[0].id = this.infotext.id;
        }
    }

    this.icon1.id = this.getIcon1Id();
    this.icon1.node.id = this.icon1.id;
    this.icon1.attr({ fill: this.icon1Color, stroke: this.icon1Stroke, 'stroke-width': this.icon1StrokeWidth });

    if (this.icon2 !== undefined) {
        this.icon2.id = this.getIcon2Id();
        this.icon2.node.id = this.icon2.id;
        this.icon2.attr({ fill: this.icon2Color, stroke: this.icon2Stroke, 'stroke-width': this.icon2StrokeWidth });
    }

    this.iconRect = this.raphael.rect(0, 0, iconWidth, iconHeight);
    this.iconRect.attr({ fill: "#FFF", "fill-opacity": 0, stroke: "none", cursor: "pointer" });

    this.iconHolder = this.raphael.set();

    if (this.icon2 !== undefined) {
        this.iconHolder.push(
            this.icon1,
            this.icon2,
            this.iconRect
        );
    }
    else {
        this.iconHolder.push(
            this.icon1,
            this.iconRect
        );
    }

    var thishybicon = this;

    if (this.hoverMode !== null) {
        this.iconHolder.mouseover(function () {
            if (thishybicon.hovered !== true &&
                thishybicon.clicked !== true) {
                thishybicon.hovered = true;
                thishybicon.animateIcon(true);
            }
        });
        this.iconHolder.mouseout(function () {
            if (thishybicon.clicked !== true) {
                thishybicon.hovered = false;
                thishybicon.animateIcon(false);
            }
        });
    }

    if (this.clickMode !== null) {
        this.iconHolder.click(function () {
            if (thishybicon.clicked !== true) {
                thishybicon.clicked = true;
                thishybicon.animateIcon(true);
            }
            else {
                thishybicon.clicked = false;
                thishybicon.animateIcon(false);
            }
        });
    }

    return this;
};

hybicon.prototype.animateIcon = function (hovered) {
    if (hovered === true) {
        this.icon1.animate({ path: this.icon1PathAnim, transform: this.icon1TransformAnim }, this.animateTime, this.animateEasing);
        if (this.icon2PathAnim !== null) {
            this.icon2.animate({ path: this.icon2PathAnim, transform: this.icon2TransformAnim }, this.animateTime, this.animateEasing);
        }
    }
    else {
        this.icon1.animate({ path: this.icon1Path, transform: this.icon1Transform }, this.animateTime, this.animateEasing);
        if (this.icon2Path !== null) {
            this.icon2.animate({ path: this.icon2Path, transform: this.icon2Transform }, this.animateTime, this.animateEasing);
        }
    }
};

//Parse html5 data- attributes
hybicon.prototype.parseIcon = function () {
    if (this.holderDiv !== undefined &&
        this.holderDiv !== null) {
        //data-hybicon attribute is required
        var hybiconHasData = this.holderDiv.hasAttribute("data-hybicon");
        if (hybiconHasData) {

            // Set icon class
            var iconClassName = "hybiconbase";
            var hybiconClass = this.holderDiv.getAttribute("data-hybicon-iconclass");
            if (hybiconClass !== null) {
                iconClassName = hybiconClass;
            }

            var iconClass = window[iconClassName];

            if (iconClass !== undefined) {
                // set primary and secondary icons
                var hybiconData = this.holderDiv.getAttribute("data-hybicon");

                var icons = hybiconData.split("-");
                if (icons.length === 2) {
                    if (iconClass[icons[0]] !== undefined &&
                        iconClass[icons[0]] !== null) {
                        this.icon1Path = iconClass[icons[0]];
                    }
                    if (iconClass[icons[1]] !== undefined &&
                        iconClass[icons[1]] !== null) {
                        this.icon2Path = iconClass[icons[1]];
                    }
                }
                else {
                    if (iconClass[hybiconData] !== undefined &&
                        iconClass[hybiconData] !== null) {
                        this.icon1Path = iconClass[hybiconData];
                        this.icon1Init.centerX = 50;
                        this.icon1Init.centerY = 50;
                        this.icon2Path = null;
                    }
                }

                //set predefined icons
                if (iconClass.setpresets !== undefined) {
                    iconClass.setpresets(this, hybiconData);
                }
            }
            else {
                this.icon1Path = "M0,0L100,100M100,0L0,100";
                this.icon1Stroke = "#222";
                this.icon1StrokeWidth = 2;
            }

            //data-hybicon-size
            var hybiconSize = this.holderDiv.getAttribute("data-hybicon-size");
            if (hybiconSize !== null) {
                this.hybiconSize = hybiconSize;
            }

            //data-hybicon-align
            var hybiconAlign = this.holderDiv.getAttribute("data-hybicon-align");
            if (hybiconAlign !== null) {
                this.hybiconAlign = hybiconAlign;
            }

            //data-hybicon-border
            var hybiconBorder = this.holderDiv.getAttribute("data-hybicon-border");
            if (hybiconBorder !== null) {
                this.hybiconBorder = hybiconBorder;
            }

            //data-hybicon-borderradius
            var hybiconBorderradius = this.holderDiv.getAttribute("data-hybicon-borderradius");
            if (hybiconBorderradius !== null) {
                this.hybiconBorderRadius = hybiconBorderradius;
            }

            //data-hybicon-color
            var hybiconColor = this.holderDiv.getAttribute("data-hybicon-color");
            if (hybiconColor !== null &&
                hybiconColor !== "") {
                this.icon1Color = hybiconColor;
                this.icon2Color = hybiconColor;
            }

            //data-hybicon-background
            var hybiconBackground = this.holderDiv.getAttribute("data-hybicon-background");
            if (hybiconBackground !== null) {
                this.hybiconBackground = hybiconBackground;
            }

            //data-hybicon-hovermode
            var hybiconHovermode = this.holderDiv.getAttribute("data-hybicon-hovermode");
            if (hybiconHovermode !== null) {
                this.hoverMode = hybiconHovermode;
            }

            //data-hybicon-clickmode
            var hybiconClickmode = this.holderDiv.getAttribute("data-hybicon-clickmode");
            if (hybiconClickmode !== null) {
                this.clickMode = hybiconClickmode;
            }

            //data-hybicon-infomode
            var hybiconInfomode = this.holderDiv.getAttribute("data-hybicon-infomode");
            if (hybiconInfomode !== null) {
                this.infoMode = hybiconInfomode;
            }

            //data-hybicon-infotext
            var hybiconInfotext = this.holderDiv.getAttribute("data-hybicon-infotext");
            if (hybiconInfotext !== null) {
                this.infoText = hybiconInfotext;
            }

            //data-hybicon-positioning
            var hybiconPositioning = this.holderDiv.getAttribute("data-hybicon-positioning");
            if (hybiconPositioning !== null &&
                hybiconPositioning !== "") {
                this.positioning = hybiconPositioning;
            }

            //data-hybicon-icon1init
            var hybiconIcon1Init = this.holderDiv.getAttribute("data-hybicon-icon1init");
            if (hybiconIcon1Init !== null) {
                this.icon1InitSettings = hybiconIcon1Init;
            }

            //data-hybicon-icon1anim
            var hybiconIcon1Anim = this.holderDiv.getAttribute("data-hybicon-icon1anim");
            if (hybiconIcon1Anim !== null) {
                this.icon1AnimSettings = hybiconIcon1Anim;
            }

            //data-hybicon-icon2init
            var hybiconIcon2Init = this.holderDiv.getAttribute("data-hybicon-icon2init");
            if (hybiconIcon2Init !== null) {
                this.icon2InitSettings = hybiconIcon2Init;
            }

            //data-hybicon-icon2anim
            var hybiconIcon2Anim = this.holderDiv.getAttribute("data-hybicon-icon2anim");
            if (hybiconIcon2Anim !== null) {
                this.icon2AnimSettings = hybiconIcon2Anim;
            }

            //data-hybicon-animtime
            var hybiconAnimatetime = this.holderDiv.getAttribute("data-hybicon-animtime");
            if (hybiconAnimatetime !== null &&
                hybiconAnimatetime !== "") {
                this.animateTime = hybiconAnimatetime;
            }

            //data-hybicon-animease
            var hybiconAnimateeasing = this.holderDiv.getAttribute("data-hybicon-animease");
            if (hybiconAnimateeasing !== null &&
                hybiconAnimateeasing !== "") {
                this.animateEasing = hybiconAnimateeasing;
            }

            this.createIcon();
        }

        var removeChildrens = [];
        for (var i = 0; i < this.holderDiv.children.length; i++) {
            if (this.holderDiv.children[i].localName !== "svg") {
                removeChildrens.push(this.holderDiv.children[i]);
            }
        }

        for (var i = 0; i < removeChildrens.length; i++) {
            this.holderDiv.removeChild(removeChildrens[i]);
        }
    }
};

hybicon.prototype.parseAll = function () {
    var hybicons = document.querySelectorAll('[data-hybicon]');

    for (var i = 0; i < hybicons.length; i++) {
        var hybiconid = hybicons[i].id;
        if (hybiconid === "")
        {
            hybiconid = hybicons[i].getAttribute("data-hybicon");
            if (hybiconid === "") { hybiconid = "hybicon"; };
            if (document.getElementById(hybiconid)) {
                thishybicon = document.getElementById(hybiconid);
                var counter = 1;
                while (thishybicon) {
                    counter++;
                    var newhybiconid = hybiconid + counter;
                    thishybicon = document.getElementById(newhybiconid);
                }
                hybiconid += counter;
            }
            hybicons[i].id = hybiconid;
        }
        new hybicon(hybiconid);
    }
};

//Set default properties
hybicon.prototype.setDefaultProps = function () {

    this.setIconSettings(this.icon1Init, this.icon1InitSettings);
    this.setIconSettings(this.icon1Anim, this.icon1AnimSettings);
    this.setIconSettings(this.icon2Init, this.icon2InitSettings);
    this.setIconSettings(this.icon2Anim, this.icon2AnimSettings);

    // default values
    var icon1SizeDefault = 77;
    var icon2SizeDefault = 33;
    if (this.icon2Path === null) {
        icon1SizeDefault = 62;
        if (this.hoverMode === "" && this.icon1Anim.size === null) { this.icon1Anim.size = 71; }
    }
    var icon1CenterXDefault = 45;
    var icon1CenterYDefault = 55;
    var icon2CenterXDefault = 80;
    var icon2CenterYDefault = 20;
    if (this.positioning === "topleft") {
        icon1CenterXDefault = 55;
        icon1CenterYDefault = 55;
        icon2CenterXDefault = 20;
        icon2CenterYDefault = 20;
    }
    if (this.positioning === "center") {
        icon1CenterXDefault = 50;
        icon1CenterYDefault = 50;
        icon2CenterXDefault = 50;
        icon2CenterYDefault = 50;
        icon2SizeDefault = 44;
    }

    if (this.icon1Init.size === null) { this.icon1Init.size = icon1SizeDefault; }
    if (this.icon1Init.centerX === null) { this.icon1Init.centerX = icon1CenterXDefault; }
    if (this.icon1Init.centerY === null) { this.icon1Init.centerY = icon1CenterYDefault; }
    if (this.icon1Init.rotate === null) { this.icon1Init.rotate = 0; }
    if (this.icon2Init.size === null) { this.icon2Init.size = 0; }
    if (this.icon2Init.centerX === null) { this.icon2Init.centerX = icon2CenterXDefault; }
    if (this.icon2Init.centerY === null) { this.icon2Init.centerY = icon2CenterYDefault; }
    if (this.icon2Init.rotate === null) { this.icon2Init.rotate = 0; }

    // handle hover and click modes
    if (this.hoverMode === "switch" ||
        this.clickMode === "switch") {
        if (this.positioning === "center") {
            if (this.icon1Anim.size === null) { this.icon1Anim.size = 0; }
            this.icon2Anim.size = icon2SizeDefault;
        }
        else {
            this.icon1Anim.centerX = this.icon2Init.centerX;
            this.icon1Anim.centerY = this.icon2Init.centerY;
            this.icon2Anim.centerX = this.icon1Init.centerX;
            this.icon2Anim.centerY = this.icon1Init.centerY;
            if (this.icon2Init.size === 0) { this.icon1Anim.size = icon2SizeDefault; }
            else { this.icon1Anim.size = this.icon2Init.size; }
            if (this.icon2Anim.size === null) { this.icon2Init.size = icon2SizeDefault; }
            else { this.icon2Init.size = this.icon2Anim.size; }
            this.icon2Anim.size = this.icon1Init.size;
        }
    }
    if (this.hoverMode === "rotate" ||
        this.clickMode === "rotate") {
        if (this.icon2Anim.size === null) { this.icon2Init.size = icon2SizeDefault; }
        else { this.icon2Init.size = this.icon2Anim.size; }

        var rotatedeg = "360";
        if (this.clickMode === "rotate") { rotatedeg = "180"; }

        if (this.icon2Path !== null) {
            if (this.icon2Anim.rotate === null) { this.icon2Anim.rotate = rotatedeg; }
        }
        else {
            if (this.icon1Anim.rotate === null) { this.icon1Anim.rotate = rotatedeg; }
        }
    }

    // set width and height
    if (this.icon1Height === null) { this.icon1Height = this.icon1Init.size; }
    if (this.icon1Width === null) { this.icon1Width = this.icon1Init.size; }
    if (this.icon2Height === null) { this.icon2Height = this.icon2Init.size; }
    if (this.icon2Width === null) { this.icon2Width = this.icon2Init.size; }

    // icon1
    var sizeTransform = this.getIconSizeTransform(this.icon1Path, this.icon1Width, this.icon1Height, this.icon1Init.centerX, this.icon1Init.centerY);
    this.icon1Scale = sizeTransform.scale;
    this.icon1X = sizeTransform.iconX;
    this.icon1Y = sizeTransform.iconY;

    if (this.icon1Anim.size === null) { this.icon1Anim.size = this.icon1Init.size; }
    if (this.icon1HeightAnim === null) { this.icon1HeightAnim = this.icon1Anim.size; }
    if (this.icon1WidthAnim === null) { this.icon1WidthAnim = this.icon1Anim.size; }
    if (this.icon1Anim.centerX === null) { this.icon1Anim.centerX = this.icon1Init.centerX; }
    if (this.icon1Anim.centerY === null) { this.icon1Anim.centerY = this.icon1Init.centerY; }
    if (this.icon1PathAnim === null) { this.icon1PathAnim = this.icon1Path; }
    if (this.icon1Anim.rotate === null) { this.icon1Anim.rotate = this.icon1Init.rotate; }

    var sizeTransformAnim = this.getIconSizeTransform(this.icon1PathAnim, this.icon1WidthAnim, this.icon1HeightAnim, this.icon1Anim.centerX, this.icon1Anim.centerY);
    this.icon1ScaleAnim = sizeTransformAnim.scale;
    this.icon1XAnim = sizeTransformAnim.iconX;
    this.icon1YAnim = sizeTransformAnim.iconY;

    // icon2
    if (this.icon2Path !== null) {
        var sizeTransform2 = this.getIconSizeTransform(this.icon2Path, this.icon2Width, this.icon2Height, this.icon2Init.centerX, this.icon2Init.centerY);
        this.icon2Scale = sizeTransform2.scale;
        this.icon2X = sizeTransform2.iconX;
        this.icon2Y = sizeTransform2.iconY;
    }

    if (this.icon2Anim.size === null) {
        if (this.icon2Init.size === 0) { this.icon2Anim.size = icon2SizeDefault; }
        else { this.icon2Anim.size = this.icon2Init.size; }
    }
    if (this.icon2HeightAnim === null) { this.icon2HeightAnim = this.icon2Anim.size; }
    if (this.icon2WidthAnim === null) { this.icon2WidthAnim = this.icon2Anim.size; }
    if (this.icon2Anim.centerX === null) { this.icon2Anim.centerX = this.icon2Init.centerX; }
    if (this.icon2Anim.centerY === null) { this.icon2Anim.centerY = this.icon2Init.centerY; }
    if (this.icon2PathAnim === null) { this.icon2PathAnim = this.icon2Path; }
    if (this.icon2Anim.rotate === null) { this.icon2Anim.rotate = this.icon2Init.rotate; }
    
    if (this.icon2PathAnim !== null) {
        var sizeTransform2Anim = this.getIconSizeTransform(this.icon2PathAnim, this.icon2WidthAnim, this.icon2HeightAnim, this.icon2Anim.centerX, this.icon2Anim.centerY);
        this.icon2ScaleAnim = sizeTransform2Anim.scale;
        this.icon2XAnim = sizeTransform2Anim.iconX;
        this.icon2YAnim = sizeTransform2Anim.iconY;
    }

    // animation
    if (this.animateTime === null) {
        if (this.hoverMode === "rotate") { this.animateTime = 400; }
        else { this.animateTime = 200; }
    }
    if (this.animateEasing === null) { this.animateEasing = "linear"; }
};

hybicon.prototype.setIconSettings = function (iconSet, iconSettings) {
    if (iconSettings !== null) {
        var iconsettings = iconSettings.split(",");
        if (iconsettings.length > 0) {
            if (iconsettings[0] !== "") { iconSet.centerX = iconsettings[0]; }
        }
        if (iconsettings.length > 1) {
            if (iconsettings[1] !== "") { iconSet.centerY = iconsettings[1]; }
        }
        if (iconsettings.length > 2) {
            if (iconsettings[2] !== "") { iconSet.size = iconsettings[2]; }
        }
        if (iconsettings.length > 3) {
            if (iconsettings[3] !== "") { iconSet.rotate = iconsettings[3]; }
        }
    }
}

hybicon.prototype.hybiconSettings = function () {
    return { centerX: null, centerY: null, size: null, rotate: null };
};

//Transform functions
hybicon.prototype.getIconSizeTransform = function (icon, iconWidth, iconHeight, centerX, centerY) {

    var transformAttrX = "";
    var transformAttrY = "";

    var relativePath = Raphael.pathToRelative(icon);
    var bbox = Raphael.pathBBox(relativePath);
    var pathcenterX = bbox.cx;
    var pathcenterY = bbox.cy;
    var width = bbox.width;
    var height = bbox.height;

    //Calculate path width & height
    if (iconWidth !== null && iconHeight !== null) {
        if (height > width) {
            transformAttrX = (iconWidth / height);
            transformAttrY = (iconHeight / height);
        }
        else {
            transformAttrX = (iconWidth / width);
            transformAttrY = (iconHeight / width);
        }
    }

    var iconCenterX = centerX - pathcenterX;
    var iconCenterY = centerY - pathcenterY;

    return {
        scale: transformAttrX.toString() + "," + transformAttrY.toString(),
        iconX: iconCenterX,
        iconY: iconCenterY
    }
};

hybicon.prototype.getTransformString = function (x, y, scale, rotate) {
    return "t" + x.toString() + "," + y.toString() + "s" + scale.toString() + "r" + rotate.toString();
};

//Identifiers
hybicon.prototype.getSvgId = function () {
    return this.holderId + "-svg";
};

hybicon.prototype.getIcon1Id = function () {
    return this.holderId + "-icon1";
};

hybicon.prototype.getIcon2Id = function () {
    return this.holderId + "-icon2";
};

hybicon.prototype.getInfoId = function () {
    return this.holderId + "-info";
};

hybicon.prototype.getInfoTextId = function () {
    return this.holderId + "-infotext";
};

//Automatic parse
document.addEventListener("DOMContentLoaded", function (event) {
    new hybicon().parseAll();
});


///#source 1 1 /js/hybicon.icons.js
/* ======================================================================================= */
/*                                   hybicon.icons.js                                      */
/* ======================================================================================= */
/* This is a small JavaScript library that hold SVG icons for hybicon.                     */
/* Requires hybicon.js (http://hybicon.softwaretailoring.net)                              */
/* ======================================================================================= */
/* Check http://hybicon.softwaretailoring.net/icons.html for samples.                      */
/* Fork https://github.com/softwaretailoring/hybicon for contribution.                     */
/* ======================================================================================= */
/* Copyright © 2015 Gábor Berkesi (http://softwaretailoring.net)                           */
/* Licensed under MIT (https://github.com/softwaretailoring/hybicon/blob/master/LICENSE)   */
/* ======================================================================================= */

/* ======================================================================================= */
/* Documentation: http://hybicon.softwaretailoring.net                                     */
/* ======================================================================================= */

/* =========================== */
/* Base icons                  */
/* =========================== */

var hybiconbase = {
    "switch": "M 10.787109 0.44726562 C 5.0862506 0.44726562 0.4921875 4.9122809 0.4921875 10.455078 C 0.4921875 15.997874 5.0862506 20.462891 10.787109 20.462891 L 34.539062 20.462891 C 40.239921 20.462891 44.833984 15.997874 44.833984 10.455078 C 44.833984 4.9122809 40.23992 0.44726562 34.539062 0.44726562 L 10.787109 0.44726562 z M 11.416016 1.5488281 L 33.863281 1.5488281 C 39.250751 1.5488281 43.589844 5.5065856 43.589844 10.419922 C 43.589844 15.333256 39.250751 19.291016 33.863281 19.291016 L 11.416016 19.291016 C 6.028544 19.291016 1.6875 15.333256 1.6875 10.419922 C 1.6875 5.5065856 6.028544 1.5488281 11.416016 1.5488281 z ",
    circle: "M 21.514665,11.936796 A 7.589529,7.589529 0 0 1 13.925136,19.526325 7.589529,7.589529 0 0 1 6.3356066,11.936796 7.589529,7.589529 0 0 1 13.925136,4.3472672 7.589529,7.589529 0 0 1 21.514665,11.936796 Z",
    //Author of these icons: http://raphaeljs.com/icons
    githubalt: "M23.356,17.485c-0.004,0.007-0.007,0.013-0.01,0.021l0.162,0.005c0.107,0.004,0.218,0.01,0.33,0.016c-0.046-0.004-0.09-0.009-0.136-0.013L23.356,17.485zM15.5,1.249C7.629,1.25,1.25,7.629,1.249,15.5C1.25,23.371,7.629,29.75,15.5,29.751c7.871-0.001,14.25-6.38,14.251-14.251C29.75,7.629,23.371,1.25,15.5,1.249zM3.771,17.093c0.849-0.092,1.833-0.148,2.791-0.156c0.262,0,0.507-0.006,0.717-0.012c0.063,0.213,0.136,0.419,0.219,0.613H7.492c-0.918,0.031-2.047,0.152-3.134,0.335c-0.138,0.023-0.288,0.051-0.441,0.08C3.857,17.67,3.81,17.383,3.771,17.093zM12.196,22.224c-0.1,0.028-0.224,0.07-0.357,0.117c-0.479,0.169-0.665,0.206-1.15,0.206c-0.502,0.015-0.621-0.019-0.921-0.17C9.33,22.171,8.923,21.8,8.651,21.353c-0.453-0.746-1.236-1.275-1.889-1.275c-0.559,0-0.664,0.227-0.261,0.557c0.608,0.496,1.062,0.998,1.248,1.385c0.105,0.215,0.266,0.546,0.358,0.744c0.099,0.206,0.311,0.474,0.511,0.676c0.472,0.441,0.928,0.659,1.608,0.772c0.455,0.06,0.567,0.06,1.105-0.004c0.26-0.03,0.479-0.067,0.675-0.118v0.771c0,1.049-0.008,1.628-0.031,1.945c-1.852-0.576-3.507-1.595-4.848-2.934c-1.576-1.578-2.706-3.592-3.195-5.848c0.952-0.176,2.073-0.32,3.373-0.43l0.208-0.018c0.398,0.925,1.011,1.631,1.876,2.179c0.53,0.337,1.38,0.685,1.808,0.733c0.118,0.02,0.46,0.09,0.76,0.16c0.302,0.066,0.89,0.172,1.309,0.236h0.009c-0.007,0.018-0.014,0.02-0.022,0.02C12.747,21.169,12.418,21.579,12.196,22.224zM13.732,27.207c-0.168-0.025-0.335-0.056-0.5-0.087c0.024-0.286,0.038-0.785,0.054-1.723c0.028-1.767,0.041-1.94,0.156-2.189c0.069-0.15,0.17-0.32,0.226-0.357c0.095-0.078,0.101,0.076,0.101,2.188C13.769,26.143,13.763,26.786,13.732,27.207zM15.5,27.339c-0.148,0-0.296-0.006-0.443-0.012c0.086-0.562,0.104-1.428,0.106-2.871l0.003-1.82l0.197,0.019l0.199,0.02l0.032,2.365c0.017,1.21,0.027,1.878,0.075,2.296C15.613,27.335,15.558,27.339,15.5,27.339zM17.006,27.24c-0.039-0.485-0.037-1.243-0.027-2.553c0.019-1.866,0.019-1.866,0.131-1.769c0.246,0.246,0.305,0.623,0.305,2.373c0,0.928,0.011,1.497,0.082,1.876C17.334,27.196,17.17,27.22,17.006,27.24zM27.089,17.927c-0.155-0.029-0.307-0.057-0.446-0.08c-0.96-0.162-1.953-0.275-2.804-0.32c1.25,0.108,2.327,0.248,3.246,0.418c-0.479,2.289-1.618,4.33-3.214,5.928c-1.402,1.4-3.15,2.448-5.106,3.008c-0.034-0.335-0.058-1.048-0.066-2.212c-0.03-2.167-0.039-2.263-0.17-2.602c-0.181-0.458-0.47-0.811-0.811-1.055c-0.094-0.057-0.181-0.103-0.301-0.14c0.145-0.02,0.282-0.021,0.427-0.057c1.418-0.188,2.168-0.357,2.772-0.584c1.263-0.492,2.129-1.301,2.606-2.468c0.044-0.103,0.088-0.2,0.123-0.279l0.011,0.001c0.032-0.07,0.057-0.118,0.064-0.125c0.02-0.017,0.036-0.085,0.038-0.151c0-0.037,0.017-0.157,0.041-0.317c0.249,0.01,0.58,0.018,0.938,0.02c0.959,0.008,1.945,0.064,2.794,0.156C27.194,17.356,27.148,17.644,27.089,17.927zM25.823,16.87c-0.697-0.049-1.715-0.064-2.311-0.057c0.02-0.103,0.037-0.218,0.059-0.336c0.083-0.454,0.111-0.912,0.113-1.823c0.002-1.413-0.074-1.801-0.534-2.735c-0.188-0.381-0.399-0.705-0.655-0.998c0.225-0.659,0.207-1.68-0.02-2.575c-0.19-0.734-0.258-0.781-0.924-0.64c-0.563,0.12-1.016,0.283-1.598,0.576c-0.274,0.138-0.652,0.354-0.923,0.522c-0.715-0.251-1.451-0.419-2.242-0.508c-0.799-0.092-2.759-0.04-3.454,0.089c-0.681,0.126-1.293,0.28-1.848,0.462c-0.276-0.171-0.678-0.4-0.964-0.547C9.944,8.008,9.491,7.846,8.925,7.727c-0.664-0.144-0.732-0.095-0.922,0.64c-0.235,0.907-0.237,1.945-0.004,2.603c0.026,0.075,0.043,0.129,0.05,0.17c-0.942,1.187-1.25,2.515-1.046,4.367c0.053,0.482,0.136,0.926,0.251,1.333c-0.602-0.004-1.457,0.018-2.074,0.057c-0.454,0.031-0.957,0.076-1.418,0.129c-0.063-0.5-0.101-1.008-0.101-1.524c0-3.273,1.323-6.225,3.468-8.372c2.146-2.144,5.099-3.467,8.371-3.467c3.273,0,6.226,1.323,8.371,3.467c2.145,2.147,3.468,5.099,3.468,8.372c0,0.508-0.036,1.008-0.098,1.499C26.78,16.946,26.276,16.899,25.823,16.87z",
    star: "M16,22.375L7.116,28.83l3.396-10.438l-8.883-6.458l10.979,0.002L16.002,1.5l3.391,10.434h10.981l-8.886,6.457l3.396,10.439L16,22.375L16,22.375z",
    fork: "M13.741,10.249h8.045v2.627l7.556-4.363l-7.556-4.363v2.598H9.826C11.369,7.612,12.616,8.922,13.741,10.249zM21.786,20.654c-0.618-0.195-1.407-0.703-2.291-1.587c-1.79-1.756-3.712-4.675-5.731-7.227c-2.049-2.486-4.159-4.972-7.451-5.091h-3.5v3.5h3.5c0.656-0.027,1.683,0.486,2.879,1.683c1.788,1.753,3.712,4.674,5.731,7.226c1.921,2.331,3.907,4.639,6.863,5.016v2.702l7.556-4.362l-7.556-4.362V20.654z",
    twitter: "M26.492,9.493c-0.771,0.343-1.602,0.574-2.473,0.678c0.89-0.533,1.562-1.376,1.893-2.382c-0.832,0.493-1.753,0.852-2.734,1.044c-0.785-0.837-1.902-1.359-3.142-1.359c-2.377,0-4.306,1.928-4.306,4.306c0,0.337,0.039,0.666,0.112,0.979c-3.578-0.18-6.75-1.894-8.874-4.499c-0.371,0.636-0.583,1.375-0.583,2.165c0,1.494,0.76,2.812,1.915,3.583c-0.706-0.022-1.37-0.216-1.95-0.538c0,0.018,0,0.036,0,0.053c0,2.086,1.484,3.829,3.454,4.222c-0.361,0.099-0.741,0.147-1.134,0.147c-0.278,0-0.547-0.023-0.81-0.076c0.548,1.711,2.138,2.955,4.022,2.99c-1.474,1.146-3.33,1.842-5.347,1.842c-0.348,0-0.69-0.021-1.027-0.062c1.905,1.225,4.168,1.938,6.6,1.938c7.919,0,12.248-6.562,12.248-12.25c0-0.187-0.002-0.372-0.01-0.557C25.186,11.115,25.915,10.356,26.492,9.493z",
    bubble: "M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z",
    skype: "M28.777,18.438c0.209-0.948,0.318-1.934,0.318-2.944c0-7.578-6.144-13.722-13.724-13.722c-0.799,0-1.584,0.069-2.346,0.2C11.801,1.199,10.35,0.75,8.793,0.75c-4.395,0-7.958,3.562-7.958,7.958c0,1.47,0.399,2.845,1.094,4.024c-0.183,0.893-0.277,1.814-0.277,2.76c0,7.58,6.144,13.723,13.722,13.723c0.859,0,1.699-0.078,2.515-0.23c1.119,0.604,2.399,0.945,3.762,0.945c4.395,0,7.957-3.562,7.957-7.959C29.605,20.701,29.309,19.502,28.777,18.438zM22.412,22.051c-0.635,0.898-1.573,1.609-2.789,2.115c-1.203,0.5-2.646,0.754-4.287,0.754c-1.971,0-3.624-0.346-4.914-1.031C9.5,23.391,8.74,22.717,8.163,21.885c-0.583-0.842-0.879-1.676-0.879-2.479c0-0.503,0.192-0.939,0.573-1.296c0.375-0.354,0.857-0.532,1.432-0.532c0.471,0,0.878,0.141,1.209,0.422c0.315,0.269,0.586,0.662,0.805,1.174c0.242,0.558,0.508,1.027,0.788,1.397c0.269,0.355,0.656,0.656,1.151,0.89c0.497,0.235,1.168,0.354,1.992,0.354c1.135,0,2.064-0.241,2.764-0.721c0.684-0.465,1.016-1.025,1.016-1.711c0-0.543-0.173-0.969-0.529-1.303c-0.373-0.348-0.865-0.621-1.465-0.807c-0.623-0.195-1.47-0.404-2.518-0.623c-1.424-0.306-2.634-0.668-3.596-1.076c-0.984-0.419-1.777-1-2.357-1.727c-0.59-0.736-0.889-1.662-0.889-2.75c0-1.036,0.314-1.971,0.933-2.776c0.613-0.8,1.51-1.423,2.663-1.849c1.139-0.422,2.494-0.635,4.027-0.635c1.225,0,2.303,0.141,3.201,0.421c0.904,0.282,1.668,0.662,2.267,1.13c0.604,0.472,1.054,0.977,1.335,1.5c0.284,0.529,0.43,1.057,0.43,1.565c0,0.49-0.189,0.937-0.563,1.324c-0.375,0.391-0.851,0.589-1.408,0.589c-0.509,0-0.905-0.124-1.183-0.369c-0.258-0.227-0.523-0.58-0.819-1.09c-0.342-0.65-0.756-1.162-1.229-1.523c-0.463-0.351-1.232-0.529-2.292-0.529c-0.984,0-1.784,0.197-2.379,0.588c-0.572,0.375-0.85,0.805-0.85,1.314c0,0.312,0.09,0.574,0.273,0.799c0.195,0.238,0.471,0.447,0.818,0.621c0.36,0.182,0.732,0.326,1.104,0.429c0.382,0.106,1.021,0.263,1.899,0.466c1.11,0.238,2.131,0.506,3.034,0.793c0.913,0.293,1.703,0.654,2.348,1.072c0.656,0.429,1.178,0.979,1.547,1.635c0.369,0.658,0.558,1.471,0.558,2.416C23.371,20.119,23.049,21.148,22.412,22.051z",
    phone: "M22.065,18.53c-0.467-0.29-1.167-0.21-1.556,0.179l-3.093,3.092c-0.389,0.389-1.025,0.389-1.414,0L9.05,14.848c-0.389-0.389-0.389-1.025,0-1.414l2.913-2.912c0.389-0.389,0.447-1.075,0.131-1.524L6.792,1.485C6.476,1.036,5.863,0.948,5.433,1.29c0,0-4.134,3.281-4.134,6.295c0,12.335,10,22.334,22.334,22.334c3.015,0,5.948-5.533,5.948-5.533c0.258-0.486,0.087-1.122-0.38-1.412L22.065,18.53z",
    linkedin: "m 27.351695,3.125 -22.0000001,0 c -1.104,0 -2,0.896 -2,2 l 0,22 c 0,1.104 0.896,2 2,2 l 22.0000001,0 c 1.104,0 2,-0.896 2,-2 l 0,-22 c 0,-1.104 -0.896,-2 -2,-2 z m -16.031,23.656 -4.0000001,0 0,-14 4.0000001,0 0,14 z m -2.0000001,-15.5 c -1.383,0 -2.5,-1.119 -2.5,-2.5 0,-1.381 1.117,-2.5 2.5,-2.5 1.3830001,0 2.5000001,1.119 2.5000001,2.5 0,1.381 -1.117,2.5 -2.5000001,2.5 z m 16.0000001,15.5 -4,0 0,-8.5 c 0,-0.4 -0.403,-1.055 -0.687,-1.213 -0.375,-0.211 -1.261,-0.229 -1.665,-0.034 l -1.648,0.793 0,8.954 -4,0 0,-14 4,0 0,0.614 c 1.583,-0.723 3.78,-0.652 5.27,0.184 1.582,0.886 2.73,2.864 2.73,4.702 l 0,8.5 z",
    link: "m 12.914734,16.450766 -2.471,-2.47 c -1.0229999,0.054 -2.0619999,-0.297 -2.8459999,-1.078 -1.459,-1.465 -1.459,-3.8370001 0.002,-5.3020001 1.465,-1.461 3.8359999,-1.46 5.3009999,-10e-4 0.781,0.783 1.131,1.824 1.078,2.8470001 l 2.469,2.469 c 1.057,-2.463 0.586,-5.4250001 -1.426,-7.4380001 -2.637,-2.634 -6.9069999,-2.636 -9.5449999,0 -2.637,2.638 -2.635,6.9090001 0,9.5450001 l -0.002,10e-4 c 2.014,2.01 4.9769999,2.483 7.4399999,1.427 z m 5.17,-1.898 2.469,2.467 c 1.023,-0.053 2.062,0.297 2.848,1.078 1.459,1.467 1.461,3.837 -0.002,5.303 -1.465,1.462 -3.837,1.462 -5.301,0 -0.783,-0.783 -1.132,-1.822 -1.079,-2.846 l -2.468,-2.469 c -1.057,2.463 -0.584,5.424 1.424,7.438 2.639,2.634 6.91,2.633 9.546,0 2.636,-2.639 2.637,-6.91 0.001,-9.545 -2.012,-2.011 -4.974,-2.483 -7.438,-1.426 z m 2.188,3.6 -7.426,-7.424 c -0.584,-0.585 -1.535,-0.587 -2.121,0 -0.584,0.585 -0.584,1.536 0.002,2.121 l 7.424,7.425 c 0.586,0.584 1.535,0.584 2.121,0 0.586,-0.587 0.585,-1.538 0,-2.122 z",
    user: "M20.771,12.364c0,0,0.849-3.51,0-4.699c-0.85-1.189-1.189-1.981-3.058-2.548s-1.188-0.454-2.547-0.396c-1.359,0.057-2.492,0.792-2.492,1.188c0,0-0.849,0.057-1.188,0.397c-0.34,0.34-0.906,1.924-0.906,2.321s0.283,3.058,0.566,3.624l-0.337,0.113c-0.283,3.283,1.132,3.68,1.132,3.68c0.509,3.058,1.019,1.756,1.019,2.548s-0.51,0.51-0.51,0.51s-0.452,1.245-1.584,1.698c-1.132,0.452-7.416,2.886-7.927,3.396c-0.511,0.511-0.453,2.888-0.453,2.888h26.947c0,0,0.059-2.377-0.452-2.888c-0.512-0.511-6.796-2.944-7.928-3.396c-1.132-0.453-1.584-1.698-1.584-1.698s-0.51,0.282-0.51-0.51s0.51,0.51,1.02-2.548c0,0,1.414-0.397,1.132-3.68H20.771z",
    idea: "M12.75,25.498h5.5v-5.164h-5.5V25.498zM15.5,28.166c1.894,0,2.483-1.027,2.667-1.666h-5.334C13.017,27.139,13.606,28.166,15.5,28.166zM15.5,2.833c-3.866,0-7,3.134-7,7c0,3.859,3.945,4.937,4.223,9.499h1.271c-0.009-0.025-0.024-0.049-0.029-0.078L11.965,8.256c-0.043-0.245,0.099-0.485,0.335-0.563c0.237-0.078,0.494,0.026,0.605,0.25l0.553,1.106l0.553-1.106c0.084-0.17,0.257-0.277,0.446-0.277c0.189,0,0.362,0.107,0.446,0.277l0.553,1.106l0.553-1.106c0.084-0.17,0.257-0.277,0.448-0.277c0.189,0,0.36,0.107,0.446,0.277l0.554,1.106l0.553-1.106c0.111-0.224,0.368-0.329,0.604-0.25s0.377,0.318,0.333,0.563l-1.999,10.998c-0.005,0.029-0.02,0.053-0.029,0.078h1.356c0.278-4.562,4.224-5.639,4.224-9.499C22.5,5.968,19.366,2.833,15.5,2.833zM17.458,10.666c-0.191,0-0.364-0.107-0.446-0.275l-0.554-1.106l-0.553,1.106c-0.086,0.168-0.257,0.275-0.446,0.275c-0.191,0-0.364-0.107-0.449-0.275l-0.553-1.106l-0.553,1.106c-0.084,0.168-0.257,0.275-0.446,0.275c-0.012,0-0.025,0-0.037-0.001l1.454,8.001h1.167l1.454-8.001C17.482,10.666,17.47,10.666,17.458,10.666z",
    facebook: "m 25.309,16.916 -3.218,0 0,11.65 -4.819,0 0,-11.65 -2.409,0 0,-4.016 2.409,0 0,-2.411 c 0,-3.275 1.359,-5.224 5.229,-5.224 l 3.218,0 0,4.016 -2.011,0 c -1.504,0 -1.604,0.562 -1.604,1.608 l -0.013,2.011 3.644,0 -0.426,4.016 z",
    chrome: "M15.318,7.677c0.071-0.029,0.148-0.046,0.229-0.046h11.949c-2.533-3.915-6.938-6.506-11.949-6.506c-5.017,0-9.428,2.598-11.959,6.522l4.291,7.431C8.018,11.041,11.274,7.796,15.318,7.677zM28.196,8.84h-8.579c2.165,1.357,3.605,3.763,3.605,6.506c0,1.321-0.334,2.564-0.921,3.649c-0.012,0.071-0.035,0.142-0.073,0.209l-5.973,10.347c7.526-0.368,13.514-6.587,13.514-14.205C29.77,13.002,29.201,10.791,28.196,8.84zM15.547,23.022c-2.761,0-5.181-1.458-6.533-3.646c-0.058-0.046-0.109-0.103-0.149-0.171L2.89,8.855c-1,1.946-1.565,4.153-1.565,6.492c0,7.624,5.999,13.846,13.534,14.205l4.287-7.425C18.073,22.698,16.848,23.022,15.547,23.022zM9.08,15.347c0,1.788,0.723,3.401,1.894,4.573c1.172,1.172,2.785,1.895,4.573,1.895c1.788,0,3.401-0.723,4.573-1.895s1.895-2.785,1.895-4.573c0-1.788-0.723-3.4-1.895-4.573c-1.172-1.171-2.785-1.894-4.573-1.894c-1.788,0-3.401,0.723-4.573,1.894C9.803,11.946,9.081,13.559,9.08,15.347z",
    opera: "M15.954,2.046c-7.489,0-12.872,5.432-12.872,13.581c0,7.25,5.234,13.835,12.873,13.835c7.712,0,12.974-6.583,12.974-13.835C28.929,7.413,23.375,2.046,15.954,2.046zM15.952,26.548L15.952,26.548c-2.289,0-3.49-1.611-4.121-3.796c-0.284-1.037-0.458-2.185-0.563-3.341c-0.114-1.374-0.129-2.773-0.129-4.028c0-0.993,0.018-1.979,0.074-2.926c0.124-1.728,0.386-3.431,0.89-4.833c0.694-1.718,1.871-2.822,3.849-2.822c2.5,0,3.763,1.782,4.385,4.322c0.429,1.894,0.56,4.124,0.56,6.274c0,2.299-0.103,5.153-0.763,7.442C19.473,24.979,18.242,26.548,15.952,26.548z",
    firefox: "M28.4,22.469c0.479-0.964,0.851-1.991,1.095-3.066c0.953-3.661,0.666-6.854,0.666-6.854l-0.327,2.104c0,0-0.469-3.896-1.044-5.353c-0.881-2.231-1.273-2.214-1.274-2.21c0.542,1.379,0.494,2.169,0.483,2.288c-0.01-0.016-0.019-0.032-0.027-0.047c-0.131-0.324-0.797-1.819-2.225-2.878c-2.502-2.481-5.943-4.014-9.745-4.015c-4.056,0-7.705,1.745-10.238,4.525C5.444,6.5,5.183,5.938,5.159,5.317c0,0-0.002,0.002-0.006,0.005c0-0.011-0.003-0.021-0.003-0.031c0,0-1.61,1.247-1.436,4.612c-0.299,0.574-0.56,1.172-0.777,1.791c-0.375,0.817-0.75,2.004-1.059,3.746c0,0,0.133-0.422,0.399-0.988c-0.064,0.482-0.103,0.971-0.116,1.467c-0.09,0.845-0.118,1.865-0.039,3.088c0,0,0.032-0.406,0.136-1.021c0.834,6.854,6.667,12.165,13.743,12.165l0,0c1.86,0,3.636-0.37,5.256-1.036C24.938,27.771,27.116,25.196,28.4,22.469zM16.002,3.356c2.446,0,4.73,0.68,6.68,1.86c-2.274-0.528-3.433-0.261-3.423-0.248c0.013,0.015,3.384,0.589,3.981,1.411c0,0-1.431,0-2.856,0.41c-0.065,0.019,5.242,0.663,6.327,5.966c0,0-0.582-1.213-1.301-1.42c0.473,1.439,0.351,4.17-0.1,5.528c-0.058,0.174-0.118-0.755-1.004-1.155c0.284,2.037-0.018,5.268-1.432,6.158c-0.109,0.07,0.887-3.189,0.201-1.93c-4.093,6.276-8.959,2.539-10.934,1.208c1.585,0.388,3.267,0.108,4.242-0.559c0.982-0.672,1.564-1.162,2.087-1.047c0.522,0.117,0.87-0.407,0.464-0.872c-0.405-0.466-1.392-1.105-2.725-0.757c-0.94,0.247-2.107,1.287-3.886,0.233c-1.518-0.899-1.507-1.63-1.507-2.095c0-0.366,0.257-0.88,0.734-1.028c0.58,0.062,1.044,0.214,1.537,0.466c0.005-0.135,0.006-0.315-0.001-0.519c0.039-0.077,0.015-0.311-0.047-0.596c-0.036-0.287-0.097-0.582-0.19-0.851c0.01-0.002,0.017-0.007,0.021-0.021c0.076-0.344,2.147-1.544,2.299-1.659c0.153-0.114,0.55-0.378,0.506-1.183c-0.015-0.265-0.058-0.294-2.232-0.286c-0.917,0.003-1.425-0.894-1.589-1.245c0.222-1.231,0.863-2.11,1.919-2.704c0.02-0.011,0.015-0.021-0.008-0.027c0.219-0.127-2.524-0.006-3.76,1.604C9.674,8.045,9.219,7.95,8.71,7.95c-0.638,0-1.139,0.07-1.603,0.187c-0.05,0.013-0.122,0.011-0.208-0.001C6.769,8.04,6.575,7.88,6.365,7.672c0.161-0.18,0.324-0.356,0.495-0.526C9.201,4.804,12.43,3.357,16.002,3.356z",
    safari: "M16.154,5.135c-0.504,0-1,0.031-1.488,0.089l-0.036-0.18c-0.021-0.104-0.06-0.198-0.112-0.283c0.381-0.308,0.625-0.778,0.625-1.306c0-0.927-0.751-1.678-1.678-1.678s-1.678,0.751-1.678,1.678c0,0.745,0.485,1.376,1.157,1.595c-0.021,0.105-0.021,0.216,0,0.328l0.033,0.167C7.645,6.95,3.712,11.804,3.712,17.578c0,6.871,5.571,12.441,12.442,12.441c6.871,0,12.441-5.57,12.441-12.441C28.596,10.706,23.025,5.135,16.154,5.135zM16.369,8.1c4.455,0,8.183,3.116,9.123,7.287l-0.576,0.234c-0.148-0.681-0.755-1.191-1.48-1.191c-0.837,0-1.516,0.679-1.516,1.516c0,0.075,0.008,0.148,0.018,0.221l-2.771-0.028c-0.054-0.115-0.114-0.226-0.182-0.333l3.399-5.11l0.055-0.083l-4.766,4.059c-0.352-0.157-0.74-0.248-1.148-0.256l0.086-0.018l-1.177-2.585c0.64-0.177,1.111-0.763,1.111-1.459c0-0.837-0.678-1.515-1.516-1.515c-0.075,0-0.147,0.007-0.219,0.018l0.058-0.634C15.357,8.141,15.858,8.1,16.369,8.1zM12.146,3.455c0-0.727,0.591-1.318,1.318-1.318c0.727,0,1.318,0.591,1.318,1.318c0,0.425-0.203,0.802-0.516,1.043c-0.183-0.123-0.413-0.176-0.647-0.13c-0.226,0.045-0.413,0.174-0.535,0.349C12.542,4.553,12.146,4.049,12.146,3.455zM7.017,17.452c0-4.443,3.098-8.163,7.252-9.116l0.297,0.573c-0.61,0.196-1.051,0.768-1.051,1.442c0,0.837,0.678,1.516,1.515,1.516c0.068,0,0.135-0.006,0.2-0.015l-0.058,2.845l0.052-0.011c-0.442,0.204-0.824,0.513-1.116,0.895l0.093-0.147l-1.574-0.603l1.172,1.239l0.026-0.042c-0.19,0.371-0.306,0.788-0.324,1.229l-0.003-0.016l-2.623,1.209c-0.199-0.604-0.767-1.041-1.438-1.041c-0.837,0-1.516,0.678-1.516,1.516c0,0.064,0.005,0.128,0.013,0.191l-0.783-0.076C7.063,18.524,7.017,17.994,7.017,17.452zM16.369,26.805c-4.429,0-8.138-3.078-9.106-7.211l0.691-0.353c0.146,0.686,0.753,1.2,1.482,1.2c0.837,0,1.515-0.679,1.515-1.516c0-0.105-0.011-0.207-0.031-0.307l2.858,0.03c0.045,0.095,0.096,0.187,0.15,0.276l-3.45,5.277l0.227-0.195l4.529-3.92c0.336,0.153,0.705,0.248,1.094,0.266l-0.019,0.004l1.226,2.627c-0.655,0.166-1.142,0.76-1.142,1.468c0,0.837,0.678,1.515,1.516,1.515c0.076,0,0.151-0.007,0.225-0.018l0.004,0.688C17.566,26.746,16.975,26.805,16.369,26.805zM18.662,26.521l-0.389-0.6c0.661-0.164,1.152-0.759,1.152-1.47c0-0.837-0.68-1.516-1.516-1.516c-0.066,0-0.13,0.005-0.193,0.014v-2.86l-0.025,0.004c0.409-0.185,0.77-0.459,1.055-0.798l1.516,0.659l-1.104-1.304c0.158-0.335,0.256-0.704,0.278-1.095l2.552-1.164c0.19,0.618,0.766,1.068,1.447,1.068c0.838,0,1.516-0.679,1.516-1.516c0-0.069-0.006-0.137-0.016-0.204l0.65,0.12c0.089,0.517,0.136,1.049,0.136,1.591C25.722,21.826,22.719,25.499,18.662,26.521z",
    ie9: "M27.751,17.887c0.054-0.434,0.081-0.876,0.081-1.324c0-1.744-0.413-3.393-1.146-4.854c1.133-2.885,1.155-5.369-0.201-6.777c-1.756-1.822-5.391-1.406-9.433,0.721c-0.069-0.001-0.138-0.003-0.206-0.003c-6.069,0-10.988,4.888-10.988,10.917c0,0.183,0.005,0.354,0.014,0.529c-2.688,4.071-3.491,7.967-1.688,9.838c1.557,1.613,4.691,1.344,8.2-0.392c1.363,0.604,2.873,0.938,4.462,0.938c4.793,0,8.867-3.049,10.369-7.299H21.26c-0.814,1.483-2.438,2.504-4.307,2.504c-2.688,0-4.867-2.104-4.867-4.688c0-0.036,0.002-0.071,0.003-0.106h15.662V17.887zM26.337,6.099c0.903,0.937,0.806,2.684-0.087,4.818c-1.27-2.083-3.221-3.71-5.546-4.576C23.244,5.217,25.324,5.047,26.337,6.099zM16.917,10.372c2.522,0,4.585,1.991,4.748,4.509h-9.496C12.333,12.363,14.396,10.372,16.917,10.372zM5.687,26.501c-1.103-1.146-0.712-3.502,0.799-6.298c0.907,2.546,2.736,4.658,5.09,5.938C8.92,27.368,6.733,27.587,5.687,26.501z",
    ie: "M27.998,2.266c-2.12-1.91-6.925,0.382-9.575,1.93c-0.76-0.12-1.557-0.185-2.388-0.185c-3.349,0-6.052,0.985-8.106,2.843c-2.336,2.139-3.631,4.94-3.631,8.177c0,0.028,0.001,0.056,0.001,0.084c3.287-5.15,8.342-7.79,9.682-8.487c0.212-0.099,0.338,0.155,0.141,0.253c-0.015,0.042-0.015,0,0,0c-2.254,1.35-6.434,5.259-9.146,10.886l-0.003-0.007c-1.717,3.547-3.167,8.529-0.267,10.358c2.197,1.382,6.13-0.248,9.295-2.318c0.764,0.108,1.567,0.165,2.415,0.165c5.84,0,9.937-3.223,11.399-7.924l-8.022-0.014c-0.337,1.661-1.464,2.548-3.223,2.548c-2.21,0-3.729-1.211-3.828-4.012l15.228-0.014c0.028-0.578-0.042-0.985-0.042-1.436c0-5.251-3.143-9.355-8.255-10.663c2.081-1.294,5.974-3.209,7.848-1.681c1.407,1.14,0.633,3.533,0.295,4.518c-0.056,0.254,0.24,0.296,0.296,0.057C28.814,5.573,29.026,3.194,27.998,2.266zM13.272,25.676c-2.469,1.475-5.873,2.539-7.539,1.289c-1.243-0.935-0.696-3.468,0.398-5.938c0.664,0.992,1.495,1.886,2.473,2.63C9.926,24.651,11.479,25.324,13.272,25.676zM12.714,13.046c0.042-2.435,1.787-3.49,3.617-3.49c1.928,0,3.49,1.112,3.49,3.49H12.714z",
    download: "M24.345,13.904c0.019-0.195,0.03-0.392,0.03-0.591c0-3.452-2.798-6.25-6.25-6.25c-2.679,0-4.958,1.689-5.847,4.059c-0.589-0.646-1.429-1.059-2.372-1.059c-1.778,0-3.219,1.441-3.219,3.219c0,0.21,0.023,0.415,0.062,0.613c-2.372,0.391-4.187,2.436-4.187,4.918c0,2.762,2.239,5,5,5h3.404l-0.707-0.707c-0.377-0.377-0.585-0.879-0.585-1.413c0-0.533,0.208-1.035,0.585-1.412l0.556-0.557c0.4-0.399,0.937-0.628,1.471-0.628c0.027,0,0.054,0,0.08,0.002v-0.472c0-1.104,0.898-2.002,2-2.002h3.266c1.103,0,2,0.898,2,2.002v0.472c0.027-0.002,0.054-0.002,0.081-0.002c0.533,0,1.07,0.229,1.47,0.63l0.557,0.552c0.78,0.781,0.78,2.05,0,2.828l-0.706,0.707h2.403c2.762,0,5-2.238,5-5C28.438,16.362,26.672,14.332,24.345,13.904z M21.033,20.986l-0.556-0.555c-0.39-0.389-0.964-0.45-1.276-0.137c-0.312,0.312-0.568,0.118-0.568-0.432v-1.238c0-0.55-0.451-1-1-1h-3.265c-0.55,0-1,0.45-1,1v1.238c0,0.55-0.256,0.744-0.569,0.432c-0.312-0.313-0.887-0.252-1.276,0.137l-0.556,0.555c-0.39,0.389-0.39,1.024-0.001,1.413l4.328,4.331c0.194,0.194,0.451,0.291,0.707,0.291s0.512-0.097,0.707-0.291l4.327-4.331C21.424,22.011,21.423,21.375,21.033,20.986z",
    upload: "M24.345,13.904c0.019-0.195,0.03-0.392,0.03-0.591c0-3.452-2.798-6.25-6.25-6.25c-2.679,0-4.958,1.689-5.847,4.059c-0.589-0.646-1.429-1.059-2.372-1.059c-1.778,0-3.219,1.441-3.219,3.219c0,0.21,0.023,0.415,0.062,0.613c-2.372,0.391-4.187,2.436-4.187,4.918c0,2.762,2.239,5,5,5h2.312c-0.126-0.266-0.2-0.556-0.2-0.859c0-0.535,0.208-1.04,0.587-1.415l4.325-4.329c0.375-0.377,0.877-0.585,1.413-0.585c0.54,0,1.042,0.21,1.417,0.587l4.323,4.329c0.377,0.373,0.585,0.878,0.585,1.413c0,0.304-0.073,0.594-0.2,0.859h1.312c2.762,0,5-2.238,5-5C28.438,16.362,26.672,14.332,24.345,13.904z M16.706,17.916c-0.193-0.195-0.45-0.291-0.706-0.291s-0.512,0.096-0.707,0.291l-4.327,4.33c-0.39,0.389-0.389,1.025,0.001,1.414l0.556,0.555c0.39,0.389,0.964,0.449,1.276,0.137s0.568-0.119,0.568,0.432v1.238c0,0.549,0.451,1,1,1h3.265c0.551,0,1-0.451,1-1v-1.238c0-0.551,0.256-0.744,0.569-0.432c0.312,0.312,0.887,0.252,1.276-0.137l0.556-0.555c0.39-0.389,0.39-1.025,0.001-1.414L16.706,17.916z",
    question: "M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.328,24.371h-2.707v-2.596h2.707V24.371zM17.328,19.003v0.858h-2.707v-1.057c0-3.19,3.63-3.696,3.63-5.963c0-1.034-0.924-1.826-2.134-1.826c-1.254,0-2.354,0.924-2.354,0.924l-1.541-1.915c0,0,1.519-1.584,4.137-1.584c2.487,0,4.796,1.54,4.796,4.136C21.156,16.208,17.328,16.627,17.328,19.003z",
    checkbox: "M26,27.5H6c-0.829,0-1.5-0.672-1.5-1.5V6c0-0.829,0.671-1.5,1.5-1.5h20c0.828,0,1.5,0.671,1.5,1.5v20C27.5,26.828,26.828,27.5,26,27.5zM7.5,24.5h17v-17h-17V24.5z",
    view: "M16,8.286C8.454,8.286,2.5,16,2.5,16s5.954,7.715,13.5,7.715c5.771,0,13.5-7.715,13.5-7.715S21.771,8.286,16,8.286zM16,20.807c-2.649,0-4.807-2.157-4.807-4.807s2.158-4.807,4.807-4.807s4.807,2.158,4.807,4.807S18.649,20.807,16,20.807zM16,13.194c-1.549,0-2.806,1.256-2.806,2.806c0,1.55,1.256,2.806,2.806,2.806c1.55,0,2.806-1.256,2.806-2.806C18.806,14.451,17.55,13.194,16,13.194z",
    noview: "M11.478,17.568c-0.172-0.494-0.285-1.017-0.285-1.568c0-2.65,2.158-4.807,4.807-4.807c0.552,0,1.074,0.113,1.568,0.285l2.283-2.283C18.541,8.647,17.227,8.286,16,8.286C8.454,8.286,2.5,16,2.5,16s2.167,2.791,5.53,5.017L11.478,17.568zM23.518,11.185l-3.056,3.056c0.217,0.546,0.345,1.138,0.345,1.76c0,2.648-2.158,4.807-4.807,4.807c-0.622,0-1.213-0.128-1.76-0.345l-2.469,2.47c1.327,0.479,2.745,0.783,4.229,0.783c5.771,0,13.5-7.715,13.5-7.715S26.859,13.374,23.518,11.185zM25.542,4.917L4.855,25.604L6.27,27.02L26.956,6.332L25.542,4.917z",
    book: "M25.754,4.626c-0.233-0.161-0.536-0.198-0.802-0.097L12.16,9.409c-0.557,0.213-1.253,0.316-1.968,0.316c-0.997,0.002-2.029-0.202-2.747-0.48C7.188,9.148,6.972,9.04,6.821,8.943c0.056-0.024,0.12-0.05,0.193-0.075L18.648,4.43l1.733,0.654V3.172c0-0.284-0.14-0.554-0.374-0.714c-0.233-0.161-0.538-0.198-0.802-0.097L6.414,7.241c-0.395,0.142-0.732,0.312-1.02,0.564C5.111,8.049,4.868,8.45,4.872,8.896c0,0.012,0.004,0.031,0.004,0.031v17.186c0,0.008-0.003,0.015-0.003,0.021c0,0.006,0.003,0.01,0.003,0.016v0.017h0.002c0.028,0.601,0.371,0.983,0.699,1.255c1.034,0.803,2.769,1.252,4.614,1.274c0.874,0,1.761-0.116,2.583-0.427l12.796-4.881c0.337-0.128,0.558-0.448,0.558-0.809V5.341C26.128,5.057,25.988,4.787,25.754,4.626zM5.672,11.736c0.035,0.086,0.064,0.176,0.069,0.273l0.004,0.054c0.016,0.264,0.13,0.406,0.363,0.611c0.783,0.626,2.382,1.08,4.083,1.093c0.669,0,1.326-0.083,1.931-0.264v1.791c-0.647,0.143-1.301,0.206-1.942,0.206c-1.674-0.026-3.266-0.353-4.509-1.053V11.736zM10.181,24.588c-1.674-0.028-3.266-0.354-4.508-1.055v-2.712c0.035,0.086,0.065,0.176,0.07,0.275l0.002,0.053c0.018,0.267,0.13,0.408,0.364,0.613c0.783,0.625,2.381,1.079,4.083,1.091c0.67,0,1.327-0.082,1.932-0.262v1.789C11.476,24.525,10.821,24.588,10.181,24.588z",
    search: "M29.772,26.433l-7.126-7.126c0.96-1.583,1.523-3.435,1.524-5.421C24.169,8.093,19.478,3.401,13.688,3.399C7.897,3.401,3.204,8.093,3.204,13.885c0,5.789,4.693,10.481,10.484,10.481c1.987,0,3.839-0.563,5.422-1.523l7.128,7.127L29.772,26.433zM7.203,13.885c0.006-3.582,2.903-6.478,6.484-6.486c3.579,0.008,6.478,2.904,6.484,6.486c-0.007,3.58-2.905,6.476-6.484,6.484C10.106,20.361,7.209,17.465,7.203,13.885z",
    code: "M8.982,7.107L0.322,15.77l8.661,8.662l3.15-3.15L6.621,15.77l5.511-5.511L8.982,7.107zM21.657,7.107l-3.148,3.151l5.511,5.511l-5.511,5.511l3.148,3.15l8.662-8.662L21.657,7.107z",
    fave: "M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z",
    plus: "M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z",
    minus: "M25.979,12.896,5.979,12.896,5.979,19.562,25.979,19.562z",
    check: "M2.379,14.729 5.208,11.899 12.958,19.648 25.877,6.733 28.707,9.561 12.958,25.308z",
    cross: "M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z",
    arrowright: "M11.166,23.963L22.359,17.5c1.43-0.824,1.43-2.175,0-3L11.166,8.037c-1.429-0.826-2.598-0.15-2.598,1.5v12.926C8.568,24.113,9.737,24.789,11.166,23.963z",
    gear: "M26.974,16.514l3.765-1.991c-0.074-0.738-0.217-1.454-0.396-2.157l-4.182-0.579c-0.362-0.872-0.84-1.681-1.402-2.423l1.594-3.921c-0.524-0.511-1.09-0.977-1.686-1.406l-3.551,2.229c-0.833-0.438-1.73-0.77-2.672-0.984l-1.283-3.976c-0.364-0.027-0.728-0.056-1.099-0.056s-0.734,0.028-1.099,0.056l-1.271,3.941c-0.967,0.207-1.884,0.543-2.738,0.986L7.458,4.037C6.863,4.466,6.297,4.932,5.773,5.443l1.55,3.812c-0.604,0.775-1.11,1.629-1.49,2.55l-4.05,0.56c-0.178,0.703-0.322,1.418-0.395,2.157l3.635,1.923c0.041,1.013,0.209,1.994,0.506,2.918l-2.742,3.032c0.319,0.661,0.674,1.303,1.085,1.905l4.037-0.867c0.662,0.72,1.416,1.351,2.248,1.873l-0.153,4.131c0.663,0.299,1.352,0.549,2.062,0.749l2.554-3.283C15.073,26.961,15.532,27,16,27c0.507,0,1.003-0.046,1.491-0.113l2.567,3.301c0.711-0.2,1.399-0.45,2.062-0.749l-0.156-4.205c0.793-0.513,1.512-1.127,2.146-1.821l4.142,0.889c0.411-0.602,0.766-1.243,1.085-1.905l-2.831-3.131C26.778,18.391,26.93,17.467,26.974,16.514zM20.717,21.297l-1.785,1.162l-1.098-1.687c-0.571,0.22-1.186,0.353-1.834,0.353c-2.831,0-5.125-2.295-5.125-5.125c0-2.831,2.294-5.125,5.125-5.125c2.83,0,5.125,2.294,5.125,5.125c0,1.414-0.573,2.693-1.499,3.621L20.717,21.297z",
    refresh: "M24.083,15.5c-0.009,4.739-3.844,8.574-8.583,8.583c-4.741-0.009-8.577-3.844-8.585-8.583c0.008-4.741,3.844-8.577,8.585-8.585c1.913,0,3.665,0.629,5.09,1.686l-1.782,1.783l8.429,2.256l-2.26-8.427l-1.89,1.89c-2.072-1.677-4.717-2.688-7.587-2.688C8.826,3.418,3.418,8.826,3.416,15.5C3.418,22.175,8.826,27.583,15.5,27.583S27.583,22.175,27.583,15.5H24.083z",
    icons: "M4.083,14H14V4.083H4.083V14zM17,4.083V14h9.917V4.083H17zM17,26.917h9.917v-9.918H17V26.917zM4.083,26.917H14v-9.918H4.083V26.917z",
    //Author of like icon: http://designmodo.com/linecons-free
    like: "M29.164,10.472c-1.25-0.328-4.189-0.324-8.488-0.438   c0.203-0.938,0.25-1.784,0.25-3.286C20.926,3.16,18.312,0,16,0c-1.633,0-2.979,1.335-3,2.977c-0.022,2.014-0.645,5.492-4,7.256   c-0.246,0.13-0.95,0.477-1.053,0.522L8,10.8C7.475,10.347,6.747,10,6,10H3c-1.654,0-3,1.346-3,3v16c0,1.654,1.346,3,3,3h3   c1.19,0,2.186-0.719,2.668-1.727c0.012,0.004,0.033,0.01,0.047,0.012c0.066,0.018,0.144,0.037,0.239,0.062   C8.972,30.352,8.981,30.354,9,30.359c0.576,0.143,1.685,0.408,4.055,0.953C13.563,31.428,16.247,32,19.027,32h5.467   c1.666,0,2.867-0.641,3.582-1.928c0.01-0.02,0.24-0.469,0.428-1.076c0.141-0.457,0.193-1.104,0.023-1.76   c1.074-0.738,1.42-1.854,1.645-2.58c0.377-1.191,0.264-2.086,0.002-2.727c0.604-0.57,1.119-1.439,1.336-2.766   c0.135-0.822-0.01-1.668-0.389-2.372c0.566-0.636,0.824-1.436,0.854-2.176l0.012-0.209C31.994,14.275,32,14.194,32,13.906   C32,12.643,31.125,11.032,29.164,10.472z M7,29c0,0.553-0.447,1-1,1H3c-0.553,0-1-0.447-1-1V13c0-0.553,0.447-1,1-1h3   c0.553,0,1,0.447,1,1V29z M29.977,14.535C29.957,15.029,29.75,16,28,16c-1.5,0-2,0-2,0c-0.277,0-0.5,0.224-0.5,0.5S25.723,17,26,17   c0,0,0.438,0,1.938,0s1.697,1.244,1.6,1.844C29.414,19.59,29.064,21,27.375,21C25.688,21,25,21,25,21c-0.277,0-0.5,0.223-0.5,0.5   c0,0.275,0.223,0.5,0.5,0.5c0,0,1.188,0,1.969,0c1.688,0,1.539,1.287,1.297,2.055C27.947,25.064,27.752,26,25.625,26   c-0.719,0-1.631,0-1.631,0c-0.277,0-0.5,0.223-0.5,0.5c0,0.275,0.223,0.5,0.5,0.5c0,0,0.693,0,1.568,0   c1.094,0,1.145,1.035,1.031,1.406c-0.125,0.406-0.273,0.707-0.279,0.721C26.012,29.672,25.525,30,24.494,30h-5.467   c-2.746,0-5.47-0.623-5.54-0.639c-4.154-0.957-4.373-1.031-4.634-1.105c0,0-0.846-0.143-0.846-0.881L8,13.563   c0-0.469,0.299-0.893,0.794-1.042c0.062-0.024,0.146-0.05,0.206-0.075c4.568-1.892,5.959-6.04,6-9.446c0.006-0.479,0.375-1,1-1   c1.057,0,2.926,2.122,2.926,4.748C18.926,9.119,18.83,9.529,18,12c10,0,9.93,0.144,10.812,0.375C29.906,12.688,30,13.594,30,13.906   C30,14.249,29.99,14.199,29.977,14.535z",
    //Author of these icons: https://github.com/github/octicons
    github: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59 0.4 0.07 0.55-0.17 0.55-0.38 0-0.19-0.01-0.82-0.01-1.49-2.01 0.37-2.53-0.49-2.69-0.94-0.09-0.23-0.48-0.94-0.82-1.13-0.28-0.15-0.68-0.52-0.01-0.53 0.63-0.01 1.08 0.58 1.23 0.82 0.72 1.21 1.87 0.87 2.33 0.66 0.07-0.52 0.28-0.87 0.51-1.07-1.78-0.2-3.64-0.89-3.64-3.95 0-0.87 0.31-1.59 0.82-2.15-0.08-0.2-0.36-1.02 0.08-2.12 0 0 0.67-0.21 2.2 0.82 0.64-0.18 1.32-0.27 2-0.27 0.68 0 1.36 0.09 2 0.27 1.53-1.04 2.2-0.82 2.2-0.82 0.44 1.1 0.16 1.92 0.08 2.12 0.51 0.56 0.82 1.27 0.82 2.15 0 3.07-1.87 3.75-3.65 3.95 0.29 0.25 0.54 0.73 0.54 1.48 0 1.07-0.01 1.93-0.01 2.2 0 0.21 0.15 0.46 0.55 0.38C13.71 14.53 16 11.53 16 8 16 3.58 12.42 0 8 0z",
    issue: "M7 2.3c3.14 0 5.7 2.56 5.7 5.7S10.14 13.7 7 13.7 1.3 11.14 1.3 8s2.56-5.7 5.7-5.7m0-1.3C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7S10.86 1 7 1z m1 3H6v5h2V4z m0 6H6v2h2V10z",
    watch: "M8.06 2C3 2 0 8 0 8s3 6 8.06 6c4.94 0 7.94-6 7.94-6S13 2 8.06 2z m-0.06 10c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4z m2-4c0 1.11-0.89 2-2 2s-2-0.89-2-2 0.89-2 2-2 2 0.89 2 2z",
    forked: "M8 1c-1.11 0-2 0.89-2 2 0 0.73 0.41 1.38 1 1.72v1.28L5 8 3 6v-1.28c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2S0 1.89 0 3c0 0.73 0.41 1.38 1 1.72v1.78l3 3v1.78c-0.59 0.34-1 0.98-1 1.72 0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.73-0.41-1.38-1-1.72V9.5l3-3V4.72c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2zM2 4.2c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3 10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3-10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z",
    downloaded: "M9 13h2l-3 3-3-3h2V8h2v5z m3-8c0-0.44-0.91-3-4.5-3-2.42 0-4.5 1.92-4.5 4C1.02 6 0 7.52 0 9c0 1.53 1 3 3 3 0.44 0 2.66 0 3 0v-1.3H3C1.38 10.7 1.3 9.28 1.3 9c0-0.17 0.05-1.7 1.7-1.7h1.3v-1.3c0-1.39 1.56-2.7 3.2-2.7 2.55 0 3.13 1.55 3.2 1.8v1.2h1.3c0.81 0 2.7 0.22 2.7 2.2 0 2.09-2.25 2.2-2.7 2.2H10v1.3c0.38 0 1.98 0 2 0 2.08 0 4-1.16 4-3.5 0-2.44-1.92-3.5-4-3.5z",
    starred: "M14 6l-4.9-0.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14l4.33-2.33 4.33 2.33L10.4 9.26 14 6z",
    mail: "m 0,4 0,8 c 0,0.55 0.45,1 1,1 l 12,0 c 0.55,0 1,-0.45 1,-1 L 14,4 C 14,3.45 13.55,3 13,3 L 1,3 C 0.45,3 0,3.45 0,4 Z M 13,4 7,9 1,4 13,4 Z m -12,1.5 4,3 -4,3 0,-6 z M 2,12 5.5,9 7,10.5 8.5,9 12,12 2,12 Z m 11,-0.5 -4,-3 4,-3 0,6 z",
    mention: "m 6.58,15 c 1.25,0 2.52,-0.31 3.56,-0.94 L 9.72,13.12 c -0.84,0.52 -1.89,0.83 -3.03,0.83 -3.23,0 -5.64,-2.08 -5.64,-5.72 0,-4.37 3.23,-7.18 6.58,-7.18 3.45,0 5.22,2.19 5.22,5.2 0,2.39 -1.34,3.86 -2.5,3.86 C 9.3,10.11 8.99,9.38 9.3,7.92 l 0.73,-3.75 -1.05,0 -0.11,0.72 C 8.46,4.26 7.93,4.06 7.31,4.06 c -2.19,0 -3.66,2.39 -3.66,4.38 0,1.67 0.94,2.61 2.3,2.61 0.84,0 1.67,-0.53 2.3,-1.25 0.11,0.94 0.94,1.45 1.98,1.45 1.67,0 3.77,-1.67 3.77,-5 C 14,2.61 11.59,0 7.83,0 3.66,0 0,3.33 0,8.33 0,12.71 2.92,15 6.58,15 Z M 6.27,10 C 5.54,10 4.91,9.48 4.91,8.33 c 0,-1.45 0.94,-3.22 2.41,-3.22 0.52,0 0.84,0.2 1.25,0.83 L 8.05,8.96 C 7.42,9.69 6.8,10.01 6.27,10.01 Z",
    //Author of these icons: https://nucleoapp.com
    beer: "m 54,29 -7,0 0,-3.5 C 49.4,23.9 51,21.1 51,18 51,13 47,9 42,9 41.4,9 40.7,9.1 40.1,9.2 38.2,4.3 33.4,1 28,1 22.6,1 17.8,4.3 15.9,9.2 15.3,9.1 14.6,9 14,9 9,9 5,13 5,18 c 0,3.1 1.6,5.9 4,7.5 L 9,56 c 0,3.9 3.1,7 7,7 l 24,0 c 3.9,0 7,-3.1 7,-7 l 0,-9 3,0 c 2.8,0 5,-2.2 5,-5 l 0,-12 c 0,-0.6 -0.4,-1 -1,-1 z M 7,18 c 0,-3.9 3.1,-7 7,-7 0.7,0 1.4,0.1 2.2,0.4 0.3,0.1 0.5,0.1 0.8,-0.1 0.2,-0.1 0.4,-0.3 0.5,-0.6 C 18.9,6.1 23.1,3 28,3 c 4.9,0 9.1,3.1 10.5,7.7 0.1,0.3 0.3,0.5 0.5,0.6 0.2,0.1 0.5,0.1 0.8,0.1 0.8,-0.3 1.5,-0.4 2.2,-0.4 3.9,0 7,3.1 7,7 0,3.9 -3.1,7 -7,7 l -16,0 c -0.6,0 -1,0.4 -1,1 l 0,12 c 0,1.7 -1.3,3 -3,3 -1.7,0 -3,-1.3 -3,-3 l 0,-12 c 0,-0.6 -0.4,-1 -1,-1 l -4,0 C 10.1,25 7,21.9 7,18 Z m 16,34 c 0,0.6 -0.4,1 -1,1 -0.6,0 -1,-0.4 -1,-1 l 0,-4 c 0,-0.6 0.4,-1 1,-1 0.6,0 1,0.4 1,1 l 0,4 z m 12,0 c 0,0.6 -0.4,1 -1,1 -0.6,0 -1,-0.4 -1,-1 l 0,-16 c 0,-0.6 0.4,-1 1,-1 0.6,0 1,0.4 1,1 l 0,16 z M 53,42 c 0,1.7 -1.3,3 -3,3 l -3,0 0,-14 6,0 0,11 z",
    pizza: "m 5.6194922,32.356222 c 4.4196418,1.988507 9.1055278,2.982761 13.8979098,2.982761 4.792383,0 9.478269,-0.994254 13.897911,-2.982761 0.106497,-0.05233 0.212995,-0.156987 0.266243,-0.313975 0.05325,-0.156987 0.05325,-0.261645 -0.05325,-0.418633 L 19.996641,5.249728 c -0.159746,-0.366304 -0.745482,-0.366304 -0.958477,0 L 5.3532487,31.623614 C 5.3,31.728272 5.3,31.88526 5.3,32.042247 c 0.053249,0.156988 0.1597461,0.261646 0.3194922,0.313975 z M 19.517402,6.6626147 30.113893,27.070979 c -3.301419,1.255899 -7.028828,1.988507 -10.596491,1.988507 -3.567662,0 -7.295071,-0.732608 -10.5964905,-1.988507 l 2.6624345,-5.180585 c 0.319493,1.098912 1.331218,1.936178 2.555938,1.936178 1.490963,0 2.662435,-1.151241 2.662435,-2.616457 0,-1.465215 -1.171472,-2.616457 -2.662435,-2.616457 -0.319492,0 -0.638984,0.05233 -0.958477,0.156988 L 19.517402,6.6626147 Z M 14.192533,19.640241 c 0.905228,0 1.597461,0.680279 1.597461,1.569874 0,0.889596 -0.692233,1.569875 -1.597461,1.569875 -0.905228,0 -1.597461,-0.680279 -1.597461,-1.569875 0,-0.889595 0.692233,-1.569874 1.597461,-1.569874 z m -5.7508598,8.320333 c 3.4079168,1.412887 7.3483208,2.145495 11.0757288,2.145495 3.727409,0 7.667813,-0.732608 11.07573,-2.145495 l 1.916953,3.66304 c -4.153399,1.779191 -8.519792,2.668786 -12.992683,2.668786 -4.47289,0 -8.839283,-0.889595 -12.9394332,-2.668786 l 1.8637044,-3.66304 z M 19.517402,17.547076 c 0.905228,0 1.597461,-0.680279 1.597461,-1.569874 0,-0.889596 -0.692233,-1.569875 -1.597461,-1.569875 -0.905227,0 -1.59746,0.680279 -1.59746,1.569875 0,0.889595 0.692233,1.569874 1.59746,1.569874 z m 0,-2.093166 c 0.319493,0 0.532487,0.209317 0.532487,0.523292 0,0.313974 -0.212994,0.523291 -0.532487,0.523291 -0.319492,0 -0.532487,-0.209317 -0.532487,-0.523291 0,-0.313975 0.212995,-0.523292 0.532487,-0.523292 z m 0.532487,8.895954 c 0,1.465216 1.171472,2.616457 2.662435,2.616457 1.490964,0 2.662435,-1.151241 2.662435,-2.616457 0,-1.465216 -1.171471,-2.616457 -2.662435,-2.616457 -1.490963,0 -2.662435,1.151241 -2.662435,2.616457 z m 2.662435,-1.569874 c 0.905228,0 1.597461,0.680278 1.597461,1.569874 0,0.889595 -0.692233,1.569874 -1.597461,1.569874 -0.905227,0 -1.597461,-0.680279 -1.597461,-1.569874 0,-0.889596 0.692234,-1.569874 1.597461,-1.569874 z",
    //Author of these icons: http://plainicon.com
    npm: "M0,11.326v4.016h6.686v1.347h5.338v-1.347H24v-8.03H0.001L0,11.326L0,11.326z M6.685,11.326v2.669H5.337v-3.992H4.04v3.992  H1.298V8.656h5.387V11.326z M13.361,11.33L13.346,14l-2.621-0.009v1.351H7.984V8.656h5.387L13.361,11.33L13.361,11.33z M22.7,11.326  v2.669h-1.347v-3.992h-1.347v4.017l-1.347-0.028v-3.988h-1.299v3.992h-2.693V8.656H22.7V11.326L22.7,11.326z M10.725,11.326v1.322  h1.25v-2.646h-1.25v1.321V11.326z",
    bower: "m 1.3179582,2.0417885 c -0.098158,0 -0.177849,0.079691 -0.177849,0.177707 0,0.098016 0.079549,0.1779912 0.177849,0.1779912 0.0983,0 0.177707,-0.079691 0.177707,-0.1778491 0,-0.0983 -0.079549,-0.1778491 -0.177707,-0.1778491 z m 0,0.1635019 c -0.057247,0 -0.1035559,-0.028979 -0.1035559,-0.064492 0,-0.035513 0.046309,-0.06435 0.1035559,-0.06435 0.057105,0 0.1035559,0.028979 0.1035559,0.06435 0,0.035513 -0.046451,0.064492 -0.1035559,0.064492 z M 3.3443296,2.9139877 C 3.1688955,2.745372 2.2920086,2.6401114 2.0154334,2.6097123 c 0.013211,-0.031678 0.024717,-0.064492 0.034235,-0.098158 0.037786,-0.016478 0.078413,-0.031962 0.1206022,-0.044604 0.00511,0.0152 0.029405,0.073157 0.043042,0.1007148 C 2.7697294,2.5830066 2.7982819,2.1541516 2.8208681,2.0366747 2.8428862,1.9217546 2.8420339,1.810812 3.0328097,1.6078197 2.7485637,1.5250034 2.339596,1.7362347 2.2026579,2.0507378 2.1510931,2.0315608 2.0993861,2.0172135 2.0485315,2.0085484 2.0118821,1.8609564 1.8213904,1.45 1.3219357,1.45 0.99848333,1.45 0.67218995,1.5836709 0.42672413,1.8166361 0.2946158,1.9422101 0.1907758,2.0910806 0.11818724,2.2596963 0.03977455,2.4416648 0,2.6419581 0,2.8551781 c 0,0.7426478 0.50684145,1.3932458 0.79321823,1.3932458 0.12500574,0 0.23268117,-0.093612 0.25796637,-0.177565 0.021166,0.057673 0.086083,0.2366586 0.1073913,0.2819732 0.031678,0.067475 0.1774229,0.125716 0.2412043,0.055684 0.082106,0.045599 0.2326811,0.072873 0.3146451,-0.048582 0.1581038,0.033382 0.297883,-0.060798 0.300724,-0.1734455 0.07756,-0.00398 0.1156303,-0.1130733 0.098726,-0.199725 C 2.1015169,3.9229828 1.9681301,3.6937109 1.915997,3.61473 c 0.1029877,0.083953 0.3639372,0.1073913 0.3954727,0 0.1659167,0.1302617 0.4248775,0.062077 0.445333,-0.044178 C 2.9585165,3.6231111 3.1899191,3.507907 3.1519913,3.368554 3.4762959,3.3461098 3.4346747,3.0013496 3.3436194,2.9138456 l 7.102e-4,0 z M 2.5001148,2.3422285 c -0.085373,-0.033524 -0.1937589,-0.05469 -0.2694726,-0.05469 -0.1075334,0 -0.1733034,0.06094 -0.2745865,0.06094 -0.021166,0 -0.07202,1.421e-4 -0.1126472,-0.014347 0.026848,0.028126 0.060088,0.043326 0.1245796,0.043326 0.038496,0 0.1150621,-0.019745 0.1768547,-0.038354 8.523e-4,0.013211 0.00241,0.025996 0.00412,0.03878 -0.1157724,0.0277 -0.2375109,0.1014251 -0.2727398,0.1206021 -0.078271,-0.1728772 -0.010938,-0.336379 0.051139,-0.4116666 0.278706,5.682e-4 0.5038584,0.1920543 0.5727536,0.2554095 l 0,0 z m 0.12046,-0.012785 -0.042616,-0.039775 C 2.5340652,2.2484742 2.4886085,2.2115406 2.4415893,2.1785846 2.511621,2.0400839 2.599125,1.8887986 2.7099255,1.7953284 2.588187,1.8444783 2.4674428,1.991218 2.3964168,2.1481855 2.3601936,2.125173 2.323118,2.1045755 2.2861845,2.086677 2.3854788,1.8745934 2.6163133,1.6975966 2.8704443,1.6838176 2.7001239,1.8383701 2.7640473,2.1466229 2.6205748,2.3294438 l 0,0 z M 2.2707008,2.4739106 C 2.25195,2.4331417 2.232915,2.365525 2.2351878,2.3258925 c 0.031536,-7.103e-4 0.092334,0.011222 0.1019933,0.013353 -0.00384,0.018609 -0.00582,0.05952 -0.00582,0.064918 0.00597,-0.01037 0.02287,-0.046025 0.029547,-0.060088 0.060798,0.011506 0.1406315,0.030967 0.1875086,0.052843 -0.054974,0.035371 -0.1483022,0.074151 -0.2777116,0.076992 l 0,0 z M 1.8911379,1.9959057 C 1.6688266,2.2212002 1.7564727,2.5062985 1.8374423,2.6349976 1.7223802,2.8266257 1.4959493,2.9574556 1.2331532,3.0171174 c 0.295184,0 0.4687715,-0.075998 0.5699125,-0.150291 0.06435,-0.047587 0.099294,-0.094465 0.1171929,-0.1204601 0.4375201,0.028268 1.1304496,0.169326 1.1982084,0.2149247 0.02699,0.018325 0.054974,0.058809 0.059236,0.09759 -0.3287083,-0.046025 -0.9216332,-0.094465 -1.076896,-0.1025616 0.1102323,0.015626 0.9139624,0.1679055 1.0533154,0.2034185 -0.042331,0.069037 -0.1390689,0.1181872 -0.2845302,0.084095 0.078697,0.1071072 -0.074009,0.2356643 -0.2869449,0.1649224 0.046735,0.1052605 -0.1424782,0.1998671 -0.357829,0.090203 0.00284,0.1052605 -0.2670577,0.117619 -0.3737387,0.00114 0.00213,0.013779 0.014773,0.040343 0.020313,0.051991 -0.034377,0.3074005 -0.2862347,0.4978922 -0.543917,0.4978922 -0.63127897,0 -1.18116217,-0.5126656 -1.18116217,-1.1947992 0,-0.7210558 0.53283696,-1.2591487 1.17590627,-1.2591487 0.3680566,0 0.5345416,0.2900702 0.5689181,0.3998763 l 0,0 z",
    google: "m 22.867,3 -6.5,0 C 14.669,3 12.527,3.25 10.73,4.728 9.374,5.897 8.714,7.5 8.714,8.95 c 0,2.457 1.891,4.95 5.232,4.95 0.316,0 0.658,-0.035 1.009,-0.067 -0.157,0.375 -0.317,0.691 -0.317,1.23 0,0.972 0.505,1.572 0.946,2.139 -1.416,0.098 -4.065,0.254 -6.022,1.452 -1.862,1.1 -2.428,2.703 -2.428,3.844 0,2.329 2.209,4.503 6.779,4.503 5.421,0 8.29,-2.995 8.29,-5.958 0,-2.171 -1.256,-3.244 -2.643,-4.407 l -1.141,-0.882 c -0.349,-0.284 -0.816,-0.66 -0.816,-1.353 0,-0.698 0.468,-1.135 0.883,-1.545 1.319,-1.04 2.648,-2.143 2.648,-4.469 0,-2.396 -1.516,-3.656 -2.239,-4.254 l 1.956,0 L 22.867,3 Z m -2.775,19.271 c 0,1.95 -1.605,3.409 -4.632,3.409 -3.378,0 -5.552,-1.611 -5.552,-3.844 0,-2.242 2.02,-2.995 2.712,-3.247 1.326,-0.443 3.029,-0.501 3.313,-0.501 0.313,0 0.469,0 0.726,0.029 2.394,1.696 3.433,2.552 3.433,4.154 z m -2.52,-10.14 c -0.507,0.5 -1.356,0.88 -2.15,0.88 -2.709,0 -3.937,-3.496 -3.937,-5.606 0,-0.818 0.159,-1.667 0.692,-2.33 0.505,-0.63 1.39,-1.038 2.208,-1.038 2.612,0 3.972,3.527 3.972,5.794 0,0.568 -0.058,1.574 -0.785,2.3 z",
    //Author of these icons: https://www.iconfinder.com
    pinterest: "m 12.388873,0.40167736 c -7.9424609,0 -11.94759894,5.69406504 -11.94759894,10.44340664 0,2.875093 1.08853704,5.432746 3.42287004,6.38507 0.382917,0.157843 0.726081,0.0058 0.837156,-0.417994 0.07717,-0.292303 0.26015,-1.032415 0.34141,-1.341671 0.11166,-0.419163 0.0684,-0.565315 -0.240858,-0.931863 -0.672882,-0.79331 -1.103736,-1.821048 -1.103736,-3.277887 0,-4.2243646 3.160966,-8.0061829 8.2306719,-8.0061829 4.489191,0 6.955645,2.7429723 6.955645,6.4055313 0,4.8206626 -2.133228,8.8889376 -5.299456,8.8889376 -1.749142,0 -3.057491,-1.445731 -2.638913,-3.220011 0.502177,-2.118029 1.475547,-4.40267 1.475547,-5.9325846 0,-1.367978 -0.73485,-2.50913 -2.254242,-2.50913 -1.7877259,0 -3.2241039,1.849694 -3.2241039,4.3266706 0,1.577853 0.533161,2.645344 0.533161,2.645344 0,0 -1.829233,7.751879 -2.150182,9.109335 -0.63839,2.703804 -0.09587,6.017353 -0.04969,6.351747 0.02689,0.198766 0.28178,0.246704 0.397532,0.09704 0.164274,-0.21572 2.29458,-2.84411 3.017738,-5.47133 0.205196,-0.743035 1.175643,-4.594421 1.175643,-4.594421 0.5810979,1.108413 2.2787949,2.082367 4.0840589,2.082367 5.373117,0 9.019306,-4.898416 9.019306,-11.4553596 5.84e-4,-4.9592099 -4.199228,-9.57701504 -10.581959,-9.57701504 z",
    pin: "M 16.729,4.271 C 16.34,3.88 15.708,3.878 15.315,4.267 15.211,4.371 15.139,4.494 15.09,4.622 14.258,6.358 13.342,7.337 12.186,7.915 10.889,8.555 9.4,9 7,9 6.87,9 6.74,9.025 6.618,9.076 6.373,9.178 6.179,9.373 6.077,9.617 c -0.101,0.244 -0.101,0.52 0,0.764 0.051,0.123 0.124,0.234 0.217,0.326 L 9.537,13.95 5,20 l 6.05,-4.537 3.242,3.242 c 0.092,0.094 0.203,0.166 0.326,0.217 C 14.74,18.973 14.87,19 15,19 c 0.13,0 0.26,-0.027 0.382,-0.078 0.245,-0.102 0.44,-0.295 0.541,-0.541 C 15.974,18.26 16,18.129 16,18 16,15.6 16.444,14.111 17.083,12.834 17.66,11.678 18.639,10.762 20.376,9.93 20.505,9.881 20.627,9.809 20.73,9.705 21.119,9.312 21.117,8.68 20.726,8.291 l -3.997,-4.02 z",
    instagram: "m 38.022717,13.618823 -19.631434,0 c -3.410037,0 -6.184283,2.7736 -6.184283,6.183637 l 0,6.532193 0,13.099887 c 0,3.410037 2.774246,6.183637 6.184283,6.183637 l 19.63208,0 c 3.410037,0 6.183637,-2.7736 6.183637,-6.183637 l 0,-13.100532 0,-6.532193 c -6.45e-4,-3.410038 -2.774246,-6.182992 -6.184283,-6.182992 z m 1.773762,3.687591 0.707439,-0.0026 0,0.704211 0,4.719703 -5.405842,0.01743 -0.01872,-5.423269 4.717121,-0.01549 z m -16.15685,9.027594 c 1.025012,-1.418106 2.687752,-2.348234 4.567371,-2.348234 1.879619,0 3.542359,0.930128 4.56608,2.348234 0.666775,0.925609 1.066323,2.057769 1.066323,3.284169 0,3.105374 -2.528966,5.631758 -5.633048,5.631758 -3.10602,0 -5.632403,-2.526384 -5.632403,-5.631758 6.45e-4,-1.2264 0.398902,-2.35856 1.065677,-3.284169 z m 17.449088,13.099887 c 0,1.691786 -1.375504,3.065999 -3.066,3.065999 l -19.631434,0 c -1.691141,0 -3.066645,-1.374213 -3.066645,-3.065999 l 0,-13.099887 4.776504,0 c -0.412457,1.014684 -0.644182,2.122962 -0.644182,3.284169 0,4.823625 3.924479,8.750686 8.75004,8.750686 4.824915,0 8.749395,-3.927061 8.749395,-8.750686 0,-1.161207 -0.233016,-2.269485 -0.645474,-3.284169 l 4.777796,0 0,13.099887 z",
    //Author of these icons: https://worldvectorlogo.com
    jsdelivr: "m 174.235,140.62 c 0,4.123 -3.343,7.466 -7.467,7.466 -4.124,0 -7.467,-3.343 -7.467,-7.466 0,-4.124 3.343,-7.467 7.467,-7.467 4.124,0 7.467,3.343 7.467,7.467 z M 129.68,93.85 c 0,4.123 -3.343,7.466 -7.466,7.466 -4.124,0 -7.467,-3.343 -7.467,-7.466 0,-4.124 3.343,-7.467 7.467,-7.467 4.123,0 7.466,3.343 7.466,7.467 z m -1.969,-12.639 c 9.104,-9.002 19.144,-16.759 29.379,-22.47 -9.307,-3.989 -19.555,-6.205 -30.323,-6.205 -5.039,0 -9.961,0.5 -14.731,1.424 0.863,7.608 3.7,16.714 8.198,26.263 0.648,-0.093 1.306,-0.158 1.98,-0.158 1.955,0 3.812,0.412 5.497,1.146 z M 88.907,151.76 c 0.711,-5.656 2.044,-11.461 4.049,-17.382 3.799,-11.214 9.948,-22.554 17.618,-33.165 -1.351,-2.132 -2.145,-4.653 -2.145,-7.363 0,-3.722 1.481,-7.093 3.878,-9.573 -4.688,-9.881 -7.802,-19.551 -8.936,-28.113 C 72.26,66.071 49.72,95.19 49.72,129.583 c 0,2.254 0.118,4.479 0.307,6.684 9.542,11.564 20.334,18.108 31.005,21.5 1.773,-2.873 4.562,-5.044 7.875,-6.007 z m 43.017,-36.592 c -2.132,-2.623 -4.158,-5.309 -6.096,-8.029 -1.154,0.314 -2.362,0.495 -3.614,0.495 -1.689,0 -3.3,-0.318 -4.796,-0.874 -6.98,9.76 -12.581,20.166 -16.069,30.461 -1.487,4.391 -2.809,9.473 -3.555,14.946 3.838,1.51 6.837,4.681 8.097,8.637 2.832,-0.139 5.556,-0.421 8.135,-0.801 13.701,-2.017 27.372,-7.369 39.685,-14.988 -0.465,-1.382 -0.728,-2.857 -0.728,-4.396 0,-1.294 0.192,-2.542 0.525,-3.73 -7.1,-5.738 -14.378,-12.859 -21.584,-21.721 z m 1.245,-12.976 c 7.042,9.891 15.605,19.4 25.364,27.392 2.299,-1.719 5.143,-2.749 8.235,-2.749 2.729,0 5.266,0.803 7.406,2.171 9.813,-9.608 17.616,-20.733 22.215,-32.446 -6.476,-13.628 -16.828,-25.057 -29.64,-32.85 -11.275,5.353 -22.49,13.561 -32.515,23.403 1.119,1.993 1.764,4.288 1.764,6.737 0,3.139 -1.061,6.024 -2.829,8.342 z m 47.07,41.338 c 6.597,3.143 13.523,5.5 20.722,6.818 1.845,-6.609 2.854,-13.567 2.854,-20.765 0,-7.421 -1.071,-14.589 -3.029,-21.38 -5.209,9.957 -12.464,19.349 -21.092,27.664 0.546,1.483 0.859,3.079 0.859,4.752 0,1 -0.112,1.972 -0.314,2.911 z M 79.041,166.35 c -9.512,-2.946 -18.26,-7.782 -26.015,-14.413 7.526,24.86 27.276,44.393 52.259,51.636 -3.462,-3.402 -6.25,-6.861 -8.375,-10.409 -2.75,-4.59 -4.832,-9.464 -6.266,-14.569 -6.167,-0.951 -10.988,-5.973 -11.603,-12.245 z m 79.999,-14.316 c -13.536,8.524 -28.616,14.512 -43.724,16.736 -3.248,0.478 -6.453,0.776 -9.61,0.907 -1.142,3.153 -3.389,5.774 -6.288,7.378 1.161,3.877 2.816,7.753 5.094,11.555 3.637,6.071 9.755,11.978 18.568,17.927 1.222,0.058 2.451,0.094 3.687,0.094 32.212,0 59.793,-19.775 71.302,-47.841 -6.279,-1.28 -13.928,-3.591 -22.368,-7.683 -2.406,2.052 -5.522,3.297 -8.933,3.297 -2.864,0 -5.524,-0.874 -7.728,-2.37 z m -58.816,12.955 c 0,4.124 -3.343,7.467 -7.467,7.467 -4.124,0 -7.467,-3.343 -7.467,-7.467 0,-4.124 3.343,-7.467 7.467,-7.467 4.124,0 7.467,3.343 7.467,7.467 z M 126.517,0 256,45.398 236.333,212.796 126.517,272.817 17.706,212.715 0,45.422 126.517,0",

    /* =========================== */
    /* Predefined hybrid icons     */
    /* =========================== */

    setpresets: function (hybicon, iconName) {

        switch (iconName) {
            case "twitter-bubble":
                hybicon.icon1Init.centerX = 36;
                hybicon.icon1Init.size = 65;
                hybicon.icon2Init.centerX = 82;
                hybicon.icon2Init.centerY = 23;
                hybicon.icon2Anim.size = 31;
                break;
            case "linkedin-link":
            case "google-plus":
            case "facebook-like":
            case "pinterest-pin":
            case "instagram-fave":
                hybicon.icon1Init.size = 65;
                hybicon.icon2Anim.size = 25;
                break;
            case "user-idea":
                hybicon.icon1Init.centerX = 47;
                hybicon.icon1Init.size = 85;
                hybicon.icon2Init.centerX = 75;
                hybicon.icon2Init.centerY = 25;
                break;
            case "checkbox-check":
                hybicon.icon1InitSettings = "50,50,70";
                hybicon.icon2InitSettings = "50,50";
                hybicon.icon2Anim.size = 50;
                break;
            case "switch-circle":
                hybicon.icon1InitSettings = "50,50,95";
                hybicon.icon2InitSettings = "24,50,33";
                hybicon.icon2AnimSettings = "76";
                break;
        }
    }
};

///#source 1 1 /js/hybicon.github.js
/* ======================================================================================= */
/*                                   hybicon.github.js                                     */
/* ======================================================================================= */
/* This is a small JavaScript library for GitHub API with hybicon.                         */
/* Requires hybicon.js (http://hybicon.softwaretailoring.net)                              */
/* ======================================================================================= */
/* Check http://hybicon.softwaretailoring.net/github.html for samples.                     */
/* Fork https://github.com/softwaretailoring/hybicon for contribution.                     */
/* ======================================================================================= */
/* Copyright © 2015 Gábor Berkesi (http://softwaretailoring.net)                           */
/* Licensed under MIT (https://github.com/softwaretailoring/hybicon/blob/master/LICENSE)   */
/* ======================================================================================= */

/* ======================================================================================= */
/* Documentation: http://hybicon.softwaretailoring.net                                     */
/* ======================================================================================= */

hybicongithub = function (divId) {

    if (divId !== undefined &&
        divId !== null) {
        this.holderId = divId;
    }

    var holderDiv = document.getElementById(divId);

    if ((holderDiv === null ||
        holderDiv === undefined)) {
        return this;
    }

    this.githubUser = null;
    this.githubRepo = null;
    this.githubRepoTag = null;

    this.parseIcon(holderDiv);

    if (this.githubUser !== null &&
        this.githubRepo !== null) {

        var githubUrl = 'https://github.com/' + this.githubUser + '/' + this.githubRepo;
        var githubApiUrl = 'https://api.github.com/repos/' + this.githubUser + '/' + this.githubRepo;

        // set type
        var icons = holderDiv.getAttribute("data-hybicon").split("-");
        var callbacktype = null;

        if (icons[0] === "github" ||
            icons[0] === "githubalt") {

            if (icons[1] === "starred" ||
                icons[1] === "star") {
                callbacktype = "stars";
                dividstar = divId;
                githubUrl += "/stargazers";
            }
            if (icons[1] === "forked" ||
                icons[1] === "fork") {
                callbacktype = "forks";
                dividfork = divId;
                githubUrl += "/network/members";
            }
            if (icons[1] === "watch" ||
                icons[1] === "view") {
                callbacktype = "watchers";
                dividwatch = divId;
                githubUrl += "/watchers";
            }
            if (icons[1] === "issue" ||
                icons[1] === "question") {
                callbacktype = "issues";
                dividissue = divId;
                githubUrl += "/issues";
            }
            if (icons[1] === "downloaded" ||
                icons[1] === "download") {
                callbacktype = "releases";
                dividdownload = divId;
                githubUrl += "/releases";
                githubApiUrl += "/releases";

                if (this.githubRepoTag !== null) {
                    githubApiUrl += "/tags/" + this.githubRepoTag;
                }
            }
        }

        // set GitHub API
        if (callbacktype !== null) {
            if (!holderDiv.hasAttribute("data-hybicon-infomode")) {
                holderDiv.setAttribute("data-hybicon-infomode", "");
            }
            if (!holderDiv.hasAttribute("title")) {
                var githubtitle = this.githubUser + "/" + this.githubRepo + " - " + callbacktype;
                if (this.githubRepoTag !== null &&
                    callbacktype === "releases") {
                    githubtitle += " " + this.githubRepoTag;
                }
                holderDiv.setAttribute("title", githubtitle);
            }

            var githubApi = document.createElement('script');
            githubApi.src = githubApiUrl + '?callback=hybicongithubcallback' + callbacktype;
            document.head.insertBefore(githubApi, document.head.firstChild);
        }

        // set hyperlink
        if (holderDiv.parentNode.tagName.toUpperCase() !== "A") {
            holderDiv.outerHTML = "<a href='" + githubUrl + "' target='_blank'>" + holderDiv.outerHTML + "</a>";
        }
    }

    return this;
};

function hybicongithubcallbackstars(obj) {
    createhybicongithub(dividstar, (obj.data.stargazers_count ? obj.data.stargazers_count : "star"));
};

function hybicongithubcallbackforks(obj) {
    createhybicongithub(dividfork, (obj.data.network_count ? obj.data.network_count : "fork"));
};

function hybicongithubcallbackwatchers(obj) {
    createhybicongithub(dividwatch, (obj.data.subscribers_count ? obj.data.subscribers_count : "watch"));
};

function hybicongithubcallbackissues(obj) {
    createhybicongithub(dividissue, (obj.data.open_issues_count ? obj.data.open_issues_count : "issue"));
};

function hybicongithubcallbackreleases(obj) {
    var download = 0;
    var objdata = obj.data;

    // All downloads
    if (Array.isArray(objdata)) {
        for (var i = 0; i < objdata.length; i++) {
            if (objdata[i].assets !== null &&
                objdata[i].assets !== undefined) {
                for (var j = 0; j < objdata[i].assets.length; j++) {
                    if (objdata[i].assets[j].download_count !== undefined) {
                        download += objdata[i].assets[j].download_count
                    }
                }
            }
        }
    }
    // Downloads per tag
    else {
        if (objdata.assets !== null &&
            objdata.assets !== undefined) {
            for (var i = 0; i < objdata.assets.length; i++) {
                if (objdata.assets[i].download_count !== undefined) {
                    download += objdata.assets[i].download_count
                }
            }
        }
    }

    if (download === 0) { download = "release"; }
    createhybicongithub(dividdownload, download);
};

function createhybicongithub(divId, infoText) {
    var thishybicon = document.getElementById(divId);
    thishybicon.setAttribute("data-hybicon-infotext", infoText);
    new hybicon(divId);
};

//Parse html5 data- attributes
hybicongithub.prototype.parseIcon = function (holderDiv) {
    if (holderDiv !== undefined &&
        holderDiv !== null) {
        //data-hybicon attribute is required
        var hybiconHasData = holderDiv.hasAttribute("data-hybicon");
        if (hybiconHasData) {

            //data-hybicon-github-user
            var hybiconGithubUser = holderDiv.getAttribute("data-hybicon-github-user");
            if (hybiconGithubUser !== null) {
                this.githubUser = hybiconGithubUser;
            }

            //data-hybicon-github-repo
            var hybiconGithubRepo = holderDiv.getAttribute("data-hybicon-github-repo");
            if (hybiconGithubRepo !== null) {
                this.githubRepo = hybiconGithubRepo;
            }

            //data-hybicon-github-repotag
            var hybiconGithubRepoTag = holderDiv.getAttribute("data-hybicon-github-repotag");
            if (hybiconGithubRepoTag !== null) {
                this.githubRepoTag = hybiconGithubRepoTag;
            }
        }
    }
};

hybicongithub.prototype.parseAll = function () {
    var hybicons = document.querySelectorAll('[data-hybicon-github-user]');

    for (var i = 0; i < hybicons.length; i++) {
        new hybicongithub(hybicons[i].id);
    }
};

document.addEventListener("DOMContentLoaded", function (event) {
    new hybicongithub().parseAll();
});
