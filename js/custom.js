
Raphael.fn.addcon = function(obj1, obj2){
  connections.push(r.connection(obj1, obj2));
}

Raphael.fn.addobj=function(attr){

  if(!attr.fill){attr.fill="#ffffff";}

  if(!attr.stroke){attr.stroke="#000000";}

  if(!attr.opacity){attr.opacity=1;}

  if(attr.type=="ellipse"){

    var is=inputs.length;

    inputs.push(r.ellipse(attr.x+attr.w/2, attr.y+attr.h/2, attr.w/2, attr.h/2));

    inputs[is].data("name", attr.name);

    inputs[is].data("variable", attr.variable);

    inputs[is].data("label", attr.label);

    inputs[is].data("nominal", attr.nominal);

    inputs[is].data("nom_ds", Number(attr.nom_ds));

    inputs[is].data("random", attr.random);

    inputs[is].data("rand_ds", Number(attr.rand_ds));

    inputs[is].data("sys_src", attr.sys_src);

    inputs[is].attr({fill: attr.fill, stroke: attr.stroke, "fill-opacity": attr.opacity, cursor: "move"});

    inputs[is].drag(r.onmove, r.onstart, r.onend);

    inputs[is].hover(r.hoverIn, r.hoverOut);

    input_labels.push(r.text(attr.x+attr.w/2, attr.y+attr.h/2, attr.label));

    input_labels[is].data("variable", attr.variable);

    input_labels[is].hover(r.hoverIn, r.hoverOut);

    input_labels[is].dblclick(r.editobj);

    input_labels[is].attr({cursor: "default"});

    input_labels[is].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(attr.label);

  } else if(attr.type=="rect"){

    var cs=components.length;

    components.push(r.rect(attr.x, attr.y, attr.w, attr.h));

    components[cs].data("name", attr.name);

    components[cs].data("variable", attr.variable);

    components[cs].data("label", attr.label);

    components[cs].data("fun", attr.fun);

    components[cs].attr({fill: attr.fill, stroke: attr.stroke, "fill-opacity": attr.opacity, cursor: "move"});

    components[cs].drag(r.onmove, r.onstart, r.onend);

    components[cs].hover(r.hoverIn, r.hoverOut);

    component_labels.push(r.text(attr.x+attr.w/2, attr.y+attr.h/2, attr.label));

    component_labels[cs].data("variable", attr.variable);

    component_labels[cs].hover(r.hoverIn, r.hoverOut);

    component_labels[cs].dblclick(r.editobj);

    component_labels[cs].attr({cursor: "default"});

    component_labels[cs].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(attr.label);
  }
}

Raphael.fn.connection = function (obj1, obj2) {
    // Check if obj1 and line, from, and to attribute
    if (obj1.line && obj1.from && obj1.to) {
        // Set line to obj1
        line = obj1;
        // Set obj1 to line from attribute
        obj1 = line.from;
        // Set obj2 to line to attribute
        obj2 = line.to;
        // Set arr to line arr attribute
        arr = line.arr;
    }
    // Get bounding box of object
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [], line;
    // Figure out where the arrow should point to (North, East, South, or West
    // of object)
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3),
        x1 = x1.toFixed(3), y1 = y1.toFixed(3);
        x4 = x4.toFixed(3), y4 = y4.toFixed(3);
    var ax1, ay1, ax2, ay2, ax3, ay3;
    if(res[1]==4){
      ax1=-3; ay1=-7; ax2=6; ay2=0;
    } else if (res[1]==5){
      ax1=3; ay1=7; ax2=-6; ay2=0;
    } else if (res[1]==6){
      ax1=-7; ay1=3; ax2=0; ay2=-6;
    } else {
      ax1=7; ay1=-3; ax2=0; ay2=6;
    }
    // Define the path of the arrow
    var path = ["M", x1, y1, "C", x2, y2, x3, y3, x4, y4].join(",");
    // Define the arrow head path
    var arr_path = ["M", x4, y4, "l", ax1, ay1, "l", ax2, ay2, "z"].join(",");
    // Set the line, and arrow attribute
    if (line && line.line) {
        line.line.attr({path: path});
        arr.attr({path: arr_path});
    } else {
        return {
            line: this.path(path).attr({stroke: "#000000"}),
            from: obj1,
            to: obj2,
            arr: this.path(arr_path).attr({stroke: "#000000", fill: "#000000"})
        };
    }
}

Raphael.fn.editobj = function(){

  var li=varID(inputs, this.data("variable"));

  if(li!==false){

    inp_edit=li;

    var name=inputs[li].data("name");

    var variable=inputs[li].data("variable");

    var label=inputs[li].data("label");

    var nominal=inputs[li].data("nominal");

    var nom_ds=inputs[li].data("nom_ds");

    var random=inputs[li].data("random");

    var rand_ds=inputs[li].data("rand_ds");

    var sys_src=inputs[li].data("sys_src");

    edit_inp_dialog.dialog("open");

    $("#edit_inp_name").val(name);

    $("#edit_inp_variable").val(variable);

    $("#edit_inp_label").val(label);

    $("#edit_inp_nominal").val(nominal);

    ds_nom=Number(nom_ds);

    $("#edit_inp_random").val(random);

    ds_rand=Number(rand_ds);

    src_sys=sys_src;

  } else{

    li=varID(components, this.data("variable"));

    comp_edit=li;

    var name=components[li].data("name");

    var variable=components[li].data("variable");

    var label=components[li].data("label");

    var fun=components[li].data("fun");

    edit_comp_dialog.dialog("open");

    $("#edit_comp_name").val(name);

    $("#edit_comp_variable").val(variable);

    $("#edit_comp_label").val(label);

    $("#edit_comp_fun").val(fun);
  }
}

Raphael.fn.hoverIn = function(){

  var tiptxt, i1, i2, id, nc=ns_nc().nc, ns=inputs.length;

  if(this.type!='text'){

    tiptxt="<table><tr><td>Name:</td><td>"+this.data("name")+"</td></tr>";
    tiptxt+="<tr><td>Variable:</td><td>"+this.data("variable")+"</td></tr>";
    tiptxt+="<tr><td>Label:</td><td>"+this.data("label")+"</td></tr>";

    if (this.type=="ellipse"){
      id=varID(inputs, this.data("variable"));

      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(Number(this.data("nominal")))+"</td></tr>";
      tiptxt+="<tr><td>Random:</td><td>"+engFormat(Number(this.data("random")))+"</td></tr>";

      if(flags.cor){

        ncs=nc.length;
        for(i1=0; i1<ncs; i1++){
          if(nc[i1][id]!=0){
            for(i2=0; i2<ns; i2++){
              if(nc[i1][i2]!=0){
                inputs[i2].attr({stroke:"#002B80", fill:"#CCDDFF"});
              }
            }
          }
        }
      }

    } else if (this.type=="rect"){

      tiptxt+="<tr><td>Function:</td><td>"+this.data("fun")+"</td></tr>";
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(this.data("nominal"))+"</td></tr>";

      if(flags.U){

        id=varID(components, this.data("variable"));
        tiptxt+="<tr><td>Uncertainty:</td><td>"+engFormat(U[id])+"</td></tr>";
        tiptxt+="<tr><td>% Uncertainty:</td><td>"+(100*U[id]/Math.abs(Number(this.data("nominal")))).toFixed(2)+"%</td></tr>";
      }
    }

    tiptxt+="</table>";

    if(flags.info){

      $("#tip").css("display", "inline");
      $("#tip").css("left", event.clientX+20).css("top", event.clientY+20);
      $("#tip").append(tiptxt);
    }

    this.attr({stroke:"#999900", fill:"#FFFFE5"});

    if(flags.before){

      before_obj(this.data("variable"));
    }

    if(flags.after){

      after_obj(this.data("variable"));
    }

  } else {

    id=varID(inputs, this.data("variable"));

    if(id!==false){

      tiptxt="<table><tr><td>Name:</td><td>"+inputs[id].data("name")+"</td></tr>";
      tiptxt+="<tr><td>Variable:</td><td>"+inputs[id].data("variable")+"</td></tr>";
      tiptxt+="<tr><td>Label:</td><td>"+inputs[id].data("label")+"</td></tr>";
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(Number(inputs[id].data("nominal")))+"</td></tr>";
      tiptxt+="<tr><td>Random:</td><td>"+engFormat(Number(inputs[id].data("random")))+"</td></tr>";
      inputs[id].attr({stroke:"#999900", fill:"#FFFFE5"});
      if(flags.cor){
        ncs=nc.length;
        for(i1=0; i1<ncs; i1++){
          if(nc[i1][id]!=0){
            for(i2=0; i2<ns; i2++){
              if(nc[i1][i2]!=0 && i2!=id){
                inputs[i2].attr({stroke:"#002B80", fill:"#CCDDFF"});
              }
            }
          }
        }
      }

    } else {

      id=varID(components, this.data("variable"));

      tiptxt="<table><tr><td>Name:</td><td>"+components[id].data("name")+"</td></tr>";
      tiptxt+="<tr><td>Variable:</td><td>"+components[id].data("variable")+"</td></tr>";
      tiptxt+="<tr><td>Label:</td><td>"+components[id].data("label")+"</td></tr>";
      tiptxt+="<tr><td>Function:</td><td>"+components[id].data("fun")+"</td></tr>";
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(components[id].data("nominal"))+"</td></tr>";
      if(flags.U){
        tiptxt+="<tr><td>Uncertainty:</td><td>"+engFormat(U[id])+"</td></tr>";
        tiptxt+="<tr><td>% Uncertainty:</td><td>"+(100*U[id]/Math.abs(Number(components[id].data("nominal")))).toFixed(2)+"%</td></tr>";
      }
      components[id].attr({stroke:"#999900", fill:"#FFFFE5"});
    }
    tiptxt+="</table>";

    if(flags.info){

      $("#tip").css("display", "inline");
      $("#tip").css("left", event.clientX+20).css("top", event.clientY+20);
      $("#tip").append(tiptxt);
    }

    if(flags.before){

      before_obj(this.data("variable"));
    }

    if(flags.after){

      after_obj(this.data("variable"));
    }
  }
}

Raphael.fn.hoverOut = function(){

  if(this.type!='text'){

    this.attr({stroke:"#000000", fill:"#ffffff"});

  } else {

    var li=varID(inputs, this.data("variable"));
    if(li!==false){
      inputs[li].attr({stroke:"#000000", fill:"#ffffff"});
    } else {
      li=varID(components, this.data("variable"));
      components[li].attr({stroke:"#000000", fill:"#ffffff"});
    }
  }

  reset_obj_color();

  $("#tip").empty();

  $("#tip").css("display", "none");
}

Raphael.fn.onend = function () {

  var hw=$("#holder").width(), hh=$("#holder").height(), obb=this.getBBox();
  var att, ox, oy, li;

  if (this.type=="ellipse"){

    li=varID(inputs,this.data("variable"));

    ox=this.attr("cx");
    oy=this.attr("cy");

    att={cx: ox, cy: oy};

    input_labels[li].attr({x: att.cx, y: att.cy});
    input_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(this.data("label"));
    input_labels[li].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");

  } else if (this.type == "rect"){

    li=varID(components, this.data("variable"));

    ox=this.attr("x");
    oy=this.attr("y");

    att={x: ox, y: oy};

    component_labels[li].attr({x: att.x+this.ow/2, y: att.y+this.oh/2});
    component_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(this.data("label"));
    component_labels[li].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");
  }

  this.attr(att);

  for (i = connections.length; i--;) {

    r.connection(connections[i]);
  }
}

Raphael.fn.onmove = function (dx, dy) {

  var att, i, li;

  if (this.type=="ellipse") {

    li=varID(inputs,this.data("variable"));

    att={cx: this.ox + (dx)/zoom, cy: this.oy + (dy)/zoom};

    input_labels[li].attr({x: this.ox + (dx)/zoom, y: this.oy + (dy)/zoom});
    input_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(this.data("label"));
    input_labels[li].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");

  } else if (this.type=="rect"){

    li=varID(components,this.data("variable"));

    att={x: this.ox + (dx)/zoom, y: this.oy + (dy)/zoom};

    component_labels[li].attr({x: this.ox+this.ow/2 + (dx)/zoom, y: this.oy+this.oh/2 + (dy)/zoom});
    component_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(this.data("label"));
    component_labels[li].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");
  }

  this.attr(att);

  for (i = connections.length; i--;) {

    r.connection(connections[i]);
  }

  $("#tip").css("left", event.clientX+20).css("top", event.clientY+20);

  //r.safari();
}

Raphael.fn.onstart = function () {

  if (this.type == "rect"){

    this.ox=this.attr("x");
    this.oy=this.attr("y");

  } else {

    this.ox=this.attr("cx");
    this.oy=this.attr("cy");
  }

  this.ow=this.getBBox().width;
  this.oh=this.getBBox().height;
}





