/* Cookie object

CookieCutter(key,path,expires) returns a Cookie object
CookieCutter.getAll() returns list of Cookie objects
CookieCutter.removeAll() clears the cookies for this and higher paths (may add a feature to check for #path settings...)

Cookie object:
.key
.path
.expires //passed to new Date(expires), or "+[number]" for time since last set, or "session" for a session cookie
.expireDate //last known Date object used to set cookie
.get(raw) // returns unescaped string if raw, otherwise may be array/object of strings or string
.set(object or string) // using an object allows path and expiration date to be stored in the cookie data
.remove()

Special characters used for storing objects:
=&#
If an unescaped =

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
var CookieCutter=(function(){"use strict";var
e=window.encodeURIComponent||window.escape,
u=window.decodeURIComponent||window.unescape,
O={},
C={},
Cookie=function(key,path,expires){
this.path=path;
this.expires=Math.min(Math.abs(expires),31622400000)||"session";
C[this.key=e(key)]=this;};
Cookie.prototype.set=function(value){
var D,v=arguments.length?e(value):this.get(1);
if(typeof value==="object"){
	v=[];
	for(i in value)if(!D[i]&&value.hasOwnProperty(i))v.push(e(i)+"="+e(value[i]));
	if(this.expires)v.push("#expires="+e(this.expires));
	if(this.path)v.push("#path="+e(this.path))
	v=v.join("&");
}
if(this.expires.charAt(0)==="+")D=new Date(+new Date+this.expires);
else if(isNaN(D=new Date(this.expires)))D=0;
this.expireDate=D;
document.cookie=this.key+"="+v+(this.path?";path="+this.path:"")+(D?";expires="+D.toUTCString():"");};
Cookie.prototype.remove=function(){this.expireDate=new Date(9);this.rawSet("");delete C[this.key];};
Cookie.prototype.get=function(raw){
var m=document.cookie.match(new RegExp("(^|; *)"+e(key)+"=([^;]*)(;|$)"));
if(!m)return m;
if(raw)return m[2];
if(m[2].indexOf("=")<0)return u(m[2]);
m=[[],m[2].split("&")];
for(var i=0,t;i<m[1].length;i++){
t=m[1].indexOf("=");
(t<0?m[0][m[0].length]:m[1].charAt(0)==="#"?this[m[1].substring(1,t)]:m[0][u(m[1].substring(0,t))])=u(m[1].substring(t+1));
}
return m[0];
};
O=function(key,path,expires){return C[key]||new Cookie(key,path,expires);};
O.getAll=function(){var a=document.cookie.split(";"),o,i,j;for(i=0;i<a.length;i++){
j=u(a[i].substring(0,a[i].indexOf("=")||a[i].length));
o[j]=this.cookie(j);
}
return o;
};
O.removeAll=function(){var o=this.getAll();for(i in o)o[i].remove();};
if(typeof module==="object"&&module.exports)module.exports=O;
return O;})();
