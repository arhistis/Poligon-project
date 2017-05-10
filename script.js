
$(document).ready(function(){
	var points = [];
	// points.push(new Point(30,40));
	// points.push(new Point(100,100));
	// points.push(new Point(200,100));
	// points.push(new Point(30,30));
	
	var rect;

	var x_axis = new Segment(new Point(parseInt($("#canvas").css("width"))/2,0), new Point(parseInt($("#canvas").css("width"))/2,parseInt($("#canvas").css("height"))));
	x_axis.draw(0, "pink");
	var y_axis = new Segment(new Point(0,parseInt($("#canvas").css("width"))/2), new Point(parseInt($("#canvas").css("width")),parseInt($("#canvas").css("height"))/2));
	y_axis.draw(0, "pink");

	var point = document.createElement("div");
	$(point).css({
		width: "5px",
		height: "5px",
		backgroundColor: "red",
		position: "absolute",
		display: "none",
		left: "-50px",
		borderRadius: "50%",
		zIndex: "2"
	});
	$("#canvas").append(point);

	var i_line = document.createElement("div");
	i_line.id = "i_line";
	$(i_line).css({
		width: "1px",
		height: "1px",
		backgroundColor: "green",
		display: "none",
		position: "absolute",
		borderRadius: "5px",
		zIndex: "2"
	});
	$("#canvas").append(i_line);

	var sgm = new Segment(new Point, new Point);

	var window_height = parseInt($("body").css("height"));

	$(canvas).mouseleave(function(event){

		$(point).css("display","none");
		$(i_line).css("display","none");
	});

	$(canvas).mouseenter(function(event){

		$(point).css("display","inherit");
	});

	$(canvas).mousemove(function(event){
		if(points.length > 2 && rect){


		window_height = parseInt($("body").css("height"));
		window_width = parseInt($("body").css("width"));

		coordX = event.pageX - $(canvas).offset().left;
    	coordY = parseInt($(canvas).css("height")) - event.pageY + $(canvas).offset().top ;

		sgm.P1.x = coordX;
		sgm.P1.y = coordY;
		sgm.P2.x = coordX;
		sgm.P2.y = rect.lowest-50;

		sgm.a = sgm.P1.y - sgm.P2.y;
		sgm.b = sgm.P2.x - sgm.P1.x;
		sgm.c = sgm.P1.x * sgm.P2.y - sgm.P2.x * sgm.P1.y;
		sgm.length = Math.sqrt( Math.pow(sgm.P2.x-sgm.P1.x, 2) + Math.pow(sgm.P2.y-sgm.P1.y, 2));

		$(i_line).css({
			height: sgm.length,
			left: sgm.P2.x,
			bottom: sgm.P2.y
		});

		console.log(rect.colision(sgm));

		if(rect.colision(sgm)%2==1)
			$("#informatii").text("Este in interior");
		else
			$("#informatii").text("NU este in interior");


		$(point).css({
			left: coordX - parseInt($(point).css("width"))/2,
			bottom: coordY - parseInt($(point).css("width"))/2
		});

	    $("span").text((coordX - parseInt($(canvas).css("width"))/2) + " , " + (coordY - parseInt($(canvas).css("height"))/2));

		}
	});

	$(document).on('keydown', function(e){
		var key = e.keyCode;
		if(key == 13)
			add_point();
			
	});

	function add_point(){
		var xinput = $("#coordX");
		var x = parseInt(xinput[0].value);
		var yinput = $("#coordY");
		var y = parseInt(yinput[0].value);
		if( x && y){
			var new_point = new Point(x + parseInt($(canvas).css("width"))/2,y + parseInt($(canvas).css("height"))/2);
			new_point.draw(5,"blue");
			points.push(new_point);
			console.log(x,y);
			console.log(points[points.length-1]);

			var paragraf = document.createElement("p");
			paragraf.innerHTML = "Point { " + x + " : " + y + " } ";
			$("#menu").append(paragraf);
		}
		xinput[0].value = "";
		yinput[0].value = "";
	}

	$("#create_poligon").click(function(){
		if(points.length > 2){
			$(point).css("display", "inherit");
			rect = new Rectangle(points);
			rect.draw(5,"green");
		}
	});

});