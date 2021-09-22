const MAJOR    = "0";
const MINOR    = "8";
const REVISION = "6";
const VERSION  = "v" + MAJOR + "." + MINOR + "." + REVISION;
const PRE      = "FC " + VERSION;

caminho(process.argv.slice(2))

function caminho (arg)
{
	const io = require("socket.io-client");
	const socket = io("ws://localhost:8330");
	socket.send(PRE + " chain '$teste' genesis\n");
	console.log(PRE + " chain $teste genesis");
//	socket.on("message", data => {  console.log(data);});
}