function build_ds_dialog(){
  var i, dsi, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  dsi=datasets.length;
  $("#ds_dialog").append("<form></form>");
  $("#ds_dialog form").append("<input id='add_ds' name='add_ds' type='button' value='Add Dataset'>");
  $("#ds_dialog form").append("<table></table>");
  $("#ds_dialog form table").append("<tbody></tbody>");
  $("#ds_dialog form table tbody").append("<tr></tr>");
  if(dsi==0){
    $("#ds_dialog form table tbody tr:last-child").append("No datasets have been added yet. Please add a dataset.");
  } else {
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Number</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Mean</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>StDev</th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
    $("#ds_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
    for(i=0; i<dsi; i++){
      var n, mean, stdev;
      n=num_samples(datasets[i].values);
      mean=mu(datasets[i].values);
      stdev=sig(datasets[i].values, mean);
      $("#ds_dialog form table tbody").append("<tr></tr>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+datasets[i].name+"</td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+n+"</td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(mean)+"</td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(stdev)+"</td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'><a href='' id='edit_ds_"+i+"''>Edit</a></td>");
      $("#ds_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'><a href='' id='del_ds_"+i+"'>Delete</a></td>");
      $("#edit_ds_"+i).click(function(){
        ds_edit=Number($(this).attr('id').slice(-1));
        edit_ds_dialog.dialog("open");
        $("#edit_ds_data").click(function(){
          $("body").append("<input id='file_open' type='file' accept='.csv, .txt' style='display:none;'>");
          $("#file_open").trigger('click');
          document.getElementById('file_open').addEventListener('change', function(event){
            var files=event.target.files;
            var file=files[0];
            var reader=new FileReader();
            reader.readAsText(file);
            reader.onload=function(){
              data_str=reader.result;
              var data_arr=ds_str_2_arr(data_str);
              var num=num_samples(data_arr);
              var mean=mu(data_arr);
              var stdev=sig(data_arr, mean);
              if(isNaN(num) || isNaN(mean) || isNaN(stdev)){
                $("#edit_ds_data_txt").text("Data is not valid.");
                ds_valid=false;
              } else {
                $("#edit_ds_data_txt").text("Data has been added. N="+num+", mu="+engFormat(mean)+", sig="+engFormat(stdev));
                ds_valid=true;
              }
            };
            $("#file_open").remove();
          }, false);
          event.preventDefault();
        });
        event.preventDefault();
      });
      $("#del_ds_"+i).click(function(){
        ds_del=Number($(this).attr('id').slice(-1));
        del_ds_dialog.dialog("open");
        event.preventDefault();
      });
    }
  }
  $("#add_ds").click(function(){
    add_ds_dialog.dialog("open");
    $("#add_ds_data").click(function(){
      $("body").append("<input id='file_open' type='file' accept='.csv, .txt' style='display:none;'>");
      $("#file_open").trigger('click');
      document.getElementById('file_open').addEventListener('change', function(event){
        var files=event.target.files;
        var file=files[0];
        var reader=new FileReader();
        reader.readAsText(file);
        reader.onload=function(){
          data_str=reader.result;
          var data_arr=ds_str_2_arr(data_str);
          var num=num_samples(data_arr);
          var mean=mu(data_arr);
          var stdev=sig(data_arr, mean);
          if(isNaN(num) || isNaN(mean) || isNaN(stdev)){
            $("#add_ds_data_txt").text("Data is not valid.");
            ds_valid=false;
          } else {
            $("#add_ds_data_txt").text("Data has been added. N="+num+", mu="+engFormat(mean)+", sig="+engFormat(stdev));
            ds_valid=true;
          }
        };
        $("#file_open").remove();
      }, false);
      event.preventDefault();
    });
  });
}

function build_src_dialog(){
  var i, srci, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  srci=sources.length;
  $("#src_dialog").append("<form></form>");
  $("#src_dialog form").append("<input id='add_src' name='add_src' type='button' value='Add Source'>");
  $("#src_dialog form").append("<table></table>");
  $("#src_dialog form table").append("<tbody></tbody>");
  $("#src_dialog form table tbody").append("<tr></tr>");
  if(srci==0){
    $("#src_dialog form table tbody tr:last-child").append("No sources have been added yet. Please add a sources.")
  } else {
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Value</th>");
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
    $("#src_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
    for(i=0; i<srci; i++){
      $("#src_dialog form table tbody").append("<tr></tr>");
      $("#src_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#src_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+sources[i].name+"</td>");
      $("#src_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+sources[i].value+"</td>");
      $("#src_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'><a href='' id='edit_src_"+i+"''>Edit</a></td>");
      $("#src_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'><a href='' id='del_src_"+i+"'>Delete</a></td>");
      $("#edit_src_"+i).click(function(){
        src_edit=Number($(this).attr('id').slice(-1));
        edit_src_dialog.dialog("open");
        event.preventDefault();
      });
      $("#del_src_"+i).click(function(){
        src_del=Number($(this).attr('id').slice(-1));
        del_src_dialog.dialog("open");
        event.preventDefault();
      });
    }
  }
}

function build_inp_dialog(){
  var i, ni, mess="", si, i2, ns, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  ni=inputs.length;
  ns=ns_nc().ns;
  $("#inp_dialog").append("<form></form>");
  $("#inp_dialog form").append("<input id='add_inp' name='add_inp' type='button' value='Add Input'>");
  $("#inp_dialog form").append("<table></table>");
  $("#inp_dialog form table").append("<tbody></tbody>");
  $("#inp_dialog form table tbody").append("<tr></tr>");
  if(ni==0){
    $("#inp_dialog form table tbody").append("<tr></tr>");
    $("#inp_dialog form table tbody tr:last-child").append("No inputs have been added yet. Please add an input.")
  } else{
    $("#inp_dialog form table tbody").append("<tr></tr>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Label</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Nominal</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Random</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Systematic Src Id(s)</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Systematic</th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
    $("#inp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
    for(i=0; i<ni; i++){
      $("#inp_dialog form table tbody").append("<tr></tr>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+inputs[i].data("name")+"</td>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+inputs[i].data("variable")+"</td>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+inputs[i].data("label")+"</td>");
      if(inputs[i].data("nom_ds")>=0){
        $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(Number(inputs[i].data("nominal")))+" (ds "+(inputs[i].data("nom_ds")+1)+")</td>");
      } else {
        $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(Number(inputs[i].data("nominal")))+"</td>");
      }
      if(inputs[i].data("rand_ds")>=0){
        $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(Number(inputs[i].data("random")))+" (ds "+(inputs[i].data("rand_ds")+1)+")</td>");
      } else{
        $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(Number(inputs[i].data("random")))+"</td>");
      }
      if(inputs[i].data("sys_src").length==0){
        $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>0</td>");
      } else {
        si=inputs[i].data("sys_src").length;
        if(si==1){
          $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+inputs[i].data("sys_src")[0]+"</td>");
        } else {
          mess="";
          for(i2=0; i2<si-1; i2++){
            mess+=inputs[i].data("sys_src")[i2]+", ";
          }
          mess+=" and "+inputs[i].data("sys_src")[si-1];
          $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+mess+"</td>");
        }
      }
      $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(ns[i])+"</td>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'><a href='' id='edit_inp_"+i+"''>Edit</a></td>");
      $("#inp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'><a href='' id='del_inp_"+i+"'>Delete</a></td>");
      $("#edit_inp_"+i).click(function(){
        inp_edit=Number($(this).attr('id').slice(-1));
        edit_inp_dialog.dialog("open");
        event.preventDefault();
      });
      $("#del_inp_"+i).click(function(){
        var j, boo=false, cs=components.length;
        inp_del=Number($(this).attr('id').slice(-1));
        for(j=0; j<cs; j++){
          if($.inArray(inputs[inp_del].data("variable"), get_dep(components[j].data("fun")))>=0){
            $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
            Cannot delete input "+(inp_del+1)+" ("+inputs[inp_del].data("name")
            +") because a component is dependent upon it.</p></div>");
            $(function(){
              $("#warn").dialog({
                modal: true,
                width: '300px',
                buttons: {
                  Ok: function(){
                    $(this).dialog("close");
                    $("#warn").remove();
                  }
                }
              });
            });
            j=cs;
            boo=true;
          }
        }
        if(!boo){
          del_inp_dialog.dialog("open");
        }
        event.preventDefault();
      });
    }
  }
}

function build_comp_dialog(){
  var i, ci, mess="", style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  ci=components.length;
  $("#comp_dialog").append("<form></form>");
  $("#comp_dialog form").append("<input id='add_comp' name='add_comp' type='button' value='Add Component'>");
  $("#comp_dialog form").append("<table></table>");
  $("#comp_dialog form table").append("<tbody></tbody>");
  $("#comp_dialog form table tbody").append("<tr></tr>");
  if(ci==0){
    $("#comp_dialog form table tbody").append("<tr></tr>");
    $("#comp_dialog form table tbody tr:last-child").append("No components have been added yet. Please add a component.")
  } else{
    $("#comp_dialog form table tbody").append("<tr></tr>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Label</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Nominal</th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
    $("#comp_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
    for(i=0; i<ci; i++){
      $("#comp_dialog form table tbody").append("<tr></tr>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("name")+"</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("variable")+"</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("label")+"</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(components[i].data("nominal"))+"</td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'><a href='' id='edit_comp_"+i+"''>Edit</a></td>");
      $("#comp_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'><a href='' id='del_comp_"+i+"'>Delete</a></td>");
      $("#edit_comp_"+i).click(function(){
        comp_edit=Number($(this).attr('id').slice(-1));
        edit_comp_dialog.dialog("open");
        event.preventDefault();
      });
      $("#del_comp_"+i).click(function(){
        var j, boo=false, cs=components.length;
        comp_del=Number($(this).attr('id').slice(-1));
        for(j=0; j<cs; j++){
          if($.inArray(components[comp_del].data("variable"), get_dep(components[j].data("fun")))>=0){
            $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
            Cannot delete component "+(comp_del+1)+" ("+components[comp_del].data("name")
            +") because another component is dependent upon it.</p></div>");
            $(function(){
              $("#warn").dialog({
                modal: true,
                width: '300px',
                buttons: {
                  Ok: function(){
                    $(this).dialog("close");
                    $("#warn").remove();
                  }
                }
              });
            });
            j=cs;
            boo=true;
          }
        }
        if(!boo){
          del_comp_dialog.dialog("open");
        }
        event.preventDefault();
      });
    }
  }
}



function build_add_ds_dialog(){
  $("#add_ds_dialog").append("<p>All Fields Required</p>");
  $("#add_ds_dialog").append("<form></form>");
  $("#add_ds_dialog form").append("<label for='add_ds_name'>Name:</label>");
  $("#add_ds_dialog form").append("<input id='add_ds_name' name='add_ds_name' type='text' class='text ui-widget-content ui-corner-all'>");
  $("#add_ds_dialog form").append("<label for='add_ds_data'>Data:</label>");
  $("#add_ds_dialog form").append("<input id='add_ds_data' name='add_ds_data' type='button' value='CSV'>");
  $("#add_ds_dialog form").append("<div id='add_ds_data_txt'>No data has been added yet.</div>");
}

function build_add_src_dialog(){
  $("#add_src_dialog").append("<p>All Fields Required</p>");
  $("#add_src_dialog").append("<form></form>");
  $("#add_src_dialog form").append("<label for='add_src_name'>Name:</label>");
  $("#add_src_dialog form").append("<input id='add_src_name' name='add_src_name' type='text' class='text ui-widget-content ui-corner-all'>");
  $("#add_src_dialog form").append("<label for='add_src_value'>Value:</label>");
  $("#add_src_dialog form").append("<input id='add_src_value' name='add_src_value' type='text' class='text ui-widget-content ui-corner-all'>");
}

function build_add_inp_dialog(){
  $("#add_inp_dialog").append("<p>All Fields Required</p>");
  $("#add_inp_dialog").append("<form></form>");
  $("#add_inp_dialog form").append("<label for='add_inp_name'>Name:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_name' name='add_inp_name'>");
  $("#add_inp_dialog form").append("<label for='add_inp_variable'>Variable:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_variable' name='add_inp_variable'>");
  $("#add_inp_dialog form").append("<label for='add_inp_label'>Label:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_label' name='add_inp_label'>");
  $("#add_inp_dialog form").append("<label for='add_inp_nominal'>Nominal Value:</label><br>");
  $("#add_inp_dialog form").append("<input id='add_inp_nominal' name='add_inp_nominal' style='width: 44%;'>");
  $("#add_inp_dialog form").append(" or ");
  $("#add_inp_dialog form").append("<input id='add_inp_nominal_ds' name='Data' value='Use Dataset' style='width: 44%;'><br>");
  $("#add_inp_dialog form").append("<label for='add_inp_random'>Random Uncertainty:</label><br>");
  $("#add_inp_dialog form").append("<input id='add_inp_random' for='add_inp_random' style='width: 44%;'>");
  $("#add_inp_dialog form").append(" or ");
  $("#add_inp_dialog form").append("<input id='add_inp_random_ds' name='Data' value='Use Dataset' style='width: 44%;'><br>");
  $("#add_inp_dialog form").append("<label for='add_inp_systematic'>Systematic Uncertainty Sources:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_systematic_src' name='Data' value='Select Source(s)'><br>");
  $("#add_inp_dialog form").append("<div id='src_select'>No sources have been selected. If no source(s) are selected, a value of zero will be used.</div>");
  $("#add_inp_dialog form input").attr("type", "text");
  $("#add_inp_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
  $("#add_inp_nominal_ds, #add_inp_random_ds, #add_inp_systematic_src").attr("type", "button");
  $("#add_inp_nominal_ds, #add_inp_random_ds, #add_inp_systematic_src").attr("class", "");
  $("#add_inp_nominal_ds").click(function(){
    if(datasets.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Datasets Available'><p>No datasets available. Please add a dataset.</p><input id='warn_add' type='button' value='Got To Add Dataset'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Datasets").click();
      })
    } else {
      apply_ds_2_nom_dialog.dialog("open");
    }
  });
  $("#add_inp_random_ds").click(function(){
    if(datasets.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Datasets Available'><p>No datasets available. Please add a dataset.</p><input id='warn_add' type='button' value='Go To Add Dataset'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Datasets").click();
      })
    } else {
      apply_ds_2_rand_dialog.dialog("open");
    }
  });
  $("#add_inp_systematic_src").click(function(){
    if(sources.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Sources Available'><p>No sources available. Please add a source.</p><input id='warn_add' type='button' value='Go To Add Source'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Sources").click();
      })
    } else {
      apply_src_2_sys_dialog.dialog("open");
    }
  });
}

