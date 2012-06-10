require(["app/BumpRecord"], function(BumpRecord) {
    
var bumpsTest0 = new BumpRecord();
bumpsTest0.addBump(2000, 20);
bumpsTest0.addBump(4000, 20);
bumpsTest0.addBump(6000, 20);
bumpsTest0.addBump(8000, 20);
bumpsTest0.addBump(10000, 20);

var bumpsTest1 = new BumpRecord();
bumpsTest1.addBump(2010, 20);
bumpsTest1.addBump(4010, 20);
bumpsTest1.addBump(6010, 20);
bumpsTest1.addBump(8010, 20);
bumpsTest1.addBump(10010, 20);

document.getElementById("result1").innerHTML = bumpsTest0.compare(bumpsTest1);
document.getElementById("result2").innerHTML = bumpsTest0.compareRange(bumpsTest1, 5000, 9000);

});