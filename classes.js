class Point{
	constructor(x0,y0){
		this.x = x0;
		this.y = y0;
	}

	draw(radius,color){
		var point = document.createElement("div");
		$(point).css({
			width: radius,
			height: radius,
			backgroundColor: color,
			position: "absolute",
			borderRadius: "50%",
			left: this.x - radius/2,
			bottom: this.y - radius/2,
			zIndex: "2"
		});

		$("#canvas").append(point);
		return this;
	}

	distance(B){
		return Math.sqrt( Math.pow(B.x-this.x, 2) + Math.pow(B.y-this.y, 2));
	}
}

class Segment{
	constructor(p1,p2){
		this.P1 = p1;
		this.P2 = p2;
		this.length = Math.sqrt( Math.pow(this.P2.x-this.P1.x, 2) + Math.pow(this.P2.y-this.P1.y, 2));
		this.angle = Math.atan2(this.P2.y - this.P1.y, this.P2.x - this.P1.x) * 180 / Math.PI;
		this.a = p1.y - p2.y;
		this.b = p2.x - p1.x;
		this.c = p1.x * p2.y - p2.x * p1.y;
	}

	draw(stroke,color){
		var line = document.createElement("div");
		line.className = "line";
		$(line).css({
			width: this.length,
			height: 1,
			backgroundColor: color,
			position: "absolute",
			borderRadius: "5px",
			left: this.P1.x,
			bottom: this.P1.y,
			transform: "rotate(" + (360 - this.angle) + "deg)",
			transformOrigin: "1px 1px",
			zIndex: "1"
		});

		$("#canvas").append(line);

		this.P1.draw(stroke,"red");
		this.P2.draw(stroke,"red");
		return this;
	}

	distance(x0, y0){
		return Math.abs(this.a * x0 + this.b * y0 +this.c)/Math.sqrt(Math.pow(this.a,2)+Math.pow(this.b,2));
	}

	projection(x0,y0){
	    var x1=this.P1.x, y1=this.P1.y, x2=this.P2.x, y2=this.P2.y, x3=x0, y3=y0;
	    var px = x2-x1, py = y2-y1, dAB = px*px + py*py;
	    var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
	    var x = x1 + u * px, y = y1 + u * py;
	    var point = new Point(x,y);
	    return point;
	}

	colision(sgm){
		var delta = this.a * sgm.b - this.b * sgm.a;
		if(delta){
			var comun = new Point(-1*(this.c * sgm.b - this.b * sgm.c)/delta, -1*(this.a * sgm.c - this.c * sgm.a)/delta);
			if(comun == this.P2)
				return 0;
			if(Math.floor(this.P1.distance(comun) + this.P2.distance(comun)) == Math.floor(this.length) && 
				Math.floor(sgm.P1.distance(comun) + sgm.P2.distance(comun)) == Math.floor(sgm.length))
				if(comun.x == sgm.P2.x && comun.y == sgm.P2.y)
					return 0;
				else return 1;
			else
				return 0;
		}
		else{
			var d1 = this.a * sgm.b - this.b * sgm.a;
	        var d2 = this.a * sgm.c - this.c * sgm.a;
	        var d3 = this.b * sgm.c - this.c * sgm.b;
	        if(d1 * d2 + d2 * d3 + d3 * d3 != 0)
	            return 0;
	        else
	        {
	            if((this.P2.x < sgm.P1.x && this.P1.x < sgm.P1.x && 
	            	this.P2.x < sgm.P2.x && this.P1.x < sgm.P2.x ) || ( 
	            	this.P2.x > sgm.P1.x && this.P1.x > sgm.P1.x && 
	            	this.P2.x > sgm.P2.x && this.P1.x > sgm.P2.x ))
	                return 0;
	            else
	            	return 1;
	        }

		}
	}
}

class Rectangle{
	constructor(points){
		var min = 10000;
		var n = 1000;
		var f = -1000;
		this.lines = [];
		for(var i=0; i < points.length-1; i++){
			this.lines.push(new Segment(points[i],points[i+1]));
			if(this.lines[i].P1.x < min)
				min = this.lines[i].P1.x;
			if(this.lines[i].P1.x < min)
				min = this.lines[i].P2.x;
		}
		this.lines.push(new Segment(points[points.length-1],points[0]));

		for(var i=0; i<points.length; i++)
		{
			if(points[i].x < n)
				n = points[i].x;
			if(points[i].x > f)
				f = points[i].x;
		}
		this.lowest = min;
		this.nearest = n;
		this.furthest = f;
	}

	draw(stroke,color){
		for(var i=0; i<this.lines.length; i++)
			this.lines[i].draw(stroke,color);
	}

	colision(sgm){
		if(sgm.P1.y < this.lowest || sgm.P1.x <= this.nearest || sgm.P1.x >= this.furthest)
			return 0;
		else{
			var cnt = 0;
			for(var i=0; i < this.lines.length ; i++)
				cnt += sgm.colision(this.lines[i]);
			return cnt;
		}
	}

}






