import{r as registerInstance,h,H as Host,a as getElement}from"./index-c73a3717.js";import{i as isStr,b as inheritAttributes,g as getUrl,c as getName,d as isRTL}from"./utils-aad4f987.js";var validateContent=function(t){var e=document.createElement("div");e.innerHTML=t;for(var o=e.childNodes.length-1;o>=0;o--){if(e.childNodes[o].nodeName.toLowerCase()!=="svg"){e.removeChild(e.childNodes[o])}}var n=e.firstElementChild;if(n&&n.nodeName.toLowerCase()==="svg"){var i=n.getAttribute("class")||"";n.setAttribute("class",(i+" s-ion-icon").trim());if(isValid(n)){return e.innerHTML}}return""};var isValid=function(t){if(t.nodeType===1){if(t.nodeName.toLowerCase()==="script"){return false}for(var e=0;e<t.attributes.length;e++){var o=t.attributes[e].name;if(isStr(o)&&o.toLowerCase().indexOf("on")===0){return false}}for(var e=0;e<t.childNodes.length;e++){if(!isValid(t.childNodes[e])){return false}}}return true};var isSvgDataUrl=function(t){return t.startsWith("data:image/svg+xml")};var isEncodedDataUrl=function(t){return t.indexOf(";utf8,")!==-1};var ioniconContent=new Map;var requests=new Map;var parser;var getSvgContent=function(t,e){var o=requests.get(t);if(!o){if(typeof fetch!=="undefined"&&typeof document!=="undefined"){if(isSvgDataUrl(t)&&isEncodedDataUrl(t)){if(!parser){parser=new DOMParser}var n=parser.parseFromString(t,"text/html");var i=n.querySelector("svg");if(i){ioniconContent.set(t,i.outerHTML)}return Promise.resolve()}else{o=fetch(t).then((function(o){if(o.ok){return o.text().then((function(o){if(o&&e!==false){o=validateContent(o)}ioniconContent.set(t,o||"")}))}ioniconContent.set(t,"")}));requests.set(t,o)}}else{ioniconContent.set(t,"");return Promise.resolve()}}return o};var iconCss=":host{display:inline-block;width:1em;height:1em;contain:strict;fill:currentColor;-webkit-box-sizing:content-box !important;box-sizing:content-box !important}:host .ionicon{stroke:currentColor}.ionicon-fill-none{fill:none}.ionicon-stroke-width{stroke-width:32px;stroke-width:var(--ionicon-stroke-width, 32px)}.icon-inner,.ionicon,svg{display:block;height:100%;width:100%}@supports (background: -webkit-named-image(i)){:host(.icon-rtl) .icon-inner{-webkit-transform:scaleX(-1);transform:scaleX(-1)}}@supports not selector(:dir(rtl)) and selector(:host-context([dir='rtl'])){:host(.icon-rtl) .icon-inner{-webkit-transform:scaleX(-1);transform:scaleX(-1)}}:host(.flip-rtl):host-context([dir='rtl']) .icon-inner{-webkit-transform:scaleX(-1);transform:scaleX(-1)}@supports selector(:dir(rtl)){:host(.flip-rtl:dir(rtl)) .icon-inner{-webkit-transform:scaleX(-1);transform:scaleX(-1)}:host(.flip-rtl:dir(ltr)) .icon-inner{-webkit-transform:scaleX(1);transform:scaleX(1)}}:host(.icon-small){font-size:1.125rem !important}:host(.icon-large){font-size:2rem !important}:host(.ion-color){color:var(--ion-color-base) !important}:host(.ion-color-primary){--ion-color-base:var(--ion-color-primary, #3880ff)}:host(.ion-color-secondary){--ion-color-base:var(--ion-color-secondary, #0cd1e8)}:host(.ion-color-tertiary){--ion-color-base:var(--ion-color-tertiary, #f4a942)}:host(.ion-color-success){--ion-color-base:var(--ion-color-success, #10dc60)}:host(.ion-color-warning){--ion-color-base:var(--ion-color-warning, #ffce00)}:host(.ion-color-danger){--ion-color-base:var(--ion-color-danger, #f14141)}:host(.ion-color-light){--ion-color-base:var(--ion-color-light, #f4f5f8)}:host(.ion-color-medium){--ion-color-base:var(--ion-color-medium, #989aa2)}:host(.ion-color-dark){--ion-color-base:var(--ion-color-dark, #222428)}";var Icon=function(){function t(t){registerInstance(this,t);this.iconName=null;this.inheritedAttributes={};this.didLoadIcon=false;this.svgContent=undefined;this.isVisible=false;this.mode=getIonMode();this.color=undefined;this.ios=undefined;this.md=undefined;this.flipRtl=undefined;this.name=undefined;this.src=undefined;this.icon=undefined;this.size=undefined;this.lazy=false;this.sanitize=true}t.prototype.componentWillLoad=function(){this.inheritedAttributes=inheritAttributes(this.el,["aria-label"])};t.prototype.connectedCallback=function(){var t=this;this.waitUntilVisible(this.el,"50px",(function(){t.isVisible=true;t.loadIcon()}))};t.prototype.componentDidLoad=function(){if(!this.didLoadIcon){this.loadIcon()}};t.prototype.disconnectedCallback=function(){if(this.io){this.io.disconnect();this.io=undefined}};t.prototype.waitUntilVisible=function(t,e,o){var n=this;if(this.lazy&&typeof window!=="undefined"&&window.IntersectionObserver){var i=this.io=new window.IntersectionObserver((function(t){if(t[0].isIntersecting){i.disconnect();n.io=undefined;o()}}),{rootMargin:e});i.observe(t)}else{o()}};t.prototype.loadIcon=function(){var t=this;if(this.isVisible){var e=getUrl(this);if(e){if(ioniconContent.has(e)){this.svgContent=ioniconContent.get(e)}else{getSvgContent(e,this.sanitize).then((function(){return t.svgContent=ioniconContent.get(e)}))}this.didLoadIcon=true}}this.iconName=getName(this.name,this.icon,this.mode,this.ios,this.md)};t.prototype.render=function(){var t,e;var o=this,n=o.flipRtl,i=o.iconName,r=o.inheritedAttributes,s=o.el;var a=this.mode||"md";var c=i?(i.includes("arrow")||i.includes("chevron"))&&n!==false:false;var l=n||c;return h(Host,Object.assign({role:"img",class:Object.assign(Object.assign((t={},t[a]=true,t),createColorClasses(this.color)),(e={},e["icon-".concat(this.size)]=!!this.size,e["flip-rtl"]=l,e["icon-rtl"]=l&&isRTL(s),e))},r),this.svgContent?h("div",{class:"icon-inner",innerHTML:this.svgContent}):h("div",{class:"icon-inner"}))};Object.defineProperty(t,"assetsDirs",{get:function(){return["svg"]},enumerable:false,configurable:true});Object.defineProperty(t.prototype,"el",{get:function(){return getElement(this)},enumerable:false,configurable:true});Object.defineProperty(t,"watchers",{get:function(){return{name:["loadIcon"],src:["loadIcon"],icon:["loadIcon"],ios:["loadIcon"],md:["loadIcon"]}},enumerable:false,configurable:true});return t}();var getIonMode=function(){return typeof document!=="undefined"&&document.documentElement.getAttribute("mode")||"md"};var createColorClasses=function(t){var e;return t?(e={"ion-color":true},e["ion-color-".concat(t)]=true,e):null};Icon.style=iconCss;export{Icon as ion_icon};