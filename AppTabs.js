/*
requires window and Array.prototype.indexOf

In many cases, AppTabs.loadApp should be overridden with a custom app loader.

TODO:

New Tab:
disallow switch to parent node, as this causes infinite loop
update all views on change


start app in container:
menubar {width:100%}
block element app requests or div {width:100%,display:block/none})




app(launched from)
function to set up running or do something
.title
.icon
.blockTag // use tabs.launch(appid)


running:
function to update or take form data
.app points to above
.note[]
.block all have block element under titlebar for content
.tabContainer

block.left/top/height/width
block.tabs/apps={}
block.runApp(app id,string param) // grabs from other container if already running with same param




tabContainer
.app{id:(){id,title,icon}}
.running{id:{app^,note[],tab}}
tabContainer(parentNode)
.bar=[nodes] // (before tabs)
.tab(app id,blockTag)={running,content,focus(),}
.getSize()=[width,height,left,top]
.setSize(width,height,left,top)



Copyright (C) Quasic on GitHub
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
var AppTabs=(function(){"use strict";
var entero=typeof console==="object"&&console.entero||function(){return function(r){return r;}},x=entero(0,"AppTabs:init"),running={},container=[],note=[],ignoremsg={};
function retrue(){window.event.returnValue=false;return true;}
function removeAll(a,o){var
i=a.indexOf(o),
j=i+1,
c=1;
if(i<0)return;
while(j<a.length)if(a[j]===o){j++;c++;}else a[i++]=a[j++];
a.length-=c;
}
function Note(app,a,dismisslink,priority,onclick){
this.ts=new Date;
this.app=app;
this.a=a;
this.dismisslink=dismisslink;
this.priority=priority||'';
this.onclick=onclick;
app.note[app.note.length]=this
if(priority!=="Unimportant")note[note.length]=this;
if(priority==="Important")app.note.Important=note.Important=true;
this.app.countNotes();
}
Note.prototype.inspect=function(depth,Opt,opt){return"[Note "+this.priority+" "+this.ts+" "+this.app.id+"]";};
Note.prototype.dismiss=function(){
removeAll(this.app.note,this);
if(this.priority!=="Unimportant")removeAll(note,this);
if(note.Important&&this.app.note.Important&&this.priority==="Important"){
this.app.note.Important=0;
for(var i=0;i<this.app.note.length;i++)if(this.app.note[i].priority==="Important")this.app.note.Important=1;
if(!this.app.note.Important){
note.Important=0;
for(var i=0;i<note.length;i++)if(note[i].priority==="Important")note.Important=1;
}
}
this.app.countNotes();
};
Note.prototype.toTag=function(tag){var
x=entero(this,"toTag",arguments,{depth:1}),
n=this,
e=document.createElement(tag),
i,
t;
e.title=this.ts;
if(this.onclick)e.onclick=this.onclick;
e.className="appNote"+this.priority;
for(i=0;i<n.a.length;i++)if(typeof n.a[i]==="object"){
t=document.createElement(n.a[i].tag||"u");
t.className=n.a[i].className||"button";
if(n.a[i].html)t.innerHTML=n.a[i].html;else t.appendChild(document.createTextNode(t.text||" [Button]"));
t.onclick=n.a[i].onclick||function(){alert("This button does nothing, yet!");};
e.appendChild(t);
}else e.appendChild(document.createTextNode(n.a[i]));
if(n.dismisslink){
t=document.createElement("small");
t.className="button";
t.appendChild(document.createTextNode(" [Dismiss]"));
t.onclick=function(){n.dismiss();e.parentNode.removeChild(e);return retrue();};
e.appendChild(t);
}
return x(e);
};
App.prototype.notify=function(a,dismisslink,priority,onclick){return entero(this,"notify",arguments)(new Note(this,typeof a==="object"?a:[a],dismisslink,priority,onclick));};
App.prototype.countNotes=function(){
this.tabNotes.innerHTML=(this.note.length||"")+(this.note.Important?'!':'');
for(i=0;i<container.length;i++)container[i].noteCounter.innerHTML=(note.length||'')+(note.Important?'!':'');
};
App.prototype.clearNotes=function(){
while(this.note.length)this.note[this.note.length-1].dismiss();
this.countNotes();
};
App.prototype.toString=
App.prototype.inspect=function(depth,Opt,opt){return"[App "+this.id+"]";};
function App(container,id){var
x=entero(0,"App",arguments),
i=id.indexOf('?');
this.container=container;
this.note=[];
this.id=id;
if(i<0)this.appid=id;else{
this.appid=id.substring(0,i);
this.param=id.substring(i+1);
}
this.app=AppTabs.app[this.appid];
if(!this.app)if(this.app=AppTabs.loadApp(this.appid))AppTabs.app[this.appid]=this.app;
try{
if(this.app(this)||this.content)running[id]=this;
}catch(e){console.trace(e);}
x();
}
//.app is function that sets up app, possibly using param and other state info, using the App object passed to it, properties: title, icon, possibly subfunctions/properties for internal use, though might be better to use vars instead.
App.prototype.exit=function(){var
x=entero(this,"exit",arguments),
i;
if(this.onexit)this.onexit();
if(this.tab)this.tab.parentNode.removeChild(this.tab);
if(this.content)this.content.parentNode.removeChild(this.content);
if(running[this.id]){running[this.id]=undefined;delete running[this.id];}
if(this.container.front===this)this.container.front=null;
this.container.focus();
x();}
App.prototype.makeTab=function(tag){var
x=entero(this,"makeTab",arguments),
app=this;
if(app.tab)throw x(new Error("App already has a tab, programmer needs to split into another app."));
app.tab=document.createElement("span");
app.tab.className="appTab";
app.tab.onclick=function(){app.container.focus(app);};
app.tab.appendChild(document.createTextNode((app.app.title||app.appid)+(app.subtitle||app.param?' - '/*\u2014=MDASH*/+(app.subtitle||app.param):'')));
app.tab.appendChild(app.tabNotes=document.createElement("sup"));
app.content=document.createElement(tag||"div");
app.content.className="appContent";
if(tag.toLowerCase()==="form")app.content.onsubmit=retrue;
app.container.focus(app);
x();
};
function AppTabs(parentNode){var
x=entero(0,"AppTabs",arguments),
tc=this,
b=tc.bar=document.createElement("div"),
c=tc.contentContainer=document.createElement("div");
parentNode.innerHTML="";
tc.bar.className="appTabs";
tc.bar.appendChild(document.createElement("u"));
tc.bar.firstChild.className="appTab appNewTab";
tc.bar.firstChild.appendChild(document.createTextNode("New Tab"));
tc.bar.firstChild.appendChild(this.noteCounter=document.createElement("sup"));
tc.bar.firstChild.onclick=function(){tc.run("New Tab");};
parentNode.appendChild(tc.bar);
tc.contentContainer.className="appContainer";
parentNode.appendChild(tc.contentContainer);
tc.parentNode=parentNode;
tc.mark=document.createTextNode("*");
tc.tabs={};
container[this.id=container.length]=tc;
tc.run("New Tab");
parentNode.onresize=function(){
if(c.style.position==="absolute"){
//?{look up in Let's Play!}
//c.style.top=?{b.clientHeight()}+"px";
}
if(this.front&&this.front.onresize)this.front.onresize();
};
x();
}
AppTabs.prototype.toString=
AppTabs.prototype.inspect=function(depth,Opt,opt){return"[AppTabs "+this.id+"]";};
AppTabs.fromId=function(id){return container[id];};
AppTabs.exitAll=function(){var
x=entero(0,"AppTabs.exitAll",arguments),
i;
//exit all running apps, leaving only new tab button
for(i in running)if(running[i].exit)running[i].exit();
note.length=0;
x();
};
AppTabs.prototype.destroy=function(){var
x=entero(this,"destroy",arguments),
a=[],
i;
this.parentNode.removeChild(this.bar);
this.parentNode.removeChild(this.contentContainer);
for(i=0;i<container.length;i++)if(container[i]!==this)a.push(container[i]);
container=a;
x();
};
AppTabs.prototype.run=function(appid){var
x=entero(this,"run",arguments),
r=running[appid];
if(!r)return x(new App(this,appid));
this.focus(r);
return x(r);};
AppTabs.prototype.resize=function(o){var
wh=this.widthHeight=o||this.widthHeight||null,
ct=this.bar.offsetHeight,
//what about borders?
cy=(wh&&wh.height)-ct;
this.contentContainer.style.top=ct+"px";
if(wh){
this.contentContainer.style.height=cy+"px";
if(this.front&&this.front.onresize)this.front.onresize({width:wh.width,height:cy,top:ct});
}};
AppTabs.prototype.isIn=function(node){var
x=entero(this,"isIn",arguments),
i,
b=this.contentContainer.ownerDocument.body;
for(i=this.contentContainer;i!=b;i=i.parentNode)if(i==node)return x(true);
return x(false);
};
AppTabs.prototype.focus=function(app){var
x=entero(this,"focus",arguments),
i,
from=app&&app.container||this;
if(!app)if(!this.front||!running[this.front.id]){for(i in this.tabs)return x(this.focus(this.tabs[i]));return x();}else app=this.front;
if(!app.content)return x();
if(app.content.parentNode!==this.contentContainer){
if(this.isIn(app.content))throw new Error("Can't put this app into itself");
this.contentContainer.appendChild(app.content);
}
if(app.tab.parentNode!==this.bar)this.bar.appendChild(app.tab);
if(from!==this){
app.content.style.display="none";
from.tabs[app.id]=undefined;delete from.tabs[app.id];
from.focus();
if(from.front===app)from.run("New Tab");
this.tabs[app.id]=app;
app.container=this;
}
if(this.front!==app){if(this.front){this.front.content.style.display="none";this.front.tab.className="appTab";}app.tab.className="appTab appFocused";app.tab.appendChild(this.mark);this.front=app;}
app.content.style.display="block";
if(app.onfocus)app.onfocus();
this.resize();
x();
};
App.prototype.msg=function(toAppid,msg){var
x=entero(this,"msg",arguments),
m={ts:new Date,fromAppid:this.id,toAppid:toAppid,msg:msg},
t=running[m.toAppid];
if(!t)if(ignoremsg[m.toAppid])ignoremsg[m.toAppid].push(m);else if(confirm('App "'+m.toAppid+'" has received a message. Should I start it for you?'))t=this.run(m.toAppid);else{ignoremsg[m.toAppid]=[m];return x(false);}
if(t.onMsg)throw new Error('App "'+m.toAppid+'" has no onMsg event.');
t.onMsg(m);
return x(true);
};
AppTabs.appMenu={};
AppTabs.removeAllFrom=removeAll;
AppTabs.loadApp=function(appid){try{return require("apps/"+appid+".js");}catch(e){alert('Error: App "'+appid+'" was not found.');throw e;}};
AppTabs.app={"New Tab":function(app){var
x=entero(0,'AppTabs.app["New Tab"]',arguments);
if(!app.param){app.container.run(app.id+"?"+arguments.callee.n++);return x();}
app.makeTab("div");
app.onfocus=function(){var
x=entero(app,"onfocus",arguments),
a=[],b,h={},i,
c=app.container,
l=document.createElement("ul"),
t=app.content;
t.className+=" appScroll";
t.innerHTML="Your running apps:";
t.appendChild(l);
for(i in running)a.push(running[i]);
a.sort(function(b,a){return a.note.length-b.note.length;});
for(i=0;i<a.length;i++){
b=document.createElement("li");
b.app=a[i];
b.o=b;
b.innerHTML=h[a[i].id]=(a[i].app.title||a[i].appid)+(a[i].subtitle||a[i].param?' - '/*\u2014=MDASH*/+(a[i].subtitle||a[i].param):'')+(a[i].note.length?'<sup>'+a[i].note.length+'</sup>':'')+(a[i].container.front===a[i]?'*':'');
if(c.isIn(a[i].content)){
b.appendChild(document.createTextNode(" {PARENT} "));
}else{
b.className="button";
b.onclick=function(){var x=entero(this.o,"onclick",arguments,{depth:1});c.focus(this.app);if(this.app!==app)app.exit();return x(retrue());};
}
b.appendChild(document.createTextNode(' ('));
b.appendChild(document.createElement('u'));
b.lastChild.className="button";
b.lastChild.onclick=function(){this.parentNode.app.exit();return retrue();};
b.lastChild.appendChild(document.createTextNode("close"));
b.appendChild(document.createTextNode(')'));
if(a[i].note.length){
var ol=document.createElement("ol");
for(var j=0;j<a[i].note.length;j++){
ol.appendChild(a[i].note[j].toTag("li"));}
b.appendChild(ol);
}
l.appendChild(b);
};
a=[];
t.appendChild(document.createTextNode("Your other apps:"));
l=document.createElement("ul");
for(i in AppTabs.app)if(!h[i]&&AppTabs.app.hasOwnProperty(i))h[a[a.length]=i]=AppTabs.app[i].title||i;
for(i in AppTabs.appMenu)if(!h[i]&&AppTabs.appMenu.hasOwnProperty(i))h[a[a.length]=i]=AppTabs.appMenu[i];
for(i=0;i<a.length;i++){
b=document.createElement("li");
b.className="button";
b.onclick=function(){var
x=entero(arguments.callee.o,"onclick",arguments,{depth:1}),
a=c.run(arguments.callee.id);
//console.log(a,{depth:0});
if(a.tab){
//c.bar.removeChild(a.tab);
c.bar.insertBefore(a.tab,app.tab);
}
if(running.hasOwnProperty(arguments.callee.id)&&arguments.callee.id!=="New Tab")app.exit();
x();};
b.onclick.id=a[i];
b.onclick.o=b;
b.innerHTML=h[a[i]];
l.appendChild(b);
};
/*t.appendChild(l);
i=document.createElement("input");
i.type="text";
i.onkeydown=function(){if(i.ownerDocument.parentWindow.event.keyCode===13)b.onclick();};
t.appendChild(i);
b=document.crateElement("input");
b.type="button";
b.value="Run App";
b.onclick=function(){app.container.run(i.value);};
t.appendChild(b);*/
x();}
setTimeout(app.onfocus,1);
return x(1);
}/*,AppStore:function(app){
//app.makeTab("div");
//each selected app is highlighted, click to toggle between black=unlisted/blue=listed/red=run at startup
}*/};
AppTabs.app["New Tab"].n=0;
if(typeof module!=="undefined"&&module.exports)module.exports=AppTabs;
return x(AppTabs);})();
