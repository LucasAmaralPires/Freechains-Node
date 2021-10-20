const MAJOR    = "0";
const MINOR    = "8";
const REVISION = "6";
const VERSION  = "v" + MAJOR + "." + MINOR + "." + REVISION;
const PRE      = "FC " + VERSION;
const ERROR	   = ["Sucess", "Command not recognized", "Invalid Number of Arguments", "Invalid Port Number", "Unable to Read File", "Need private key"];
const HELP = `
Usage:

Host:
    freechains-host start <dir>
    freechains-host stop
    freechains-host path
    
Client:
    freechains chains join  <chain> [<key>...]
    freechains chains leave <chain>
    freechains chains list
    freechains chains listen
    
    freechains chain <name> genesis
    freechains chain <name> heads [blocked]
    freechains chain <name> get (block | payload) <hash> [file <path>]
    freechains chain <name> post (inline | file) [<path_or_text>]
    freechains chain <name> (like | dislike) <hash>
    freechains chain <name> reps <hash_or_pub>
    freechains chain <name> traverse <hashes>...
    freechains chain <name> listen
    
    freechains peer <addr:port> ping
    freechains peer <addr:port> chains
    freechains peer <addr:port> (send | recv) <chain>
    freechains crypto (shared | pubpvt) <passphrase>
    
Options:
    --help              [none]            displays this help
    --version           [none]            displays software version
    --host=<addr:port>  [all]             sets host address and port to connect, always use at the end [default: localhost:$PORT_8330]
    --port=<port>       [all]             sets host port to connect, always use at the end [default: $PORT_8330]
    --sign=<pvt>        [post|(dis)like]  signs post with given private key
    --encrypt           [post]            encrypts post with public key (only in public identity chains)
    --decrypt=<pvt>     [get]             decrypts post with private key, at the end but before host/port (only in public identity chains)
    --why=<text>        [(dis)like]       explains reason for the like

More Information:
    http://www.freechains.org/
    Please report bugs at <http://github.com/Freechains/README/>.
`
var port = 8330;
var addr = "localhost";
var like = 1;
var fs = require("fs");

/*
 * TODO:
 * Permitir utilizar host nao padrao em freechains-host host start
 * Não travar o programa no freechains-host start
 * Resolver o problema da sincronia
 * Perguntar para o professor sobre o traverse
 */

if(require.main === module)
{
	main(process.argv.slice(2));
}

function main (argumentos)
{
 	for (input of argumentos)
	{
		if(typeof input !== "string") console.error(ERROR[1]);
		return;
	}
	if(argumentos[0] === "freechains" || argumentos[0] === "freechains-host")
	{
		if(argumentos[1] === "--help") console.log(HELP);
		else if(argumentos[1] === "--version") console.log(VERSION);
		if(argumentos[argumentos.length-1].substring(0,7) === "--port=")
		{
			port = parseInt(argumentos[argumentos.length-1].substring(7));
			if(port < 1024 || port > 65535) console.error(ERROR[3]);
			argumentos.pop()
		}
		else if(argumentos[argumentos.length-1].substring(0,7) === "--host=")
		{
			let split = argumentos[argumentos.length-1].substring(7).split(":");
			host = split[0];
			port = parseInt(split[1]);
			if(port < 1024 || port > 65535) console.error(ERROR[3]);
			argumentos.pop()
		}
		if(argumentos[0] === "freechains") command_freechains(argumentos);
		else command_freechains_host(argumentos);
	}
	else console.error(ERROR[1]);
}

function socket_connection(message, listen = false, get = false, tofile = undefined)
{
	const net = require('net');
	const client = net.createConnection(port, addr);
	var buffer = "";
	client.write(message);

	if(listen === false) client.setTimeout(1000);
	if(get === true) 
	{
		if(tofile) var wfile = fs.createWriteStream(tofile, {flags: 'a'});
		buffer = "Number of bytes: "
	}

	client.on('data', (data) => 
	{
		buffer += data.toString();
		if (listen === true)
		{
			process.stdout.write(buffer);
			buffer = "";
		}
	});
	
	client.on('timeout', () => {
		process.stdout.write(buffer);
		if(typeof tofile === 'string') wfile.write(buffer);
		client.unref()
	});
}

function command_freechains_host (arg)
{
	switch (arg[1])
	{
		case "start":
			if(assert_size([2,3], arg.length, ERROR[2])) return;
			const { exec } = require("child_process");
			exec(`freechains-host start ${arg[2]} --port=${port} &`);
			return;
		case "stop":
			if(assert_size([2], arg.length, ERROR[2])) return;
			socket_connection(`${PRE} host stop\n`);
			break;
		case "path":
			if(assert_size([2], arg.length, ERROR[2])) return;
			socket_connection(`${PRE} host path\n`);
			break;
		default:
			console.error(ERROR[1]);
	}
}