function build_add_comp_dialog(){
  $("#add_comp_dialog").append("<p>All Fields Required</p>");
  $("#add_comp_dialog").append("<form></form>");
  $("#add_comp_dialog form").append("<label for='add_comp_name'>Name:</label>");
  $("#add_comp_dialog form").append("<input id='add_comp_name' name='add_comp_name'>");
  $("#add_comp_dialog form").append("<label for='add_comp_variable'>Variable:</label>");
  $("#add_comp_dialog form").append("<input id='add_comp_variable' name='add_comp_variable'>");
  $("#add_comp_dialog form").append("<label for='add_comp_label'>Label:</label>");
  $("#add_comp_dialog form").append("<input id='add_comp_label' name='add_comp_label'>");
  $("#add_comp_dialog form").append("<label for='add_comp_fun'>Function:</label><br>");
  $("#add_comp_dialog form").append("<input id='add_comp_fun' name='add_comp_fun'>");
  $("#add_comp_dialog form input").attr("type", "text");
  $("#add_comp_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
}



function build_edit_ds_dialog(){
  var n, mean, stdev;
  n=num_samples(datasets[ds_edit].values);
  mean=mu(datasets[ds_edit].values);
  stdev=sig(datasets[ds_edit].values, mean);
  $("#edit_ds_dialog").append("<p>All Fields Required</p>");
  $("#edit_ds_dialog").append("<form></form>");
  $("#edit_ds_dialog form").append("<label for='edit_ds_name'>Name:</label>");
  $("#edit_ds_dialog form").append("<input id='edit_ds_name' name='edit_ds_name' type='text' class='text ui-widget-content ui-corner-all'>");
  $("#edit_ds_dialog form").append("<label for='edit_ds_data'>Data:</label>");
  $("#edit_ds_dialog form").append("<input id='edit_ds_data' name='edit_ds_data' type='button' value='CSV'>");
  $("#edit_ds_dialog form").append("<div id='edit_ds_data_txt'>Data has been added. N="+n+", mu="+mean+", sig="+stdev+"</div>");
  $("#edit_ds_name").val(datasets[ds_edit].name);
  data_str=datasets[ds_edit].values.join("\n");
  ds_valid=true;
}

function build_edit_src_dialog(){
  $("#edit_src_dialog").append("<p>All Fields Required</p>");
  $("#edit_src_dialog").append("<form></form>");
  $("#edit_src_dialog form").append("<label for='edit_src_name'>Name:</label>");
  $("#edit_src_dialog form").append("<input id='edit_src_name' name='edit_src_name' type='text' class='text ui-widget-content ui-corner-all'>");
  $("#edit_src_dialog form").append("<label for='edit_src_value'>Value:</label>");
  $("#edit_src_dialog form").append("<input id='edit_src_value' name='edit_src_value' type='text' class='text ui-widget-content ui-corner-all'>");
  $("#edit_src_name").val(sources[src_edit].name);
  $("#edit_src_value").val(sources[src_edit].value);
}

function build_edit_inp_dialog(){
  var i, si, mess="";
  $("#edit_inp_dialog").append("<p>All Fields Required</p>");
  $("#edit_inp_dialog").append("<form></form>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_name'>Name:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_name' name='add_inp_name'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_variable'>Variable:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_variable' name='add_inp_variable'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_label'>Label:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_label' name='add_inp_label'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_nominal'>Nominal Value:</label><br>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_nominal' name='add_inp_nominal' style='width: 44%;'>");
  $("#edit_inp_dialog form").append(" or ");
  $("#edit_inp_dialog form").append("<input id='edit_inp_nominal_ds' name='Data' value='Use Dataset' style='width: 44%;'><br>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_random'>Random Uncertainty:</label><br>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_random' for='add_inp_random' style='width: 44%;'>");
  $("#edit_inp_dialog form").append(" or ");
  $("#edit_inp_dialog form").append("<input id='edit_inp_random_ds' name='Data' value='Use Dataset' style='width: 44%;'><br>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_systematic'>Systematic Uncertainty Sources:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_systematic_src' name='Data' value='Select Source(s)'><br>");
  src_sys=inputs[inp_edit].data("sys_src");
  si=src_sys.length;
  if(si==0){
    $("#edit_inp_dialog form").append("<div id='src_select'>No sources have been selected. If no source(s) are selected, a value of zero will be used.</div>");
  } else if (si==1){
    $("#edit_inp_dialog form").append("<div id='src_select'>Source id "+src_sys[0]+" selected.</div>");
  } else {
    for(i=0; i<si-1; i++){
      mess+=src_sys[i]+", ";
    }
    mess+=" and "+src_sys[si-1];
    $("#edit_inp_dialog form").append("<div id='src_select'>Source ids "+mess+" selected.</div>");
  }
  $("#edit_inp_dialog form input").attr("type", "text");
  $("#edit_inp_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
  $("#edit_inp_nominal_ds, #edit_inp_random_ds, #edit_inp_systematic_src").attr("type", "button");
  $("#edit_inp_nominal_ds, #edit_inp_random_ds, #edit_inp_systematic_src").attr("class", "");
  $("#edit_inp_name").val(inputs[inp_edit].data("name"));
  $("#edit_inp_variable").val(inputs[inp_edit].data("variable"));
  $("#edit_inp_label").val(inputs[inp_edit].data("label"));
  $("#edit_inp_nominal").val(inputs[inp_edit].data("nominal"));
  ds_nom=inputs[inp_edit].data("nom_ds");
  $("#edit_inp_random").val(inputs[inp_edit].data("random"));
  ds_rand=inputs[inp_edit].data("rand_ds");
  $("#edit_inp_nominal_ds").click(function(){
    if(datasets.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Datasets Available'><p>No datasets available. Please add a dataset.</p><input id='warn_add' type='button' value='Got To Add Dataset'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Datasets").click();
      })
    } else {
      apply_ds_2_nom_dialog.dialog("open");
    }
  });
  $("#edit_inp_random_ds").click(function(){
    if(datasets.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Datasets Available'><p>No datasets available. Please add a dataset.</p><input id='warn_add' type='button' value='Go To Add Dataset'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Datasets").click();
      })
    } else {
      apply_ds_2_rand_dialog.dialog("open");
    }
  });
  $("#edit_inp_systematic_src").click(function(){
    if(sources.length==0){
      $("body").append("<div id='warn' class='dialog' title='No Sources Available'><p>No sources available. Please add a source.</p><input id='warn_add' type='button' value='Go To Add Source'></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
      $("#warn_add").click(function(){
        $("#warn").dialog("close");
        $("#Sources").click();
      })
    } else {
      apply_src_2_sys_dialog.dialog("open");
    }
  });
}

