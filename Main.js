const MAJOR    = "0";
const MINOR    = "8";
const REVISION = "6";
const VERSION  = "v" + MAJOR + "." + MINOR + "." + REVISION;
const PRE      = "FC " + VERSION;
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
    --decrypt=<pvt>     [get]             decrypts post with private key (only in public identity chains)
    --why=<text>        [(dis)like]       explains reason for the like

More Information:
    http://www.freechains.org/
    Please report bugs at <http://github.com/Freechains/README/>.
`
var port = 8330;
var addr = "localhost";
/*
 * TODO:
 * Implementar conversa com host para 'chain' (get, post, traverse, like and dislike)
 * Ternminar/Consertar bugs do get
 * Colocar as opções disponíveis (sign(like), sign(dislike), encypto(post), decrypt(get), why(dislike) and why(like))
 */

if(require.main === module)
{
	main(process.argv.slice(2))
}

function main (argumentos)
{
	for (input of argumentos)
	{
		if(typeof input !== "string")
		{
			console.error("Command not recognized");
			process.exit(1);
		}
	}
	if(argumentos[0] === "freechains" || argumentos[0] === "freechains-host")
	{
		if(argumentos[1] === "--help")
		{
			console.log(HELP);
		}
		else if(argumentos[1] === "--version")
		{
			console.log(VERSION);
		}
		if(argumentos[argumentos.length-1].substring(0,7) === "--port=")
		{
			port = parseInt(argumentos[argumentos.length-1].substring(7));
			if(port < 1024 || port > 65535)
			{
				console.error("Invalid Port Number");
				process.exit(1);
			}
			argumentos.pop()
		}
		else if(argumentos[argumentos.length-1].substring(0,7) === "--host=")
		{
			let split = argumentos[argumentos.length-1].substring(7).split(":");
			host = split[0];
			port = parseInt(split[1]);
			if(port < 1024 || port > 65535)
			{
				console.error("Invalid Port Number");
				process.exit(1);
			}
			argumentos.pop()
		}
		if(argumentos[0] === "freechains")
		{
			command_freechains(argumentos);
		}
		else
		{
			command_freechains_host(argumentos);
		}
	}
	else
	{
		console.error("Command not recognized");
		process.exit(1);
	}
}

function socket_connection(message, listen = false, get = false)
{
	const net = require('net');
	const client = net.createConnection(port, addr);
	var buffer = "";
	client.write(message);

	client.on('data', (data) => 
	{
		buffer += data.toString();
		if(buffer[buffer.length-1] === "\n" && get === false)
		{
			if(listen === false)
			{
				client.unref()
			}
			process.stdout.write(buffer);
			buffer = "";
		}
		if(get === true)
		{
			process.stdout.write(buffer);
			buffer = "";
		}
	});
}

function command_freechains_host (arg)
{
	switch (arg[1])
	{
		case "start":
			assert_size([2,3], arg.length, "Invalid Number of Arguments");
			const { exec } = require("child_process");
			exec("freechains-host start " + arg[2] + " --port=" + port + " &", (stdout) => {
				console.log(stdout);
			});
			process.exit(1);
			break;
		case "stop":
			assert_size([2], arg.length, "Invalid Number of Arguments");
			socket_connection(PRE + " host stop\n");
			break;
		case "path":
			assert_size([2], arg.length, "Invalid Number of Arguments");
			socket_connection(PRE + " host path\n");
			break;
		default:
			console.error("Command not recognized");
	}
}

function command_freechains (arg)
{
	switch (arg[1])
	{
		case "crypto":
			assert_size([4], arg.length, "Invalid Number of Arguments");
			socket_connection(PRE + " crypto " + arg[2] + "\n" + arg[3] + "\n");
			break
		case "peer":
			assert_size([4,5], arg.length, "Invalid Number of Arguments");
			var remote = arg[2];
			switch(arg[3])
			{
				case "ping":
					assert_size([4], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " peer " + remote + " ping\n");
					break;
				case "chains":
					assert_size([4], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " peer " + remote + " chains\n");
					break;
				case "send":
					assert_size([5], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " peer " + remote + " send " + arg[4] + "\n");
					break;
				case "recv":
					assert_size([5], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " peer " + remote + " recv " + arg[4] + "\n");
					break;
				default:
					console.error("Command not recognized");
			}
			break
		case "chains":
			switch(arg[2])
			{
				case "list":
					assert_size([3], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " chains list\n");
					break;
				case "leave":
					assert_size([4], arg.length, "Invalid Number of Arguments");
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
						assert_size([4], arg.length, "Invalid Number of Arguments");
						socket_connection(PRE + " chains join " + arg[3] + "\n");
					}
					break;
				case "listen":
					assert_size([3], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " chains listen\n", true);
					break;
				default:
					console.error("Command not recognized");
			}
			break
		case "chain":
			fs = require("fs");
			var chain = arg[2];
			switch(arg[3])
			{
				case "genesis":
					assert_size([4], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " chain " + chain + " genesis\n");
					break;
				case "heads":
					let blocked = "";
					assert_size([4,5], arg.length, "Invalid Number of Arguments");
					if(arg[4] === "blocked")
					{
						blocked = " blocked";
					}
					socket_connection(PRE + " chain " + chain + " heads" + blocked + "\n");
				break;
				case "get":
//				val decrypt = opts["--decrypt"].toString() // null or pvtkey
					assert_size([6,8], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " chain " + chain + " get " + arg[4] + " " + arg[5] + " null\n", false, true);

/*
if (len.startsWith('!')) {
	len
} else {
	val bs = reader.readNBytesX(len.toInt())
	if (cmds.size == 5) {
		bs.toString(Charsets.UTF_8)
	} else {
		assert(cmds[5] == "file")
		File(cmds[6]).writeBytes(bs)
		""
	}
}
*/				break;
				case "post":
					let sign = "anon";
					var pay;
//					val encrypt = opts.containsKey("--encrypt").toString() // null (false) or empty (true)
					assert_size([6,7,8], arg.length, "Invalid Number of Arguments");
					for(input of arg)
					{
						if(input.substring(0,7) == "--sign=")
						{
							sign = input.substring(7);
						}
						if(input.substring(0,10) == "--encrypt=")
						{
							console.log("AQUI2");
						}
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
								console.error("Unable to Read File");
								process.exit(1);
							}
							break;
						default:
							console.error("Command not recognized");
							process.exit(1);
					}
					socket_connection(PRE + " chain " + chain + " post " + sign + " false " + arg[5].length + "\n" + pay);
					break;
				case "traverse":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
					break;
				case "reps":
					assert_size([5], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " chain " + chain + " reps " + arg[4] + "\n");
					break;
				case "like":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
					break;
				case "dislike":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
					break;
				case "listen":
					assert_size([4], arg.length, "Invalid Number of Arguments");
					socket_connection(PRE + " chain " + chain + " listen\n", true);
					break;
				default:
					console.error("Command not recognized");
			}			
			break;
		default:
			console.error("Command not recognized");
	}
}

function assert_size (nums, for_test, err_msg)
{
	if(!nums.includes(for_test)) 
	{
		console.error(err_msg);
		process.exit(1);  
	}
}

module.exports = { main };
