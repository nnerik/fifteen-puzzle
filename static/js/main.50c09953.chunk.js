(this["webpackJsonpfifteen-puzzle"]=this["webpackJsonpfifteen-puzzle"]||[]).push([[0],[,,,,,,,,,function(e,t,i){e.exports=i(17)},,,,,function(e,t,i){},function(e,t,i){},function(e,t,i){},function(e,t,i){"use strict";i.r(t);var a=i(0),n=i.n(a),o=i(3),r=i.n(o),l=(i(14),i(4)),s=i(5),h=i(7),c=i(6),d=i(8),m=(i(15),i(1)),v=(i(16),function(e){return 0===e.index?null:n.a.createElement("svg",{id:e.index,className:e.solved?"Solved":"Unsolved",x:(e.x-1)*e.size,y:(e.y-1)*e.size,height:3*e.size,width:3*e.size,viewBox:"0 0 300 300"},n.a.createElement("g",{className:e.moveable?e.x<e.x0?"Clickable Left":e.x>e.x0?"Clickable Right":e.y<e.y0?"Clickable Up":e.y>e.y0?"Clickable Down":"Clickable":e.x<e.x0?"Left":e.x>e.x0?"Right":e.y<e.y0?"Up":e.y>e.y0?"Down":"Still",onClick:e.moveable?function(){return e.handler(e.index)}:void 0},n.a.createElement("rect",{className:"Tile",style:{strokeWidth:2},x:102,y:102,rx:3,ry:3,width:96,height:96}),n.a.createElement("text",{className:"TileText",textAnchor:"middle",alignmentBaseline:"central",x:150,y:150},e.index)))}),u=function(e){var t=e.frameWidth;return n.a.createElement("svg",{className:"Board",viewBox:"0 0 ".concat(e.tileSize*e.width+2*t," ").concat(e.tileSize*e.height+2*t)},n.a.createElement("rect",{className:"Frame",style:{strokeWidth:t},x:t/2,y:t/2,rx:3,ry:3,width:e.tileSize*e.width+t,height:e.tileSize*e.height+t}),n.a.createElement("svg",{x:t,y:t,width:e.tileSize*e.width,height:e.tileSize*e.height},e.board.map((function(t,i){return n.a.createElement(v,{size:e.tileSize,x:t%e.width,y:t/e.width|0,x0:e.prevBoard[i]%e.width,y0:e.prevBoard[i]/e.width|0,index:i,solved:e.solved,moveable:!e.solved&&Object(m.b)(e.board,e.width,i),handler:e.handler})}))))},b=function(e){function t(){var e,i;Object(l.a)(this,t);for(var a=arguments.length,n=new Array(a),o=0;o<a;o++)n[o]=arguments[o];return(i=Object(h.a)(this,(e=Object(c.a)(t)).call.apply(e,[this].concat(n)))).initWidth=3,i.initHeight=3,i.initBoard=Object(m.f)(i.initWidth,i.initHeight),i.state={width:i.initWidth,height:i.initHeight,board:i.initBoard,prevBoard:i.initBoard,moves:0},i.move=function(e){var t=Object(m.d)(i.state.board,e);i.setState({prevBoard:i.state.board,board:t,moves:i.state.moves+1})},i.shuffle=function(e){var t=Object(m.e)(i.state.width,i.state.height);i.setState({board:t,prevBoard:t,moves:0})},i.solve=function(){Object(m.a)(i.state.board,i.state.width).forEach((function(e,t){setTimeout((function(){i.move(e)}),150*t)}))},i}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=Object(m.c)(this.state.board,this.state.width);return n.a.createElement("div",{className:"App"},n.a.createElement("header",{className:"App-header"},n.a.createElement("h1",null,"Fifteen"),n.a.createElement(u,{tileSize:100,frameWidth:4,moves:this.moves,width:this.state.width,height:this.state.height,board:this.state.board,prevBoard:this.state.prevBoard,handler:this.move,solved:e}),n.a.createElement("p",null,"Moves: ",0===this.state.moves&&e?"":this.state.moves),n.a.createElement("p",null,n.a.createElement("button",{className:"App-button",onClick:this.shuffle},"Shuffle"),n.a.createElement("button",{className:"App-button",onClick:this.solve},"Solve"))))}}]),t}(n.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(n.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}],[[9,1,2]]]);
//# sourceMappingURL=main.50c09953.chunk.js.map