function build_edit_comp_dialog(){
  $("#edit_comp_dialog").append("<p>All Fields Required</p>");
  $("#edit_comp_dialog").append("<form></form>");
  $("#edit_comp_dialog form").append("<label for='edit_comp_name'>Name:</label>");
  $("#edit_comp_dialog form").append("<input id='edit_comp_name' name='add_comp_name'>");
  $("#edit_comp_dialog form").append("<label for='edit_comp_variable'>Variable:</label>");
  $("#edit_comp_dialog form").append("<input id='edit_comp_variable' name='add_comp_variable'>");
  $("#edit_comp_dialog form").append("<label for='edit_comp_label'>Label:</label>");
  $("#edit_comp_dialog form").append("<input id='edit_comp_label' name='add_comp_label'>");
  $("#edit_comp_dialog form").append("<label for='edit_comp_fun'>Function:</label><br>");
  $("#edit_comp_dialog form").append("<input id='edit_comp_fun' name='add_comp_fun'>");
  $("#edit_comp_dialog form input").attr("type", "text");
  $("#edit_comp_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
  $("#edit_comp_name").val(components[comp_edit].data("name"));
  $("#edit_comp_variable").val(components[comp_edit].data("variable"));
  $("#edit_comp_label").val(components[comp_edit].data("label"));
  $("#edit_comp_fun").val(components[comp_edit].data("fun"));
}



function build_del_ds_dialog(){
  var i, j, dep=[], ds, ns=inputs.length, mess="";
  mess="Are you sure you want to delete dataset "+(ds_del+1)+" ("+datasets[ds_del].name+")?";
  for(i=0; i<ns; i++){
    if(ds_del==inputs[i].data("nom_ds") || ds_del==inputs[i].data("rand_ds")){
      dep.push(i);
    }
  }
  if (dep.length==1){
    mess+=" The input "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+") is dependent upon the dataset.";
    mess+=" If the dataset is deleted, the input will retain the nominal value, or random uncertainty value that the input current has but will no longer be linked to the dataset.";
  } else if (dep.length>1){
    ds=dep.length;
    mess+=" The input ";
    for(j=0; j<ds-1; j++){
      mess+=(dep[j]+1)+", ";
    }
    mess+="and "+(dep[ds-1]+1)+" (";
    for(j=0; j<ds-1; j++){
      mess+=inputs[dep[j]].data("name")+", ";
    }
    mess+="and "+inputs[dep[ds-1]].data("name")+") are dependent upon the dataset.";
    mess+=" If the dataset is deleted, the inputs will retain the nominal value, or random uncertainty value that the inputs currently have but will no longer be linked to the dataset.";
  }
  $("#del_ds_dialog").append("<p>"+mess+"</p>");
}

function build_del_src_dialog(){
  var i, j, dep=[], ds, ns=inputs.length, mess="";
  mess="Are you sure you want to delete source "+(src_del+1)+" ("+sources[src_del].name+")?";
  for(i=0; i<ns; i++){
    if($.inArray(src_del, inputs[i].data("sys_src"))>=0){
      dep.push(i);
    }
  }
  if (dep.length==1){
    mess+=" The input "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+") is dependent upon the source.";
    mess+=" If the source is deleted, the input will no longer have the systematic uncertainty source which may result in the input having a systematic uncertainty value of zero.";
  } else if (dep.length>1){
    ds=dep.length;
    mess+=" The input ";
    for(j=0; j<ds-1; j++){
      mess+=(dep[j]+1)+", ";
    }
    mess+="and "+(dep[ds-1]+1)+" (";
    for(j=0; j<ds-1; j++){
      mess+=inputs[dep[j]].data("name")+", ";
    }
    mess+="and "+inputs[dep[ds-1]].data("name")+") are dependent upon the source.";
    mess+=" If the source is deleted, the inputs will no longer have the systematic uncertainty source which may result in the inputs having a systematic uncertainty value of zero.";
  }
  $("#del_src_dialog").append("<p>"+mess+"</p>");
}

function build_del_inp_dialog(){
  $("#del_inp_dialog").append("<p>Are you sure you want to delete input "+(inp_del+1)+" ("+inputs[inp_del].data("name")+")?</p>");
}

function build_del_comp_dialog(){
  $("#del_comp_dialog").append("<p>Are you sure you want to delete component "+(comp_del+1)+" ("+components[comp_del].data("name")+")?</p>");
}



function build_apply_ds_2_nom_dialog(){
  var i, dsi, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  dsi=datasets.length;
  $("#apply_ds_2_nom_dialog").append("<form></form>");
  $("#apply_ds_2_nom_dialog form").append("<table></table>");
  $("#apply_ds_2_nom_dialog form table").append("<tbody></tbody>");
  $("#apply_ds_2_nom_dialog form table tbody").append("<tr></tr>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Number</th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Mean</th>");
  $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>StDev.</th>");
  for(i=0; i<dsi; i++){
    var n, mean, stdev;
    n=num_samples(datasets[i].values);
    mean=mu(datasets[i].values);
    stdev=sig(datasets[i].values, mean);
    $("#apply_ds_2_nom_dialog form table tbody").append("<tr></tr>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td style='text-align: center; vertical-align: text-top;'><input type='radio' name='ds' value='"+i+"'</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+datasets[i].name+"</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+n+"</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(mean)+"</td>");
    $("#apply_ds_2_nom_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(stdev)+"</td>");
  }
}

function build_apply_ds_2_rand_dialog(){
  var i, dsi, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  dsi=datasets.length;
  $("#apply_ds_2_rand_dialog").append("<form></form>");
  $("#apply_ds_2_rand_dialog form").append("<table></table>");
  $("#apply_ds_2_rand_dialog form table").append("<tbody></tbody>");
  $("#apply_ds_2_rand_dialog form table tbody").append("<tr></tr>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Number</th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Mean</th>");
  $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>StDev.</th>");
  for(i=0; i<dsi; i++){
    var n, mean, stdev;
    n=num_samples(datasets[i].values);
    mean=mu(datasets[i].values);
    stdev=sig(datasets[i].values, mean);
    $("#apply_ds_2_rand_dialog form table tbody").append("<tr></tr>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td style='text-align: center; vertical-align: text-top;'><input type='radio' name='ds' value='"+i+"'></td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+datasets[i].name+"</td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+n+"</td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(mean)+"</td>");
    $("#apply_ds_2_rand_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(stdev)+"</td>");
  }
}

function build_apply_src_2_sys_dialog(){
  var i, si, ni, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  si=sources.length;
  $("#apply_src_2_sys_dialog").append("<form></form>");
  $("#apply_src_2_sys_dialog form").append("<table></table>");
  $("#apply_src_2_sys_dialog form table").append("<tbody></tbody>");
  $("#apply_src_2_sys_dialog form table tbody").append("<tr></tr>");
  $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'></th>");
  $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
  $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Value</th>");
  for(i=0; i<si; i++){
    $("#apply_src_2_sys_dialog form table tbody").append("<tr></tr>");
    if(inp_edit!=-1){
      if($.inArray(i+1, inputs[inp_edit].data("sys_src"))>=0){
        $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td style='text-align: center; vertical-align: text-top;'><input type='checkbox' class='src' name='src' checked></td>");
      } else {
        $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td style='text-align: center; vertical-align: text-top;'><input type='checkbox' class='src' name='src'></td>");
      }
    } else {
      $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td style='text-align: center; vertical-align: text-top;'><input type='checkbox' class='src' name='src'></td>");
    }
    $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
    $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+sources[i].name+"</td>");
    $("#apply_src_2_sys_dialog form table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+sources[i].value+"</td>");
  }
}



function build_sum_ds_dialog(){
  var i, dsi, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  dsi=datasets.length;
  $("#sum_ds_dialog").append("<table></table>");
  $("#sum_ds_dialog table").append("<tbody></tbody>");
  $("#sum_ds_dialog table tbody").append("<tr></tr>");
  if(dsi==0){
    $("#sum_ds_dialog table tbody tr:last-child").append("No datasets have been added yet.");
  } else {
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Number</th>");
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Mean</th>");
    $("#sum_ds_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>StDev</th>");
    for(i=0; i<dsi; i++){
      var n, mean, stdev;
      n=num_samples(datasets[i].values);
      mean=mu(datasets[i].values);
      stdev=sig(datasets[i].values, mean);
      $("#sum_ds_dialog table tbody").append("<tr></tr>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+datasets[i].name+"</td>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+n+"</td>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(mean)+"</td>");
      $("#sum_ds_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(stdev)+"</td>");
    }
  }
}

function build_sum_src_dialog(){
  var i, srci, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  srci=sources.length;
  $("#sum_src_dialog").append("<table></table>");
  $("#sum_src_dialog table").append("<tbody></tbody>");
  $("#sum_src_dialog table tbody").append("<tr></tr>");
  if(srci==0){
    $("#sum_src_dialog table tbody tr:last-child").append("No sources have been added yet.")
  } else {
    $("#sum_src_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_src_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#sum_src_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Value</th>");
    for(i=0; i<srci; i++){
      $("#sum_src_dialog table tbody").append("<tr></tr>");
      $("#sum_src_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#sum_src_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+sources[i].name+"</td>");
      $("#sum_src_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+sources[i].value+"</td>");
    }
  }
}

function build_sum_inp_dialog(){
  var i, ni, mess="", si, i2, ns, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  ni=inputs.length;
  ns=ns_nc().ns;
  $("#sum_inp_dialog").append("<table></table>");
  $("#sum_inp_dialog table").append("<tbody></tbody>");
  $("#sum_inp_dialog table tbody").append("<tr></tr>");
  if(ni==0){
    $("#sum_inp_dialog table tbody tr:last-child").append("No inputs have been added yet.")
  } else{
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Label</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Nominal</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Random</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Systematic Src Id(s)</th>");
    $("#sum_inp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Systematic</th>");
    for(i=0; i<ni; i++){
      $("#sum_inp_dialog table tbody").append("<tr></tr>");
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+inputs[i].data("name")+"</td>");
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+inputs[i].data("variable")+"</td>");
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+inputs[i].data("label")+"</td>");
      if(inputs[i].data("nom_ds")>=0){
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(Number(inputs[i].data("nominal")))+" (ds "+(inputs[i].data("nom_ds")+1)+")</td>");
      } else {
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(Number(inputs[i].data("nominal")))+"</td>");
      }
      if(inputs[i].data("rand_ds")>=0){
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(Number(inputs[i].data("random")))+" (ds "+(inputs[i].data("rand_ds")+1)+")</td>");
      } else{
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(Number(inputs[i].data("random")))+"</td>");
      }
      if(inputs[i].data("sys_src").length==0){
        $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>0</td>");
      } else {
        si=inputs[i].data("sys_src").length;
        if(si==1){
          $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(inputs[i].data("sys_src")[0]+1)+"</td>");
        } else {
          mess="";
          for(i2=0; i2<si-1; i2++){
            mess+=(inputs[i].data("sys_src")[i2]+1)+", ";
          }
          mess+=" and "+(inputs[i].data("sys_src")[si-1]+1);
          $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+mess+"</td>");
        }
      }
      $("#sum_inp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(ns[i])+"</td>");
    }
  }
}

function build_sum_comp_dialog(){
  var i, ci, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  ci=components.length;
  $("#sum_comp_dialog").append("<table></table>");
  $("#sum_comp_dialog table").append("<tbody></tbody>");
  $("#sum_comp_dialog table tbody").append("<tr></tr>");
  if(ci==0){
    $("#sum_comp_dialog table tbody tr:last-child").append("No components have been added yet.")
  } else{
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Label</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Function</th>");
    $("#sum_comp_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Nominal</th>");
    for(i=0; i<ci; i++){
      $("#sum_comp_dialog table tbody").append("<tr></tr>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("name")+"</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("variable")+"</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("label")+"</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("fun")+"</td>");
      $("#sum_comp_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("nominal")+"</td>");
    }
  }
}

function build_sum_corr_dialog(){
  var i, j, ni, ncs, mess="", nc, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;";
  ni=inputs.length;
  nc=ns_nc().nc;
  ncs=nc.length;
  $("#sum_corr_dialog").append("<table></table>");
  $("#sum_corr_dialog table").append("<tbody></tbody>");
  $("#sum_corr_dialog table tbody").append("<tr></tr>");
  if(ni==0){
    $("#sum_corr_dialog table tbody tr:last-child").append("No inputs have been added yet.")
  } else{
    $("#sum_corr_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
    $("#sum_corr_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
    for(i=0; i<ncs; i++){
      $("#sum_corr_dialog table tbody tr:last-child").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>"+(i+1)+"</th>");
    }
    for(i=0; i<ni; i++){
      $("#sum_corr_dialog table tbody").append("<tr></tr>");
      $("#sum_corr_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
      $("#sum_corr_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+inputs[i].data("name")+"</td>");
      for(j=0; j<ncs; j++){
        $("#sum_corr_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(nc[j][i])+"</td>");
      }
    }
  }
}

function build_sum_u_dialog(){
  var i, nc=components.length, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  $("#sum_u_dialog").append("<table></table>");
  $("#sum_u_dialog table").append("<tbody></tbody>");
  $("#sum_u_dialog table tbody").append("<tr></tr>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Label</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Function</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Value</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Total Uncertainty</th>");
  $("#sum_u_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>% Total Uncertainty</th>");
  for(i=0; i<nc; i++){
    $("#sum_u_dialog table tbody").append("<tr></tr>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("name")+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("variable")+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("label")+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("fun")+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(components[i].data("nominal"))+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(U[i])+"</td>");
    $("#sum_u_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat((U[i]/Math.abs(components[i].data("nominal")))*100)+"</td>");
  }
}

function build_sum_umf_dialog(){
  var i, j, ni=inputs.length, nc=components.length, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  $("#sum_umf_dialog").append("<table></table>");
  $("#sum_umf_dialog table").append("<tbody></tbody>");
  $("#sum_umf_dialog table tbody").append("<tr></tr>");
  $("#sum_umf_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
  $("#sum_umf_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#sum_umf_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
  for(i=0; i<ni; i++){
    $("#sum_umf_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>"+inputs[i].data("variable")+"</th>");
  }
  for(i=0; i<nc; i++){
    $("#sum_umf_dialog table tbody").append("<tr></tr>");
    $("#sum_umf_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
    $("#sum_umf_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("name")+"</td>");
    $("#sum_umf_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("variable")+"</td>");
    for(j=0; j<ni; j++){
      $("#sum_umf_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(Math.abs(UMF[i][j]))+"</td>");
    }
  }
}

function build_sum_upc_dialog(){
  var i, j, ni=inputs.length, nc=components.length, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  $("#sum_upc_dialog").append("<table></table>");
  $("#sum_upc_dialog table").append("<tbody></tbody>");
  $("#sum_upc_dialog table tbody").append("<tr></tr>");
  $("#sum_upc_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>id</th>");
  $("#sum_upc_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#sum_upc_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
  for(i=0; i<ni; i++){
    $("#sum_upc_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>"+inputs[i].data("variable")+"</th>");
  }
  for(i=0; i<nc; i++){
    $("#sum_upc_dialog table tbody").append("<tr></tr>");
    $("#sum_upc_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+(i+1)+"</td>");
    $("#sum_upc_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("name")+"</td>");
    $("#sum_upc_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+components[i].data("variable")+"</td>");
    for(j=0; j<ni; j++){
      $("#sum_upc_dialog table tbody tr:last-child").append("<td style='word-wrap: break-word; "+style+"'>"+engFormat(100*UPC[i][j])+"</td>");
    }
  }
}



function build_calc_u_dialog(){
  if(inputs.length>0 && components.length>0){
    if(!flags.U){calc_U()};
    $("#calc_u_dialog").append("<p>Calculating the components' total uncertainty is complete.");
    calc_u_dialog.dialog({
      title: "Calculation complete",
      buttons: {
        "View Results": calc_u_action_view_results,
        Ok: calc_u_action_ok
      }
    });
    calc_u_dialog.dialog("open");
  } else {
    if(inputs.length>0){
      $("#calc_u_dialog").append("<p>There are no components added to the system.</p>")
      calc_u_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Components": calc_u_action_add_components,
          Ok: calc_u_action_ok
        }
      });
    } else {
      $("#calc_u_dialog").append("<p>There are no inputs added to the system.</p>")
      calc_u_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Inputs": calc_u_action_add_inputs,
          Ok: calc_u_action_ok
        }
      });
    }
    calc_u_dialog.dialog("open");
  }
}

function build_calc_umf_dialog(){
  if(inputs.length>0 && components.length>0){
    if(!flags.UMF){calc_UMF()};
    $("#calc_umf_dialog").append("<p>Calculating the uncertainty magnification factor is complete.");
    calc_umf_dialog.dialog({
      title: "Calculation complete",
      buttons: {
        "View Results": calc_umf_action_view_results,
        Ok: calc_umf_action_ok
      }
    });
    calc_umf_dialog.dialog("open");
  } else {
    if(inputs.length>0){
      $("#calc_umf_dialog").append("<p>There are no components added to the system.</p>")
      calc_umf_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Components": calc_umf_action_add_components,
          Ok: calc_umf_action_ok
        }
      });
    } else {
      $("#calc_umf_dialog").append("<p>There are no inputs added to the system.</p>")
      calc_umf_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Inputs": calc_umf_action_add_inputs,
          Ok: calc_umf_action_ok
        }
      });
    }
    calc_umf_dialog.dialog("open");
  }
}

function build_calc_upc_dialog(){
  if(inputs.length>0 && components.length>0){
    if(!flags.UPC){calc_UPC()};
    $("#calc_upc_dialog").append("<p>Calculating the uncertainty percent contribution is complete.");
    calc_upc_dialog.dialog({
      title: "Calculation complete",
      buttons: {
        "View Results": calc_upc_action_view_results,
        Ok: calc_upc_action_ok
      }
    });
    calc_upc_dialog.dialog("open");
  } else {
    if(inputs.length>0){
      $("#calc_upc_dialog").append("<p>There are no components added to the system.</p>")
      calc_upc_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Components": calc_upc_action_add_components,
          Ok: calc_upc_action_ok
        }
      });
    } else {
      $("#calc_upc_dialog").append("<p>There are no inputs added to the system.</p>")
      calc_upc_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Inputs": calc_upc_action_add_inputs,
          Ok: calc_upc_action_ok
        }
      });
    }
    calc_upc_dialog.dialog("open");
  }
}






function empty_ds_dialog(){
  $("#ds_dialog").empty();
}

function empty_src_dialog(){
  $("#src_dialog").empty();
}

function empty_inp_dialog(){
  $("#inp_dialog").empty();
}

function empty_comp_dialog(){
  $("#comp_dialog").empty();
}



function empty_add_ds_dialog(){
  $("#add_ds_dialog").empty();
}

function empty_add_src_dialog(){
  $("#add_src_dialog").empty();
}

function empty_add_inp_dialog(){
  ds_nom=-1;
  ds_rand=-1;
  $("#add_inp_dialog").empty();
}

function empty_add_comp_dialog(){
  $("#add_comp_dialog").empty();
}



function empty_edit_ds_dialog(){
  $("#edit_ds_dialog").empty();
}

function empty_edit_src_dialog(){
  $("#edit_src_dialog").empty();
}

function empty_edit_inp_dialog(){
  inp_edit=-1;
  $("#edit_inp_dialog").empty();
}

function empty_edit_comp_dialog(){
  comp_edit=-1;
  $("#edit_comp_dialog").empty();
}



function empty_del_ds_dialog(){
  $("#del_ds_dialog").empty();
}

function empty_del_src_dialog(){
  $("#del_src_dialog").empty();
}

function empty_del_inp_dialog(){
  inp_del=-1;
  $("#del_inp_dialog").empty();
}

function empty_del_comp_dialog(){
  comp_del=-1;
  $("#del_comp_dialog").empty();
}



function empty_sum_ds_dialog(){
  $("#sum_ds_dialog").empty();
}

function empty_sum_src_dialog(){
  $("#sum_src_dialog").empty();
}

function empty_sum_inp_dialog(){
  $("#sum_inp_dialog").empty();
}

function empty_sum_comp_dialog(){
  $("#sum_comp_dialog").empty();
}

function empty_sum_corr_dialog(){
  $("#sum_corr_dialog").empty();
}

function empty_sum_u_dialog(){
  $("#sum_u_dialog").empty();
}

function empty_sum_umf_dialog(){
  $("#sum_umf_dialog").empty();
}

function empty_sum_upc_dialog(){
  $("#sum_upc_dialog").empty();
}



function empty_apply_ds_2_nom_dialog(){
  $("#apply_ds_2_nom_dialog").empty();
}

function empty_apply_ds_2_rand_dialog(){
  $("#apply_ds_2_rand_dialog").empty();
}

function empty_apply_src_2_sys_dialog(){
  $("#apply_src_2_sys_dialog").empty();
}



function ds_action_ok(){
  ds_dialog.dialog("close");
}

function src_action_ok(){
  src_dialog.dialog("close");
}

function inp_action_ok(){
  inp_dialog.dialog("close");
}

function comp_action_ok(){
  comp_dialog.dialog("close");
}



function add_ds_action_add_dataset(){

  var warn=[], warn_str, ws, i;

  var name=$("#add_ds_name").val().trim();

  if(name.length<=0){warn.push("name");}

  if(!ds_valid){warn.push("data");}

  if(warn.length==0){
    datasets.push({name: name, values: ds_str_2_arr(data_str)});
    data_str="";
    ds_valid=false;
    ds_dialog.dialog("close");
    $("#Datasets").click();
    add_ds_dialog.dialog("close");
  } else {
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if (ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){
        warn_str=warn_str+", "+warn[i];
      }
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the dataset is not valid.";
    $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      })
    })
  }
}

function add_ds_action_cancel(){
  add_ds_dialog.dialog("close");
}

function add_src_action_add_source(){

  var warn=[], warn_str, ws, i;

  var num_regex=/^[0-9][.0-9]*$/;

  var name=$("#add_src_name").val().trim();

  var value=$("#add_src_value").val().trim();

  if(name.length<=0){warn.push("name");}

  if ((value.length<=0) || !(num_regex.test(value))){warn.push("value");}

  if(warn.length==0){
    sources.push({name: name, value: Number(value)});
    src_dialog.dialog("close");
    $("#Sources").click();
    add_src_dialog.dialog("close");
  } else {
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if (ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){
        warn_str=warn_str+", "+warn[i];
      }
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the source is not valid.";
    $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

function add_src_action_cancel(){
  add_src_dialog.dialog("close");
}

function add_inp_action_add_input(){

  var warn=[], warn_str, ws, i;

  var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;

  var nom_regex=/^[0-9][.0-9]*$/;

  var name=$("#add_inp_name").val().trim();

  var variable=$("#add_inp_variable").val().trim();

  var label=$("#add_inp_label").val().trim();

  var nominal=$("#add_inp_nominal").val().trim();

  var random=$("#add_inp_random").val().trim();

  if (name.length<=0){warn.push("name");}

  if ((variable.length<=0) || !variable_regex.test(variable)){warn.push("variable");}

  if (label.length<=0){warn.push("label");}

  if ((nominal.length<=0) || !(nom_regex.test(nominal))){warn.push("nominal value");}

  if ((random.length<=0) || !(nom_regex.test(random))){warn.push("random uncertainty");}

  if (warn.length==0){

    if(valid_variable(inputs, components, variable)){

      var hw=$("#holder").width(), hh=$("#holder").height(), ow=50, oh=50;

      var os=get_text_size(label);

      if(os[0]>ow){ow=Math.round(os[0])+10;}

      if(os[1]>oh){oh=Math.round(os[1])+10;}

      if(ow>oh){oh=ow;}

      else {ow=oh;}

      r.addobj({type:"ellipse", x:hw/2-ow/2, y:hh/2-oh/2, w:ow, h:oh, name:name, variable:variable, label:label, nominal:nominal, nom_ds:ds_nom, random:random, rand_ds:ds_rand, sys_src:src_sys});

      calc_comp_nom();

      $("#add_inp_name").val("");

      $("#add_inp_variable").val("");

      $("#add_inp_label").val("");

      $("#add_inp_nominal").val("");

      $("#add_inp_random").val("");

      $("#add_inp_systematic").val("");

      flags.J=false;

      flags.W=false;

      flags.NU=false;

      flags.U=false;

      $("#u_sum").remove();
      flags.UMF=false;
      $("#umf_sum").remove();
      flags.UPC=false;
      $("#upc_sum").remove();
      add_inp_dialog.dialog("close");
      inp_dialog.dialog("close");
      ds_nom=-1;
      ds_rand=-1;
      src_sys=[];
      $("#Inputs").click();
    } else {
      $("body").append("<div id='warn' class='dialog' title='Warning'><p>Input variable must be unique.</p></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
    }
  } else {
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if (ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){
        warn_str=warn_str+", "+warn[i];
      }
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the input is not valid.";
    $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      });
    });
  }
}