function command_freechains (arg)
{
	switch (arg[1])
	{
		case "crypto":
			if(assert_size([4], arg.length, ERROR[2])) return;
			socket_connection(`${PRE} crypto ${arg[2]}\n${arg[3]}\n`);
			break;
		case "peer":
			if(assert_size([4,5], arg.length, ERROR[2])) return;
			var remote = arg[2];
			switch(arg[3])
			{
				case "ping":
					if(assert_size([4], arg.length, ERROR[2])) return;
					socket_connection(`${PRE} peer ${remote} ping\n`);
					break;
				case "chains":
					if(assert_size([4], arg.length, ERROR[2])) return;
					socket_connection(`${PRE} peer ${remote} chains\n`);
					break;
				case "send":
					if(assert_size([5], arg.length, ERROR[2])) return;
					socket_connection(`${PRE} peer ${remote} send ${arg[4]}\n`);
					break;
				case "recv":
					if(assert_size([5], arg.length, ERROR[2])) return;
					socket_connection(`${PRE} peer ${remote} recv ${arg[4]}\n`);
					break;
				default:
					console.error(ERROR[1]);
			}
			break
		case "chains":
			switch(arg[2])
			{
				case "list":
					if(assert_size([3], arg.length, ERROR[2])) return;
					socket_connection(PRE + " chains list\n");
					break;
				case "leave":
					if(assert_size([4], arg.length, ERROR[2])) return;
					socket_connection(PRE + " chains leave " + arg[3] + "\n");
					break;
				case "join":
					if (arg.length >= 5) 
					{
						var comd = PRE + " chains join " + arg[3] + " ";
						for (let i = 4; i < (arg.length-1); i++)
						{
							comd += arg[i] + " ";
						}
						comd += arg[arg.length-1];
						socket_connection(comd + "\n");
					}
					else
					{
						if(assert_size([4], arg.length, ERROR[2])) return;
						socket_connection(PRE + " chains join " + arg[3] + "\n");
					}
					break;
				case "listen":
					if(assert_size([3], arg.length, ERROR[2])) return;
					socket_connection(PRE + " chains listen\n", true);
					break;
				default:
					console.error(ERROR[1]);
			}
			break
		case "chain":
			var chain = arg[2];
			switch(arg[3])
			{
				case "genesis":
					if(assert_size([4], arg.length, ERROR[2])) return;
					socket_connection(PRE + " chain " + chain + " genesis\n");
					break;
				case "heads":
					let blocked = "";
					if(assert_size([4,5], arg.length, ERROR[2])) return;
					if(arg[4] === "blocked") blocked = " blocked";
					socket_connection(`${PRE} chain ${chain} heads${blocked}\n`);
				break;
				case "get":
					let decrypt = null;
					let path = undefined;
					if(assert_size([6,7,8,9], arg.length, ERROR[2])) return;
					if (arg[6] === "file") path = arg[7];
					else if (arg[6] && arg[6].substring(0,10) === "--decrypt=") decrypt = arg[6].substring(10);
					if (arg[8] && arg[8].substring(0,10) === "--decrypt=") decrypt = arg[8].substring(10);
					socket_connection(`${PRE} chain ${chain} get ${arg[4]} ${arg[5]} ${decrypt}\n`, undefined, true, path);
				break;
				case "post":
					let sign = "anon";
					let encrypt = false;
					var pay;
					if(assert_size([6,7,8], arg.length, ERROR[2])) return;
					for(input of arg)
					{
						if(input.substring(0,7) === "--sign=") sign = input.substring(7);
						if(input.substring(0,10) === "--encrypt") encrypt = true;
					}
					switch(arg[4])
					{
						case "inline":
							pay = arg[5];
							break;
						case "file":
							try 
							{
								pay = fs.readFileSync(arg[5]);
							} 
							catch(error) 
							{
								console.error(ERROR[4]);
								return;
							}
							break;
						default:
							console.error(ERROR[1]);
							return;
					}
					socket_connection(`${PRE} chain ${chain} post ${sign} ${encrypt} ${pay.length}\n${pay}`);
					break;
				case "traverse":
					let traverse = ""
					for (let i = 4; i < arg.length; i++)
					{
						traverse += arg[i] + " ";
					}
					socket_connection(`${PRE} chain ${chain} traverse ${traverse}\n`);					
					break;
				case "reps":
					if(assert_size([5], arg.length, ERROR[2])) return;
					socket_connection(PRE + " chain " + chain + " reps " + arg[4] + "\n");
					break;
				case "like":
				case "dislike":
					let sign_ld = undefined;
					let why = "";
					if(arg[3] === "dislike") like = -1;
					for(input of arg)
					{
						if(input.substring(0,7) === "--sign=") sign_ld = input.substring(7);
						if(input.substring(0,6) === "--why=") why = input.substring(6);
					}
					if(!sign_ld) 
					{
						console.log(ERROR[5]);
						return;
					}
					socket_connection(`${PRE} chain ${chain} like ${like} ${arg[4]} ${sign_ld} ${why.length}\n${why}\n`)
					break;
				case "listen":
					if(assert_size([4], arg.length, ERROR[2])) return;
					socket_connection(PRE + " chain " + chain + " listen\n", true);
					break;
				default:
					console.error(ERROR[1]);
			}			
			break;
		default:
			console.error(ERROR[1]);
	}
}

function assert_size (nums, for_test, err_msg)
{
	let er = false;
	if(!nums.includes(for_test)) 
	{
		console.error(err_msg);
		er = true;
	}
	return er;
}

module.exports = { main };
