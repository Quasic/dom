/* similar to setInterval

Usage:
//First, create an instance:
var timer=new autoInterval(minTimeout, maxTimeout, startingTimeout, initialLaziness);
//initialLaziness can be negative if startingTimeout>minTimeout, in case you want to ease into initial polling, for some reason. Full throttle will be used as soon as needed, regardless.
//Now, add a polling function:
timer.poll(callback);
//Example callback function:
function callback(adj,index){
//adj is false if the previous polled callbacks (if any) think the timer can be more lazy
//index is -1 on the first call, and from then on, is its index in this.f
//return true if action is happening, so the timer can run at full throttle (minTimeout)
}
//The callback function has access to the current state of the timer using this, as it is called as if it were a method of the timer.

// Annonymous usage:
new autoInterval().poll(controllingFunction)
//if timeouts are not garbage collected

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
function autoInterval(min,max,delay,delayer){
this.min=min;
this.max=max;
this.delay=delay||min;
this.delayer=delayer||0;
this.fa=[];
}
autoInterval.prototype.poll=function(callback){"use strict";var
e=typeof console==="object"&&console.entero,
o=this,
x=e&&console.entero(o,"poll",arguments)||function(r){return r;},
p=e?function(){console.entero(o,"poll::timer",arguments)(o.poll());}:function(){o.poll();},
i,
r=false;
if(callback)r=callback.call(o,r,-1);//make sure function works
clearTimeout(o.timer);
for(i=0;i<o.fa.length;i++)r|=o.fa[i].call(o,r,i);
if(callback)o.fa.push(callback);//already run above
if(r)o.delay=o.min+(o.delayer=0);
else if(o.delayer<0){
	if(o.delay>o.min)o.delay=Math.max(o.min,o.delay+ ++o.delayer);
	else o.min+(o.delayer=0);
	}
else if(o.delay<o.max)o.delay=Math.min(o.max,o.delay+ ++o.delayer);
if(o.fa.length)o.timer=setTimeout(p,o.delay);
return x(r);};
autoInterval.prototype.stop=function(){clearTimeout(this.timer);};
if(typeof module==="object"&&module.exports)module.exports=autoInterval;