function add_inp_action_cancel(){
  ds_nom=-1;
  ds_rand=-1;
  src_sys=[];
  add_inp_dialog.dialog("close");
}

function add_comp_action_add_component(){

  var warn=[], warn_str, ws, i;

  var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;

  var name=$("#add_comp_name").val().trim();

  var variable=$("#add_comp_variable").val().trim();

  var label=$("#add_comp_label").val().trim();

  var fun=$("#add_comp_fun").val().trim();

  if (name.length<=0){warn.push("name");}

  if (variable.length<=0 || !variable_regex.test(variable)){
    warn.push("variable");
  }

  if (label.length<=0){warn.push("label");}

  if (fun.length<=0 || get_dep(fun).length==0){warn.push("function");}

  if (warn.length==0){

    if(valid_variable(inputs, components, variable)){

      var dep_var=get_dep(fun);

      var inp_var=get_inp_var();

      var comp_var=get_comp_var();

      var dvs=dep_var.length;

      var ivs=inp_var.length;

      var cvs=comp_var.length;

      var var_boolean=0;

      if(inp_var){

        for(i=0; i<dvs; i++){

          if($.inArray(dep_var[i],inp_var)==-1 &&
             $.inArray(dep_var[i],comp_var)==-1){

            var_boolean+=1;
          }
        }

        if(var_boolean==0){

          var cs=components.length

          var hw=$("#holder").width(), hh=$("#holder").height(),
              ow=50, oh=50;

          var os=get_text_size(label);

          if(os[0]>ow){ow=Math.round(os[0])+10;}

          if(os[1]>oh){oh=Math.round(os[1])+10;}

          if(ow>oh){oh=ow;}

          else {ow=oh;}

          r.addobj({type:"rect", x:hw/2-ow/2, y:hh/2-oh/2, w:ow, h:oh,
                    name:name, variable:variable, label:label, fun:fun});

          for(i=0; i<ivs; i++){

            if($.inArray(inp_var[i],dep_var)!=-1){

              r.addcon(inputs[i],components[cs]);
            }
          }

          for(i=0; i<cvs; i++){

            if($.inArray(comp_var[i],dep_var)!=-1){

              r.addcon(components[i],components[cs]);
            }
          }

          calc_comp_nom();

          $("#add_com_name").val("");

          $("#add_comp_variable").val("");

          $("#add_com_label").val("");

          $("#add_com_fun").val("");

          flags.J=false;

          flags.W=false;

          flags.U=false;

          $("#u_sum").remove();

          flags.UMF=false;

          $("#umf_sum").remove();

          flags.UPC=false;

          $("#upc_sum").remove();

          add_comp_dialog.dialog("close");
          comp_dialog.dialog("close");
          $("#Components").click();

        } else {

          $("body").append("<div id='warn' class='dialog' title='Warning'>\
                            <p>The function contains input(s) that have not\
                            been added yet. Would you like to add the input\
                            now?</p></div>");

          $(function(){

            $("#warn").dialog({

              modal: true,

              buttons: {

                "Add Input": function(){

                  $(this).dialog("close");

                  add_comp_dialog.dialog("close");

                  add_inp_dialog.dialog("open");

                  $("#warn").remove();
                },

                Ok: function(){

                  $(this).dialog("close");

                  $("#warn").remove();
                }
              }
            })
          })
        }

      } else {

        $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
                          No inputs have been added yet.</p></div>");

        $(function(){

          $("#warn").dialog({

            modal: true,

            buttons: {

              "Add Input": function(){

                $(this).dialog("close");

                add_comp_dialog.dialog("close");

                add_inp_dialog.dialog("open");

                $("#warn").remove();
              },

              Ok: function(){

                $(this).dialog("close");

                $("#warn").remove();
              }
            }
          })
        })
      }

    } else {

      $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
                        Component variable must be unique.</p></div>");

      $(function(){

        $("#warn").dialog({

          modal: true,

          buttons: {

            Ok: function(){

              $(this).dialog("close");

              $("#warn").remove();
            }
          }
        })
      })
    }

  } else {

    ws=warn.length;

    warn_str="The ";

    if(ws==1){

      warn_str+=warn[0];

    } else{

      warn_str+=warn[0];

      for(i=1; i<ws-1; i++){

        warn_str+=", "+warn[i];
      }

      warn_str+=", and "+warn[ws-1];
    }

    warn_str+=" of the component is not valid.";

    $("body").append("<div id='warn' class='dialog' title='Fields Required'\
                      ><p>"+warn_str+"</p></div>");

    $(function(){

      $("#warn").dialog({

        modal: true,

        buttons: {

          Ok: function(){

            $(this).dialog("close");

            $("#warn").remove();
          }
        }
      });
    });
  }
}

function add_comp_action_cancel(){
  add_comp_dialog.dialog("close");
}



function edit_ds_action_edit_dataset(){

  var warn=[], warn_str, ws, i;

  var name=$("#edit_ds_name").val().trim();

  if(name.length<=0){warn.push("name");}

  if(!ds_valid){warn.push("data");}
  if(warn.length==0){
    var i, ni, di, dep=[], mess="";
    ni=inputs.length;
    for(i=0; i<ni; i++){
      if(ds_edit==inputs[i].data("nom_ds") || ds_edit==inputs[i].data("rand_ds")){
        dep.push(i);
      }
    }
    if(dep.length>0){
      di=dep.length;
      mess="This will modify value for input";
      if(di==1){
        mess=mess+" "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+").";
      } else {
        mess=mess+"s ";
        for(i=0; i<di-1; i++){
          mess=mess+(dep[i]+1)+", ";
        }
        mess=mess+"and "+(dep[di-1]+1)+" (";
        for(i=0; i<di-1; i++){
          mess=mess+inputs[dep[i]].data("name")+", ";
        }
        mess=mess+"and "+inputs[dep[di-1]].data("name")+").";
      }
      mess=mess+" Are you sure?";
      $("body").append("<div id='warn' class='dialog' title='Are you sure?'><p>"+mess+"</p></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Yes: function(){
              datasets[ds_edit].name=name;
              datasets[ds_edit].values=ds_str_2_arr(data_str);
              data_str="";
              ds_valid=false;
              var num, mean, stdev, r;
              num=num_samples(datasets[ds_edit].values);
              mean=mu(datasets[ds_edit].values);
              stdev=sig(datasets[ds_edit].values, mean);
              r=t_dist(num)*sig(datasets[ds_edit].values, mean)/Math.pow(num,1/2);
              for(i=0; i<di; i++){
                if(ds_edit==inputs[dep[i]].data("nom_ds")){
                  inputs[dep[i]].data("nominal", mean);
                }
                if(ds_edit==inputs[dep[i]].data("rand_ds")){
                  inputs[dep[i]].data("random", r);
                }
              }
              ds_dialog.dialog("close");
              $(this).dialog("close");
              $("#warn").remove();
              edit_ds_dialog.dialog("close");
              $("#Datasets").click();
            },
            Cancel: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
    } else {
      datasets[ds_edit].name=name;
      datasets[ds_edit].values=ds_str_2_arr(data_str);
      data_str="";
      ds_valid=false;
      ds_dialog.dialog("close");
      $("#Datasets").click();
      edit_ds_dialog.dialog("close");
    }
  } else {
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if (ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){
        warn_str=warn_str+", "+warn[i];
      }
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the dataset is not valid.";
    $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      })
    })
  }
}

function edit_ds_action_cancel(){
  edit_ds_dialog.dialog("close");
}

function edit_src_action_edit_source(){

  var warn=[], warn_str, ws, i;

  var name=$("#edit_src_name").val().trim();

  var value=$("#edit_src_value").val().trim();

  if(name.length<=0){warn.push("name");}

  if(value.length<=0){warn.push("value");}

  if(warn.length==0){
    var i, ni, di, dep=[], mess="";
    ni=inputs.length;
    for(i=0; i<ni; i++){
      if(inputs[i].data("sys_src").indexOf(src_edit)){
        dep.push(i);
      }
    }
    if(dep.length>0){
      di=dep.length;
      mess="This will modify value for input";
      if(di==1){
        mess=mess+" "+(dep[0]+1)+" ("+inputs[dep[0]].data("name")+").";
      } else {
        mess=mess+"s ";
        for(i=0; i<di-1; i++){
          mess=mess+(dep[i]+1)+", ";
        }
        mess=mess+"and "+(dep[di-1]+1)+" (";
        for(i=0; i<di-1; i++){
          mess=mess+inputs[dep[i]].data("name")+", ";
        }
        mess=mess+"and "+inputs[dep[di-1]].data("name")+").";
      }
      mess=mess+" Are you sure?";
      $("body").append("<div id='warn' class='dialog' title='Are you sure?'><p>"+mess+"</p></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Yes: function(){
              sources[src_edit].name=name;
              sources[src_edit].value=value;
              src_dialog.dialog("close");
              $(this).dialog("close");
              $("#warn").remove();
              edit_src_dialog.dialog("close");
              $("#Sources").click();
            },
            Cancel: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
    } else {
      sources[src_edit].name=name;
      sources[src_edit].value=value;
      src_dialog.dialog("close");
      $("#Sources").click();
      edit_src_dialog.dialog("close");
    }
  } else {
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if (ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){
        warn_str=warn_str+", "+warn[i];
      }
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the source is not valid.";
    $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      })
    })
  }
}

function edit_src_action_cancel(){
  edit_src_dialog.dialog("close");
}

function edit_inp_action_edit_input(){

  var warn=[], warn_str, ws, i, iof, cs=components.length;

  var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;

  var nom_regex=/^[0-9][.0-9]*$/;

  var name=$("#edit_inp_name").val().trim();

  var variable=$("#edit_inp_variable").val().trim();

  var label=$("#edit_inp_label").val().trim();

  var nominal=$("#edit_inp_nominal").val().trim();

  var random=$("#edit_inp_random").val().trim();

  if (name.length<=0){warn.push("name");}

  if ((variable.length<=0) || !variable_regex.test(variable)){warn.push("variable");}

  if (label.length<=0){warn.push("label");}

  if ((nominal.length<=0) || !(nom_regex.test(nominal))){warn.push("nominal value");}

  if ((random.length<=0) || !(nom_regex.test(random))){warn.push("random uncertainty");}

  if (warn.length==0){

    if(valid_variable(inputs, components, variable) || variable==inputs[inp_edit].data("variable")){

      var ow=50, oh=50, os=get_text_size(label);

      if(os[0]>ow){ow=Math.round(os[0])+10;}
      if(os[1]>oh){oh=Math.round(os[1])+10;}
      if(ow>oh){oh=ow;}
      else {ow=oh;}

      inputs[inp_edit].attr({rx:ow/2, ry:oh/2});

      inputs[inp_edit].data("name", name);

      if(inputs[inp_edit].data("variable")!=variable){
        for(i=0; i<cs; i++){
          components[i].data("fun",replace_var_expr(inputs[inp_edit].data("variable"), variable, components[i].data("fun")));
        }
      }

      inputs[inp_edit].data("variable", variable);

      inputs[inp_edit].data("label", label);

      inputs[inp_edit].data("nominal", nominal);

      inputs[inp_edit].data("nom_ds", Number(ds_nom));

      inputs[inp_edit].data("random", random);

      inputs[inp_edit].data("rand_ds", Number(ds_rand));

      inputs[inp_edit].data("sys_src", src_sys);

      input_labels[inp_edit].attr({width:ow, height:oh});

      input_labels[inp_edit].data("variable", variable);

      input_labels[inp_edit].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(label);

      calc_comp_nom();

      flags.J=false;

      flags.W=false;

      flags.Nu=false;

      flags.U=false;

      $("#u_sum").remove();

      flags.UMF=false;

      $("#umf_sum").remove();

      flags.UPC=false;

      $("#upc_sum").remove();

      edit_inp_dialog.dialog("close");

      edit_inp_dialog.dialog("close");
      inp_dialog.dialog("close");
      ds_nom=-1;
      ds_rand=-1;
      inp_edit=-1;
      src_sys=[];
      $("#Inputs").click();
    } else {
      $("body").append("<div id='warn' class='dialog' title='Warning'><p>Input variable must be unique.</p></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
    }
  } else {
    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if (ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){
        warn_str=warn_str+", "+warn[i];
      }
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the input is not valid.";
    $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      })
    })
  }
}

function edit_inp_action_cancel(){
  edit_inp_dialog.dialog("close");
}

