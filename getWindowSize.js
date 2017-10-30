/* getWindowSize

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
*/var getWindowSize=(function(){"use strict";var wxo=NaN,wyo=NaN;
//function chooser precheck may work, but could get stuck by premature initial test
function getWindowSize(W){var w=W||window,r=
w.innerHeight||w.innerWidth?{width:w.innerWidth,height:w.innerHeight}
:w.document.documentElement&&(w.document.documentElement.clientWidth||w.document.documentElement.clientHeight)?{width:w.document.documentElement.clientWidth,height:w.document.documentElement.clientHeight}
:w.document.body&&(w.document.body.clientWidth||w.document.body.clientHeight)?{width:w.document.body.clientWidth,height:w.document.body.clientHeight}
:{width:NaN,height:NaN};
r.outerWidth=r.width+wxo;
r.outerHeight=r.height+wyo;
return r;}
(getWindowSize.calibrate=function(w){var x,t=getWindowSize(w);
if(t.width&&t.height){
w.resizeTo(t.width,t.height);
x=getWindowSize();
w.resizeBy(wxo=t.width-x.width,wyo=t.height-x.height);
}else{wxo=wyo=NaN;}})(window);
if(typeof module==="object"&&module.exports)module.exports=getWindowSize;
return getWindowSize;
})();