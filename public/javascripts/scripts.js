var currentresults; 
var pg = document.querySelectorAll(".page")

$(".page:eq(0)").fadeIn();

function s(a, selector) {
	var pg = document.querySelectorAll(selector)
	console.log("fade out")
	$(selector).fadeOut(0);
	var pg = document.querySelectorAll(selector)
	$(""+selector+":eq(" + a + ")").fadeIn(800);

	current = a;
	console.log(a);
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
template = function (l, object) {
	//define the return array
	returnArray = [];
	//get the element's inner html so you can insert the JSON data
	const element = document.querySelector(l).innerHTML;
	//for loop, for every object in the object variable, replaces any key that is referenced in the element as {{key}}.
	for (var i = 0; i < object.length; i++) {
		//grab the names of all the json objects
		r = Object.keys(object[i]);
		//console.log(r)

		var tem = element;
		//for every object in the json list,
		for (var a = 0; a < r.length; a++) {
			b = "object[" + i.toString() + "]." + r[a];
			c = eval(b);
			tem = tem.replaceAll("{{" + r[a] + "}}", c);
		}
		//push that index of
		returnArray.push(tem);

	}
	document.querySelector(l).innerHTML = returnArray.join(" ");
};
const temp = document.querySelector("#template").innerHTML ;
function search(term){
data =   (function() { var result; $.ajax({ type:'GET', url:"/api/search/"+term+"", dataType:'json', async:false, success:function(data){ result = data; } }); return result; })();
//document.querySelector(".mdl-card__title-text").innerHTML = data.name;

artistText = "";
document.querySelector("#template").innerHTML = temp;
//document.querySelector("#artists").innerHTML = artistText;
template("#template", data);
s(0,".page")
}

$('#fixed-header-drawer-exp').keyup(function(e){
    if(e.keyCode == 13)
    {
    search(document.querySelector("#fixed-header-drawer-exp").value);
    }
});

search("bts")

$('#fixed-header-drawer-exp').keyup(function(e){
    if(e.keyCode == 13)
    {
    search(document.querySelector("#fixed-header-drawer-exp").value);
    }
});
var path = window.location.hash;
 path = path.replace("#!/", "").split("/")[0];
console.log(path);
var route = function(s, callback){
    if (callback===undefined){
        window.location.hash = "#!/" + s;
    }
    else{
    t = window.location.hash;
    t = t.replace("#!/", "").split("/")[0];
    if (s === t){

        callback();
    }
    else{
    }
    }
}
function ds(selector){
	return document.querySelector(selector);
}
function dsa(selector){
	return document.querySelectorAll(selector);
}

const tracklist = document.querySelector("#tracklist").innerHTML ;
function setUpAlbum(data){
	document.querySelector("#jumbotron").style.backgroundImage = "url('"+data.coverBig+"')";
document.querySelector("#artist").innerHTML = data.artist.name
	document.querySelector("#title").innerHTML = data.name;

	console.log(data)
	document.querySelector("#tracklist").innerHTML = tracklist;
	//document.querySelector("#artists").innerHTML = artistText;
	template("#tracklist", data.songList);
	for (i = 0; i < dsa(".albumResultsSong").length; i++){
		dsa(".albumResultsSong")[i].style.backgroundImage = "url('"+data.coverBig+"')";

	}
}


function albumLink(t){

      s(1, ".page");

      data =   (function() { var result; $.ajax({ type:'GET', url:"/api/album/"+t+"", dataType:'json', async:false, success:function(data){ result = data; } }); return result; })();
			setUpAlbum(data);
}
function album(){

      s(1, ".page");
      t = window.location.hash;
      t = t.replace("#!/", "").split("/")[1];
      data =   (function() { var result; $.ajax({ type:'GET', url:"/api/album/"+t+"", dataType:'json', async:false, success:function(data){ result = data; } }); return result; })();
setUpAlbum(data);
}
startroutes = function(){
route("album", album);
}
startroutes();