function edit_comp_action_edit_component(){

  var warn=[], warn_str, ws, i, cs=components.length;

  var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;

  var name=$("#edit_comp_name").val().trim();

  var variable=$("#edit_comp_variable").val().trim();

  var label=$("#edit_comp_label").val().trim();

  var fun=$("#edit_comp_fun").val().trim();

  if (name.length<=0){warn.push("name");}

  if ((variable.length<=0) || !variable_regex.test(variable)){warn.push("variable");}

  if (label.length<=0){warn.push("label");}

  if (fun.length<=0 || get_dep(fun).length==0){warn.push("function");}

  if (warn.length==0){

    if(valid_variable(inputs, components, variable) || variable==components[comp_edit].data("variable")){

      var ow=50, oh=50, os=get_text_size(label);

      if(os[0]>ow){ow=Math.round(os[0])+10;}
      if(os[1]>oh){oh=Math.round(os[1])+10;}
      if(ow>oh){oh=ow;}
      else {ow=oh;}

      var ox=components[comp_edit].attr("x")+components[comp_edit].attr("width")/2-ow/2;
      var oy=components[comp_edit].attr("y")+components[comp_edit].attr("height")/2-oh/2;

      components[comp_edit].attr({x:ox, y:oy, width:ow, height:oh});

      components[comp_edit].data("name", name);

      if(components[comp_edit].data("variable")!=variable){

        for(i=0; i<cs; i++){
          components[i].data("fun",replace_var_expr(components[comp_edit].data("variable"), variable, components[i].data("fun")));
        }
      }

      components[comp_edit].data("variable", variable);

      components[comp_edit].data("label", label);

      components[comp_edit].data("fun", fun);

      component_labels[comp_edit].attr({x:components[comp_edit].attr("x")+ow/2, y:components[comp_edit].attr("y")+oh/2});

      component_labels[comp_edit].data("variable", variable);

      component_labels[comp_edit].node.getElementsByTagName("tspan")[0].innerHTML=svg_label(label);
      component_labels[comp_edit].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");

      var dep_var=get_dep(fun);

      var inp_var=get_inp_var();

      var comp_var=get_comp_var();

      var dvs=dep_var.length;

      var ivs=inp_var.length;

      var cvs=comp_var.length;

      var cs=connections.length;
      var nc=[];

      for(i=0; i<cs; i++){
        if(connections[i].to.data("variable")==variable){
          connections[i].line.remove();
          connections[i].arr.remove();
        } else {
          nc.push(connections[i]);
        }
      }
      connections=nc;

      for(i=0; i<ivs; i++){
        if($.inArray(inp_var[i],dep_var)!=-1){
          r.addcon(inputs[i],components[comp_edit]);
        }
      }

      for(i=0; i<cvs; i++){
        if($.inArray(comp_var[i],dep_var)!=-1){
          r.addcon(components[i],components[comp_edit]);
        }
      }

      calc_comp_nom();
      comp_edit=-1;

      flags.J=false;

      flags.W=false;

      flags.U=false;

      $("#u_sum").remove();

      flags.UMF=false;

      $("#umf_sum").remove();

      flags.UPC=false;

      $("#upc_sum").remove();

      edit_comp_dialog.dialog("close");
      comp_dialog.dialog("close");
      $("#Components").click();

    } else {

      $("body").append("<div id='warn' class='dialog' title='Warning'><p>Component variable must be unique.</p></div>");
      $(function(){
        $("#warn").dialog({
          modal: true,
          buttons: {
            Ok: function(){
              $(this).dialog("close");
              $("#warn").remove();
            }
          }
        })
      })
    }

  } else {

    ws=warn.length;
    warn_str="The ";
    if(ws==1){
      warn_str=warn_str+warn[0];
    } else if (ws==2){
      warn_str=warn_str+warn[0]+" and "+warn[1];
    } else{
      warn_str=warn_str+warn[0];
      for(i=1; i<ws-1; i++){
        warn_str=warn_str+", "+warn[i];
      }
      warn_str=warn_str+", and "+warn[ws-1];
    }
    warn_str=warn_str+" of the component is not valid."
    $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      })
    })
  }
}

function edit_comp_action_cancel(){
  edit_comp_dialog.dialog("close");
}



function del_ds_action_ok(){
  var i, ns=inputs.length;
  datasets.splice(ds_del, 1);
  for(i=0; i<ns; i++){
    if(inputs[i].data("nom_ds")==ds_del){
      inputs[i].data("nom_ds", -1);
    }
    if(inputs[i].data("rand_ds")==ds_del){
      inputs[i].data("rand_ds", -1);
    }
    if(inputs[i].data("nom_ds")>ds_del){
      inputs[i].data("nom_ds", inputs[i].data("nom_ds")-1);
    }
    if(inputs[i].data("rand_ds")>ds_del){
      inputs[i].data("rand_ds", inputs[i].data("rand_ds")-1);
    }
  }
  ds_del=-1;
  del_ds_dialog.dialog("close");
  ds_dialog.dialog("close");
  $("#Datasets").click();
}

function del_ds_action_cancel(){
  ds_del=-1;
  del_ds_dialog.dialog("close");
}

function del_src_action_ok(){
  var i, j, ss, ta=[], ns=inputs.length;
  sources.splice(src_del, 1);
  for(i=0; i<ns; i++){
    ss=inputs[i].data("sys_src").length;
    for(j=0; j<ss; j++){
      if(inputs[i].data("sys_src")[j]==src_del){
        ta=inputs[i].data("sys_src");
        ta.splice(j, 1);
        inputs[i].data("sys_src", ta);
        ta=[];
        ss--;
      }
    }
    ss=inputs[i].data("sys_src").length;
    for(j=0; j<ss; j++){
      if(inputs[i].data("sys_src")[j]>src_del){
        ta=inputs[i].data("sys_src");
        ta[j]=ta[j]-1;
        inputs[i].data("sys_src", ta);
        ta=[];
      }
    }
  }
  src_del=-1;
  del_src_dialog.dialog("close");
  src_dialog.dialog("close");
  $("#Sources").click();
}

function del_src_action_cancel(){
  src_del=-1;
  del_src_dialog.dialog("close");
}

function del_inp_action_yes(){
  inputs[inp_del].remove();
  input_labels[inp_del].remove();
  inputs.splice(inp_del,1);
  input_labels.splice(inp_del,1);
  flags.J=false;
  flags.W=false;
  flags.Nu=false;
  flags.U=false;
  $("#u_sum").remove();
  flags.UMF=false;
  $("#umf_sum").remove();
  flags.UPC=false;
  $("#upc_sum").remove();
  del_inp_dialog.dialog("close");
  inp_dialog.dialog("close");
  $("#Inputs").click();
}

function del_inp_action_no(){
  del_inp_dialog.dialog("close");
}

function del_comp_action_yes(){
  var ncon=connections.length, temp_con=[];
  for(i=0; i<ncon; i++){
    if(connections[i].to.data("variable")==components[comp_del].data("variable")){
      connections[i].line.remove();
      connections[i].arr.remove();
    } else {
      temp_con.push(connections[i]);
    }
  }
  connections=temp_con;
  components[comp_del].remove();
  component_labels[comp_del].remove();
  components.splice(comp_del,1);
  component_labels.splice(comp_del,1);
  flags.J=false;
  flags.W=false;
  flags.U=false;
  $("#u_sum").remove();
  flags.UMF=false;
  $("#umf_sum").remove();
  flags.UPC=false;
  $("#upc_sum").remove();
  del_comp_dialog.dialog("close");
  comp_dialog.dialog("close");
  $("#Components").click();
}

function del_comp_action_no(){
  del_comp_dialog.dialog("close");
}



function sum_ds_action_export_csv(){
  saveCSV(ds2CSV(),'datasets.csv');
}

function sum_ds_action_ok(){
  sum_ds_dialog.dialog("close");
}

function sum_src_action_export_csv(){
  saveCSV(src2CSV(),'sources.csv');
}

function sum_src_action_ok(){
  sum_src_dialog.dialog("close");
}

function sum_inp_action_export_csv(){
  saveCSV(inp2CSV(),'inputs.csv');
}

function sum_inp_action_ok(){
  sum_inp_dialog.dialog("close");
}

function sum_comp_action_export_csv(){
  saveCSV(comp2CSV(),'components.csv');
}

function sum_comp_action_ok(){
  sum_comp_dialog.dialog("close");
}

function sum_corr_action_export_csv(){
  saveCSV(corr2CSV(),'correlations.csv');
}

function sum_corr_action_ok(){
  sum_corr_dialog.dialog("close");
}

function sum_u_action_export_csv(){
  saveCSV(U2CSV(),'totu.csv');
}

function sum_u_action_ok(){
  sum_u_dialog.dialog("close");
}

function sum_umf_action_export_csv(){
  saveCSV(UMF2CSV(),'umf.csv');
}

function sum_umf_action_ok(){
  sum_umf_dialog.dialog("close");
}

function sum_upc_action_export_csv(){
  saveCSV(UPC2CSV(),'upc.csv');
}

function sum_upc_action_ok(){
  sum_upc_dialog.dialog("close");
}



function apply_ds_2_nom_action_ok(){
  ds_nom=$("input[name=ds]:checked").val();
  if(typeof ds_nom=="undefined"){
    $("body").append("<div id='warn' class='dialog' title='No Dataset Select'><p>No dataset selected. Please select a dataset before proceeding.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      })
    })
  } else {
    $("#add_inp_nominal").val(mu(datasets[ds_nom].values));
    $("#edit_inp_nominal").val(mu(datasets[ds_nom].values));
    apply_ds_2_nom_dialog.dialog("close");
  }
}

function apply_ds_2_nom_action_cancel(){
  ds_nom=-1;
  apply_ds_2_nom_dialog.dialog("close");
}

function apply_ds_2_rand_action_ok(){
  var n, mean;
  ds_rand=$("input[name=ds]:checked").val();
  if(typeof ds_rand=="undefined"){
    $("body").append("<div id='warn' class='dialog' title='No Dataset Select'><p>No dataset selected. Please select a dataset before proceeding.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      })
    })
  } else {
    n=num_samples(datasets[ds_rand].values);
    mean=mu(datasets[ds_rand].values);
    $("#add_inp_random").val(t_dist(n)*sig(datasets[ds_rand].values, mean)/Math.pow(n,1/2));
    $("#edit_inp_random").val(t_dist(n)*sig(datasets[ds_rand].values, mean)/Math.pow(n,1/2));
    apply_ds_2_rand_dialog.dialog("close");
  }
}

function apply_ds_2_rand_action_cancel(){
  ds_rand=-1;
  apply_ds_2_rand_dialog.dialog("close");
}

function apply_src_2_sys_action_ok(){
  var i, n, mess="", src_select=[];
  $(".src").each(function(i){
    if(this.checked){
      src_select.push(i);
    }
  });
  src_sys=src_select;
  n=src_sys.length;
  if(n==0){
    $("#src_select").text("No sources have been selected. If no source(s) are selected, a value of zero will be used.");
  } else if(n==1){
    $("#src_select").text("Source id "+src_sys[0]+" selected.");
  } else {
    mess="";
    for(i=0; i<n-1; i++){
      mess+=src_sys[i]+", ";
    }
    mess+=" and "+src_sys[n-1];
    $("#src_select").text("Source ids "+mess+" selected.");
  }
  apply_src_2_sys_dialog.dialog("close");
}

function apply_src_2_sys_action_cancel(){
  apply_src_2_sys_dialog.dialog("close");
}



function exit_action_yes(){
  $("body").empty();
  $("body").append("<div style='position:absolute; height:95%; width:95%; display:table'><h1 style='display:table-cell; vertical-align:middle; text-align:center;'>See you later!</h1></div>");
  $("#exit_dialog").dialog("close");
}

function exit_action_no(){
  $("#exit_dialog").dialog("close");
}

function new_action_yes(){
  $("#new_dialog").dialog("close");
  location.reload();
}

function new_action_no(){
  $("#new_dialog").dialog("close");
}

function save_action_save_as(){
  var filename=$("#save_filename").val().trim();
  if(filename.length>0){
    save_data(export_canvas(),filename+'.ujs');
    save_dialog.dialog("close");
  } else {
    $("body").append("<div id='warn' class='dialog' title='Warning'><p>Filename is required.</p></div>");
    $(function(){
      $("#warn").dialog({
        modal: true,
        buttons: {
          Ok: function(){
            $(this).dialog("close");
            $("#warn").remove();
          }
        }
      })
    })
  }
}

function save_action_cancel(){
  save_dialog.dialog("close")
}



function calc_u_action_view_results(){
  $("#sum_u").click();
  calc_u_dialog.dialog("close");
}

function calc_u_action_add_components(){
  $("#Components").click();
  calc_u_dialog.dialog("close");
}

function calc_u_action_add_inputs(){
  $("#Inputs").click();
  calc_u_dialog.dialog("close");
}

function calc_u_action_ok(){
  calc_u_dialog.dialog("close");
}

function calc_umf_action_view_results(){
  $("#sum_umf").click();
  calc_umf_dialog.dialog("close");
}

function calc_umf_action_add_components(){
  $("#Components").click();
  calc_umf_dialog.dialog("close");
}

function calc_umf_action_add_inputs(){
  $("#Inputs").click();
  calc_umf_dialog.dialog("close");
}

function calc_umf_action_ok(){
  calc_umf_dialog.dialog("close");
}

function calc_upc_action_view_results(){
  $("#sum_upc").click();
  calc_upc_dialog.dialog("close");
}

function calc_upc_action_add_components(){
  $("#Components").click();
  calc_upc_dialog.dialog("close");
}

function calc_upc_action_add_inputs(){
  $("#Inputs").click();
  calc_upc_dialog.dialog("close");
}

function calc_upc_action_ok(){
  calc_upc_dialog.dialog("close");
}










function calc_U(){
  if(!flags.U){
    if(inputs.length>0 && components.length>0){
      calc_J();
      calc_Nu();
      var Numat=math.matrix(Nu);
      var Jmat=math.matrix(J);
      var Cu=math.multiply(math.multiply(Jmat,Numat),math.transpose(Jmat));
      if(math.size(Cu).valueOf().length==0){
        U=[Math.pow(Cu,1/2)];
      } else {
        U=math.sqrt(math.diag(Cu)).valueOf();
      }
      flags.U=true;
    }
  }
  if($("#sum_u").length==0){
    if($("#sum_umf").length>0){
      $("<li><a id='sum_u'>Component Total Uncertainty Summary</a></li>").insertBefore($("#sum_umf").parent());
    } else if ($("#sum_upc").length>0){
      $("<li><a id='sum_u'>Component Total Uncertainty Summary</a></li>").insertBefore($("#sum_upc").parent());
    } else {
      $("#view").append("<li><a id='sum_u'>Component Total Uncertainty Summary</a></li>");
    }
  }
  $("#sum_u").click(function(){
    build_sum_u_dialog();
    sum_u_dialog.dialog("open");
    event.preventDefault();
  })
  return true;
}

function calc_UMF(){
  if(!flags.UMF){
    calc_J();
    var Jmat=math.matrix(J);
    var Nv=math.diag(math.matrix(dataToArray(inputs, "nominal")));
    var Cv=math.diag(math.matrix(dataToArray(components, "nominal")));
    UMF=math.multiply(math.multiply(math.inv(Cv),J),Nv).valueOf();
    flags.UMF=true;
  }
  if($("#sum_umf").length==0){
    if($("#sum_upc").length>0){
      $("<li><a id='sum_umf'>Component Uncertainty Magnification Factor Summary</a></li>").insertBefore($("#sum_upc").parent());
    } else {
      $("#view").append("<li><a id='sum_umf'>Component Uncertainty Magnification Factor Summary</a></li>");
    }
  }
  $("#sum_umf").click(function(){
    build_sum_umf_dialog();
    sum_umf_dialog.dialog("open");
    event.preventDefault();
  })
  return true;
}

function calc_UPC(){
  if(!flags.UPC){
    if(inputs.length>0 && components.length>0){
      calc_J();
      calc_W();
      calc_Nu();
      calc_U();
      var Wmat=math.matrix(W);
      var Numat=math.matrix(Nu);
      var Umat=math.diag(math.matrix(U));
      UPC=math.multiply(math.multiply(math.inv(math.square(Umat)),Wmat),Numat).valueOf();
      flags.UPC=true;
    }
  }
  if($("#sum_upc").length==0){
    $("#view").append("<li><a id='sum_upc'>Component Uncertainty Percent Contribution Summary</a></li>");
  }
  $("#sum_upc").click(function(){
    build_sum_upc_dialog();
    sum_upc_dialog.dialog("open");
    event.preventDefault();
  })
  return true;
}



function empty_calc_u_dialog(){
  $("#calc_u_dialog").empty();
}

function empty_calc_umf_dialog(){
  $("#calc_umf_dialog").empty();
}

function empty_calc_upc_dialog(){
  $("#calc_upc_dialog").empty();
}







function ds2CSV(){
  var i, n, mean, stdev, ds=datasets.length, str='id,name,N,mean,stdev\r\n';
  for(i=0; i<ds; i++){
    n=num_samples(datasets[i].values);
    mean=mu(datasets[i].values);
    stdev=sig(datasets[i].values, mean);
    str+=(i+1)+","+datasets[i].name+","+n+","+mean+","+stdev+'\r\n';
  }
  return str;
}

function src2CSV(){
  var i, n, ss=sources.length, str='id,name,value\r\n';
  for(i=0; i<ss; i++){
    str+=(i+1)+","+sources[i].name+","+sources[i].value+'\r\n';
  }
  return str;
}

function inp2CSV(){
  var i, j, ss, ns=inputs.length, str='id,name,variable,label,nominal,nominal ds,random,random ds,systematic src\r\n';
  for(i=0; i<ns; i++){
    str+=(i+1)+","+inputs[i].data("name")+","+inputs[i].data("variable")+",";
    str+=inputs[i].data("label")+","+inputs[i].data("nominal")+",";
    if(inputs[i].data("nom_ds")==-1){
      str+="0,";
    } else {
      str+=(inputs[i].data("nom_ds")+1)+",";
    }
    str+=inputs[i].data("random")+",";
    if(inputs[i].data("rand_ds")==-1){
      str+="0,";
    } else {
      str+=(inputs[i].data("rand_ds")+1)+",";
    }
    if(inputs[i].data("sys_src").length==0){
      str+="0";
    } else {
      ss=inputs[i].data("sys_src").length;
      for(j=0; j<ss-1; j++){
        str+=(inputs[i].data("sys_src")[j]+1)+" ";
      }
      str+=(inputs[i].data("sys_src")[ss-1]+1);
    }
    str+='\r\n';
  }
  return str;
}

function comp2CSV(){
  var i, cs=components.length, str='id,name,variable,label,function,nominal\r\n';
  for(i=0; i<cs; i++){
    str+=(i+1)+","+components[i].data("name")+","+components[i].data("variable")+",";
    str+=components[i].data("label")+","+components[i].data("fun")+",";
    str+=components[i].data("nominal")+'\r\n';
  }
  return str;
}

function corr2CSV(){
  var i, j, ns=inputs.length, nc, ncs, str='id,name,';
  nc=ns_nc().nc;
  ncs=nc.length;
  for(i=0; i<ncs-1; i++){
    str+="c"+(i+1)+",";
  }
  str+="c"+(ncs-1)+'\r\n';
  for(i=0; i<ns; i++){
    str+=(i+1)+","+inputs[i].data("name")+",";
    for(j=0; j<ncs-1; j++){
      str+=nc[j][i]+",";
    }
    str+=nc[ncs-1][i]+'\r\n';
  }
  return str;
}

function U2CSV(){
  var i, j, cs=components.length, str='id,component,total uncertainty,percent uncertainty\r\n';
  for(i=0; i<cs; i++){
    str+=(i+1)+","+components[i].data("variable")+","+U[i]+","+(100*U[i]/Number(components[i].data("nominal")))+'\r\n';
  }
  return str;
}

function UMF2CSV(){
  var i, is=inputs.length, cs=components.length, str='id,component';
  for(i=0; i<is; i++){
    str+=","+inputs[i].data("variable");
  }
  str+="\r\n";
  for(i=0; i<cs; i++){
    str+=(i+1)+","+components[i].data("variable");
    for(j=0; j<is; j++){
      str+=","+Math.abs(UMF[i][j]);
    }
    str+="\r\n";
  }
  return str;
}

function UPC2CSV(){
  var i, is=inputs.length, cs=components.length, str='id,component';
  for(i=0; i<is; i++){
    str+=","+inputs[i].data("variable");
  }
  str+="\r\n";
  for(i=0; i<cs; i++){
    str+=(i+1)+","+components[i].data("variable");
    for(j=0; j<is; j++){
      str+=","+Math.abs(100*UPC[i][j]);
    }
    str+="\r\n";
  }
  return str;
}




function t_dist(n){
  var i, vs, v=[], t=[];
  n=n-1;
  //for 95% confidence
  v=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,40,60,80,100,1000];
  t=[12.71,4.303,3.182,2.776,2.571,2.447,2.365,2.306,2.262,2.228,2.201,2.179,2.16,2.145,2.131,2.12,2.11,2.101,2.093,2.086,2.08,2.074,2.069,2.064,2.06,2.056,2.052,2.048,2.045,2.042,2.021,2,1.99,1.984,1.962];
  vs=v.length;
  if(n<=0 || isNaN(n)){
    return "Invalid degrees of freedom.";
  }
  for(i=0; i<vs-1; i++){
    if(v[i]==n){
      return t[i];
    } else if(v[i]<n && v[i+1]>n){
      return ((n-v[i])/(v[i+1]-v[i]))*(t[i+1]-t[i])+t[i];
    }
  }
  return t[t.length-1];
}

function ds_str_2_arr(str){
  var str, str_arr, n, i;
  str=str.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "");
  str_arr=str.split("\n");
  n=str_arr.length;
  for(i=0; i<n; i++){
    str_arr[i]=Number(str_arr[i].trim());
  }
  return str_arr;
}

function num_samples(str_arr){
  return str_arr.length;
}

function mu(str_arr){
  var i, n, mean=0;
  n=num_samples(str_arr);
  for(i=0; i<n; i++){
    mean=mean+str_arr[i];
  }
  return mean/n;
}

function sig(str_arr, mean){
  var i, n, stdev=0;
  n=num_samples(str_arr);
  for(i=0; i<n; i++){
    stdev=stdev+Math.pow(str_arr[i]-mean, 2);
  }
  return Math.pow(stdev/(n-1), 1/2);
}

function inp_by_sys_mat(){
  var i, j, res=[], ns=inputs.length, ss=sources.length;
  for(i=0; i<ns; i++){
    res[i]=[];
    for(j=0; j<ss; j++){
      if($.inArray(j+1, inputs[i].data("sys_src"))>=0){
        res[i].push(sources[j].value);
      } else {
        res[i].push(0);
      }
    }
  }
  return res;
}

function ns_nc(){
  var i, j, counter, nsm, u=[], c=[], cs, ns=inputs.length, ss=sources.length;
  nsm=inp_by_sys_mat();
  for(i=0; i<ns; i++){
    u.push(0);
  }
  for(i=0; i<ss; i++){
    counter=0;
    for(j=0; j<ns; j++){
      if(nsm[j][i]!=0){
        counter++;
      }
      if(counter>1){
        j=ns;
      }
    }
    if(counter==1){
      for(j=0; j<ns; j++){
        if(nsm[j][i]!=0){
          u[j]+=Math.pow(nsm[j][i],2);
        }
      }
    }
  }

  for(i=0; i<ns; i++){
    u[i]=Math.pow(u[i],1/2);
  }

  for(i=0; i<ss; i++){
    counter=0;
    for(j=0; j<ns; j++){
      if(nsm[j][i]!=0){
        counter++;
      }
    }
    if(counter>1){
      c.push([]);
      cs=c.length;
      for(j=0; j<ns; j++){
        if(nsm[j][i]!=0){
          c[cs-1].push(nsm[j][i]);
        } else {
          c[cs-1].push(0);
        }
      }
    }
  }
  return {ns:u, nc:c};
}

function svg_label(label){
  label=label.replace(/<sub>/g, "<tspan baseline-shift='sub'>");
  label=label.replace(/<sup>/g, "<tspan baseline-shift='super'>");
  temp=label.replace(/<\/sub>/g, "</tspan>");
  label=label.replace(/<\/sup>/g, "</tspan>");
  return label;
}

function save_data(data, filename){

  var a=document.createElement("a");

  document.body.appendChild(a);

  a.id='file_download';

  a.style="display: none";

  var json=JSON.stringify(data);

  var blob=new Blob([json], {type: "octet/stream"});

  var url=window.URL.createObjectURL(blob);

  a.href=url;

  a.download=filename;

  a.click();

  window.URL.revokeObjectURL(url);

  $("#file_download").remove();
};







function after_obj(variable){
  var i, cs=connections.length;
  for(i=0; i<cs; i++){
    if(connections[i].from.data("variable")==variable){
      connections[i].to.attr({stroke:'#990000', fill:'#FFE5E5'});
      connections[i].line.attr({stroke:'#990000'});
      connections[i].arr.attr({stroke:'#990000', fill: '#990000'})
      after_obj(connections[i].to.data("variable"));
    }
  }
}

function before_obj(variable){
  var i, cs=connections.length;
  for(i=0; i<cs; i++){
    if(connections[i].to.data("variable")==variable){
      connections[i].from.attr({stroke:'#009900', fill:'#e5ffe5'});
      connections[i].line.attr({stroke:'#009900'});
      connections[i].arr.attr({stroke:'#009900', fill:'#009900'});
      before_obj(connections[i].from.data("variable"));
    }
  }
}

function build_canvas(sys){

  var inp=('inp' in sys)?sys.inp:[];

  var comp=('comp' in sys)?sys.comp:[];

  var ds=('ds' in sys)?sys.ds:[];

  var src=('src' in sys)?sys.src:[];

  J=('J' in sys)?sys.J:[];

  W=('W' in sys)?sys.W:[];

  Nu=('Nu' in sys)?sys.Nu:[];

  U=('U' in sys)?sys.U:[];

  UMF=('UMF' in sys)?sys.UMF:[];

  UPC=('UPC' in sys)?sys.UPC:[];

  flags=('flags' in sys)?sys.flags:{info:false, before:false, after:false, cor:false, J:false, W:false, Nu:false, U:false, UMF:false, UPC:false};

  var is=inp.length, cs=comp.length, dss=ds.length, ss=src.length;

  var i1, i2;

  for(i1=0; i1<is; i1++){
    var ox=inp[i1].ox;
    var oy=inp[i1].oy;
    var ow=inp[i1].ow;
    var oh=inp[i1].oh;
    var name=inp[i1].name;
    var variable=inp[i1].variable;
    var label=inp[i1].label;
    var nominal=inp[i1].nominal;
    var nom_ds=inp[i1].nom_ds;
    var random=inp[i1].random;
    var rand_ds=inp[i1].rand_ds;
    var sys_src=inp[i1].sys_src;
    r.addobj({type:"ellipse", x:ox, y:oy, w:ow, h:oh, name:name, variable:variable, label:label, nominal:nominal, nom_ds:nom_ds, random:random, rand_ds:rand_ds, sys_src:sys_src});
  }

  for(i1=0; i1<cs; i1++){
    var ox=comp[i1].ox;
    var oy=comp[i1].oy;
    var ow=comp[i1].ow;
    var oh=comp[i1].oh;
    var name=comp[i1].name;
    var variable=comp[i1].variable;
    var label=comp[i1].label;
    var fun=comp[i1].fun;
    r.addobj({type:"rect", x:ox, y:oy, w:ow, h:oh, name:name, variable:variable, label:label, fun:fun});
    var dep_var=get_dep(fun);
    var inp_var=get_inp_var();
    var comp_var=get_comp_var();
    var dvs=dep_var.length;
    var ivs=inp_var.length;
    var cvs=comp_var.length;
    for(i2=0; i2<ivs; i2++){
      if($.inArray(inp_var[i2],dep_var)!=-1){
        r.addcon(inputs[i2],components[i1]);
      }
    }
    for(i2=0; i2<cvs; i2++){
      if($.inArray(comp_var[i2],dep_var)!=-1){
        r.addcon(components[i2],components[i1]);
      }
    }
  }
  for(i1=0; i1<dss; i1++){
    var name=ds[i1].name;
    var values=ds[i1].values;
    datasets.push({name: name, values: values});
  }
  for(i1=0; i1<ss; i1++){
    var name=src[i1].name;
    var value=src[i1].value;
    sources.push({name: name, value: value});
  }

  calc_comp_nom();

  viewbox=sys.viewbox;

  zoom=sys.zoom;

  r.setViewBox.apply(r, viewbox);
}

function build_exit_dialog(){
  $("#exit_dialog").append("<p>All unsaved work will be lose. Do you want to continue?</p>");
}

function build_new_dialog(){
  $("#new_dialog").append("<p>All unsaved work will be lose. Do you want to continue?</p>");
}

function build_save_dialog(){
  $("#save_dialog").append("<p>Filename:</p>");
  $("#save_dialog").append("<form></form>");
  $("#save_dialog form").append("<input id='save_filename'>");
  $("#save_dialog form input").attr("type", "text");
  $("#save_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
}

function build_toolbar(){

  if(flags.info){
    $("#toolbar").append("<input type='checkbox' id='tb_tip' checked><label class='small_button' for='tb_tip'>Toggle Element Info</label>");
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_tip'><label class='small_button' for='tb_tip'>Toggle Element Info</label>");
  }

  if(flags.before){
    $("#toolbar").append("<input type='checkbox' id='tb_before' checked><label class='small_button' for='tb_before'>Toggle Dependencies View (Green)</label>");
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_before'><label class='small_button' for='tb_before'>Toggle Dependencies View (Green)</label>");
  }

  if(flags.after){
    $("#toolbar").append("<input type='checkbox' id='tb_after' checked><label class='small_button' for='tb_after'>Toggle Dependencies View (Red)</label>");
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_after'><label class='small_button' for='tb_after'>Toggle Dependencies View (Red)</label>");
  }

  if(flags.cor){
    $("#toolbar").append("<input type='checkbox' id='tb_cor' checked><label class='small_button' for='tb_cor'>Toggle Correlation View (Blue)</label>");
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_cor'><label class='small_button' for='tb_cor'>Toggle Correlation View (Blue)</label>");
  }
  $("#toolbar").append("<button id='tb_ds' class='small_button'>Dataset</button>");
  $("#toolbar").append("<button id='tb_src' class='small_button'>System Uncertainty Source</button>");
  $("#toolbar").append("<button id='tb_inp' class='small_button'>Input</button>");
  $("#toolbar").append("<button id='tb_comp' class='small_button'>Component</button>");
  $("#tb_tip").button({
    icons: {
      primary: "ui-icon-comment"
    },
    text: false,
    label: 'Toogle Element Info'
  });
  $("#tb_before").button({
    icons: {
      primary: "ui-icon-arrowstop-1-w"
    },
    text: false,
    label: 'Toggle Dependency View (Green)'
  });
  $("#tb_after").button({
    icons: {
      primary: "ui-icon-arrowstop-1-e"
    },
    text: false,
    label: 'Toggle Dependency View (Red)'
  });
  $("#tb_cor").button({
    icons: {
      primary: "ui-icon-arrow-2-e-w"
    },
    text: false,
    label: 'Toggle Correlation View (Blue)'
  });
  $("#tb_ds").button({
    icons: {
      primary: "ds"
    },
    text: false,
    label: 'Dataset'
  });
  $("#tb_src").button({
    icons: {
      primary: "src"
    },
    text: false,
    label: 'Systematic Uncertainty Source'
  });
  $("#tb_inp").button({
    icons: {
      primary: "inp"
    },
    text: false,
    label: 'Input'
  });
  $("#tb_comp").button({
    icons: {
      primary: "comp"
    },
    text: false,
    label: 'Component'
  });
  $("#tb_tip").click(function(){
    if(flags.info){
      $("#tip").css("display", "none");
      $("#toggle_tip").html("View Element Info");
      flags.info=false;
    } else {
      $("#toggle_tip").html("Hide Element Info");
      flags.info=true;
    }
  });
  $("#tb_before").click(function(){
    if(flags.before){
      $("#toggle_before").html("View Dependency View (Green)");
      flags.before=false;
    } else {
      $("#toggle_before").html("Hide Dependency View (Green)");
      flags.before=true;
    }
  });
  $("#tb_after").click(function(){
    if(flags.after){
      $("#toggle_after").html("View Dependency View (Red)");
      flags.after=false;
    } else {
      $("#toggle_after").html("Hide Dependency View (Red)");
      flags.after=true;
    }
  });
  $("#tb_cor").click(function(){
    if(flags.cor){
      $("#toggle_correlation").html("View Correlation View (Blue)");
      flags.cor=false;
    } else {
      $("#toggle_correlation").html("Hide Correlation View (Blue)");
      flags.cor=true;
    }
  });
  $("#tb_ds").click(function(){
    $("#Datasets").click();
    event.preventDefault();
  });
  $("#tb_src").click(function(){
    $("#Sources").click();
    event.preventDefault();
  });
  $("#tb_inp").click(function(){
    $("#Inputs").click();
    event.preventDefault();
  });
  $("#tb_comp").click(function(){
    $("#Components").click();
    event.preventDefault();
  });
}

function calc_comp_nom(){

  var i, is=inputs.length, cs=components.length;
  var noms=[], p=math.parser();

  for(i=0; i<is; i++){

    p.eval(inputs[i].data("variable")+"="+inputs[i].data("nominal"));
  }

  for(i=0; i<cs; i++){

    components[i].data("nominal",p.eval(components[i].data("variable")+"="+components[i].data("fun")));
  }
}

function calc_J(){
  if(!flags.J){
    if(inputs.length>0 && components.length>0){
      var inp_nom=dataToArray(inputs, "nominal");
      var inp_var=dataToArray(inputs, "variable");
      var comp_var=dataToArray(components, "variable");
      var com_fun=dataToArray(components, "fun");
      var i1, i2, J_inp, J_com, comp_nom=[], J_inp_com=[], J_temp=[], c_j, r;
      var il=inp_var.length;
      var cl=comp_var.length;
      var icl=il+cl;
      var p=math.parser();
      for(i1=0; i1<il; i1++){
        p.eval(inp_var[i1]+"="+inp_nom[i1]);
      }
      for(i1=0; i1<cl; i1++){
        comp_nom.push(p.eval(comp_var[i1]+"="+com_fun[i1]));
      }
      var inp_comp_nom=inp_nom.concat(comp_nom);
      var inp_comp_var=inp_var.concat(comp_var);
      var inp_com_args=inp_comp_var.join();
      var c=math.complex(inp_comp_nom);
      p.clear();
      for(i1=0; i1<cl; i1++){
        p.eval(comp_var[i1]+"("+inp_com_args+")="+com_fun[i1]);
      }
      for(i1=0; i1<icl; i1++){
        J_temp=[];
        if(i1!=0) {c[i1-1].im=0;}
        c[i1].im=Number.EPSILON;
        c_j=c.join();
        for(i2=0; i2<cl; i2++){
          r=p.eval(comp_var[i2]+"("+c_j+")").im/Number.EPSILON;
          if(r){J_temp.push(r);}
          else {J_temp.push(0);}
        }
        J_inp_com.push(J_temp);
      }
      J_inp_com=math.transpose(math.matrix(J_inp_com));
      J_inp=J_inp_com.subset(math.index(math.range(0,cl),math.range(0,il)));
      J_com=J_inp_com.subset(math.index(math.range(0,cl),math.range(il,icl)));
      J=math.multiply(math.inv(math.add(math.eye(cl),math.multiply(-1,J_com))),J_inp);
      J=J.valueOf();
      flags.J=true;
    }
  }
  return true;
}

function calc_Nu(){
  if(!flags.Nu){
    if(inputs.length>0 && components.length>0){
      var rn=dataToArray(inputs, "random");
      var i1, i2, ns=inputs.length;
      var Ns, Nr, Nc;
      var nsc=ns_nc();
      Ns=math.diag(math.matrix(nsc.ns));
      Nc=nsc.nc;
      if(Nc.length>0){
        Nc=math.matrix(Nc);
        Ns=math.concat(Ns,Nc);
      }
      Ns=math.multiply(Ns,math.transpose(Ns));
      Nr=math.diag(math.matrix(rn));
      Nr=math.multiply(Nr,math.transpose(Nr));
      Nu=math.add(Nr,Ns);
      if(math.size(Nu).valueOf().length==0){
        Nu=[Nu.valueOf()];
      } else {
        Nu=Nu.valueOf();
      }
      flags.Nu=true;
    }
  }
  return true;
}

function calc_W(){
  if(!flags.W){
    if(inputs.length>0 && components.length>0){
      calc_J();
      var Jmat=math.matrix(J);
      W=math.square(Jmat).valueOf();
      flags.W=true;
    }
  }
  return true;
}

function dataToArray(obj, prop){
  var i, arr=[], ol=obj.length;
  for(i=0; i<ol; i++){
    arr.push(obj[i].data(prop));
  }
  return arr;
}

function empty_canvas(){
  var i, ni=inputs.length, nc=components.length, ncon=connections.length;
  for(i=0; i<ni; i++){
    inputs[i].remove();
    input_labels[i].remove();
  }
  inputs=[];
  input_labels=[];
  for(i=0; i<nc; i++){
    components[i].remove();
    component_labels[i].remove();
  }
  components=[];
  component_labels=[];
  for(i=0; i<ncon; i++){
    connections[i].to.remove();
    connections[i].from.remove();
    connections[i].line.remove();
    connections[i].arr.remove();
  }
  connections=[];
}

function empty_exit_dialog(){
  $("#exit_dialog").empty();
}

function empty_new_dialog(){
  $("#new_dialog").empty();
}

function empty_save_dialog(){
  $("#save_dialog").empty();
}

function empty_toolbar(){
  $("#toolbar").empty();
}

function engFormat(num){
  if(num==0){
    return 0;
  } else {
    return num.toExponential(3);
  }
}

function export_canvas(){
  var is=inputs.length, cs=components.length, ds=datasets.length, ss=sources.length;
  var exp={inp:[], comp:[], ds:[], src:[], J:[], viewbox:viewbox, zoom:zoom, flags:[], W:[], Nu:[], U:[], UMF:[], UPC:[]};
  var i;
  for(i=0; i<is; i++){
    var ox=inputs[i].attr("cx")-inputs[i].attr('rx');
    var oy=inputs[i].attr("cy")-inputs[i].attr('ry');
    var ow=inputs[i].attr("rx")*2;
    var oh=inputs[i].attr("ry")*2;
    var name=inputs[i].data("name");
    var variable=inputs[i].data("variable");
    var label=inputs[i].data("label");
    var nominal=inputs[i].data("nominal");
    var nom_ds=inputs[i].data("nom_ds");
    var random=inputs[i].data("random");
    var rand_ds=inputs[i].data("rand_ds");
    var sys_src=inputs[i].data("sys_src");
    exp.inp.push({'ox':ox, 'oy':oy, 'ow':ow, 'oh':oh, 'name':name, 'variable':variable, 'label':label, 'nominal':nominal, 'nom_ds':nom_ds, 'random':random, 'rand_ds':rand_ds, 'sys_src':sys_src});
  }
  for(i=0; i<cs; i++){
    var ox=components[i].attr("x");
    var oy=components[i].attr("y");
    var ow=components[i].attr("width");
    var oh=components[i].attr("height");
    var name=components[i].data("name");
    var variable=components[i].data("variable");
    var label=components[i].data("label");
    var fun=components[i].data("fun");
    exp.comp.push({'ox':ox, 'oy':oy, 'ow':ow, 'oh':oh, 'name':name, 'variable':variable, 'label':label, 'fun':fun});
  }
  for(i=0; i<ds; i++){
    var name=datasets[i].name;
    var values=datasets[i].values;
    exp.ds.push({name: name, values: values});
  }
  for(i=0; i<ss; i++){
    var name=sources[i].name;
    var value=sources[i].value;
    exp.src.push({name: name, value: value});
  }
  exp.flags.push(flags);
  if(flags.J){exp.J.push(J);}
  if(flags.W){exp.W.push(W);}
  if(flags.Nu){exp.Nu.push(Nu);}
  if(flags.U){exp.U.push(U);}
  if(flags.UMF){exp.UMF.push(UMF);}
  if(flags.UPC){exp.UPC.push(UPC);}
  return exp;
}

function get_dep(expr){

  var constants=['e','E','i','Infinity','LN2','LN10','LOG2E','LOG10E','phi',
                 'pi','PI','SQRT1_2','SQRT2','tau','version'];

  var node=math.parse(expr);
  var dep_var=[];
  node.filter(function(node){
    if(node.isSymbolNode && $.inArray(node.name,constants)==-1){
      dep_var.push(node.name);
    }
  })
  return $.unique(dep_var);
}

function get_comp_var(){
  var comp_var=[];
  var i, cs=components.length;
  if(cs!=0){
    for(i=0; i<cs; i++){
      comp_var.push(components[i].data("variable"));
    }
    return comp_var;
  } else {
    return false;
  }
}

function get_inp_var(){
  var inp_var=[];
  var i, is=inputs.length;
  if(is!=0){
    for(i=0; i<is; i++){
      inp_var.push(inputs[i].data("variable"));
    }
    return inp_var;
  } else {
    return false;
  }
}

function get_text_size(txt){
  $("body").append("<span id='ruler' style='visibility:hidden; white-space:nowrap;'>"+txt+"</span>");
  var s=[$("#ruler").width(), $("#ruler").height()];
  $("#ruler").remove();
  return s;
}

function replace_var_expr(var_from, var_to, expr){

  var constants=['e','E','i','Infinity','LN2','LN10','LOG2E','LOG10E','phi',
                 'pi','PI','SQRT1_2','SQRT2','tau','version'];

  var node=math.parse(expr);
  var dep_var=[];
  node.filter(function(n){
    if(n.isSymbolNode && $.inArray(n.name,constants)==-1){
      if(n.name==var_from){
        n.name=var_to;
      }
    }
  })
  return node.toString().replace(/\s/g, '');
}

function reset_obj_color(){
  var is=inputs.length, cs=components.length, cons=connections.length;
  var i;
  for(i=0; i<is; i++){
    inputs[i].attr({stroke:'#000000', fill:'#FFFFFF'});
  }
  for(i=0; i<cs; i++){
    components[i].attr({stroke:'#000000', fill:'#FFFFFF'});
  }
  for(i=0; i<cons; i++){
    connections[i].line.attr({stroke:'#000000'});
    connections[i].arr.attr({stroke:'#000000', fill:'#000000'});
  }
}

function saveCSV(str,filename){
  var a=document.createElement("a");
  document.body.appendChild(a);
  a.id='file_download';
  a.style="display: none";
  a.target="_blank";
  a.download=filename;
  var csvData="data:application/csv;charset=utf-8,"+encodeURIComponent(str);
  a.href=csvData;
  a.click();
  $("#file_download").remove();
}

function valid_variable(inputs, components, variable){
  var i, is=inputs.length-1, cs=components.length-1;
  for(i=0; i<=is ;i++){
    if(inputs[i].data("variable")==variable){return false;}
  }
  for(i=0; i<=cs ;i++){
    if(components[i].data("variable")==variable){return false;}
  }
  return true;
}

function varID(array, variable){
  var as=array.length-1, i;
  for(i=0; i<=as; i++){
    if(array[i].data("variable")==variable){
      return i;
    }
  }
  return false;
}

function wheel(event) {
  var delta=0;
  if (!event) {event=window.event;}
  if (event.wheelDelta) {delta=event.wheelDelta/120;}
  else if (event.detail) {delta=-event.detail/3;}
  if (delta){
      x=Number(viewbox[0])+Number((event.clientX - $("#holder").offset().left)/zoom);
      y=Number(viewbox[1])+Number((event.clientY - $("#holder").offset().top)/zoom);
      if (delta<0) {delta=0.95;}
      else {delta=1.05;}
      zoom=((zoom||1)*delta)||1;
      if(zoom>10){
        zoom=10;
      } else if (zoom<0.1){
        zoom=0.1;
      }
      viewbox[0]=x-(event.clientX - $("#holder").offset().left)/zoom;
      viewbox[1]=y-(event.clientY - $("#holder").offset().top)/zoom;
      viewbox[2]=$("#holder").width()/zoom;
      viewbox[3]=$("#holder").height()/zoom;
      r.setViewBox.apply(r, viewbox);
  }
  if (event.preventDefault) {event.preventDefault();}
  event.returnValue = false;
}
