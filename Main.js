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
    freechains chain <name> heads
    freechains chain <name> get (block | payload) <hash> [file <path>]
    freechains chain <name> post (inline | file | -) [<path_or_text>]
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
    --host=<addr:port>  [all]             sets host address and port to connect [default: localhost:$PORT_8330]
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

/*
 * TODO:
 * Implementar conversa com host para 'chain' (heads, get, post, traverse, like and dislike)
 * Colocar as opções disponíveis (host, sign, encypto, decrypt e why)
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
			console.log("Command not recognized");
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
				console.log("Invalid Port Number");
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
		console.log("Command not recognized");
		process.exit(1);
	}
}

function socket_connection(addr, message, listen = false)
{
	const net = require('net');
	const client = net.createConnection(port, addr);
	var buffer = "";
	client.write(message);

	client.on('data', (data) => 
	{
		buffer += data.toString();
		if(buffer[buffer.length-1] === "\n")
		{
			if(listen === false)
			{
				client.unref()
			}
			process.stdout.write(buffer);
			buffer = "";
		}
	});
}

function command_freechains_host (arg)
{
	var addr = "localhost";
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
			socket_connection(addr, PRE + " host stop\n");
			break;
		case "path":
			assert_size([2], arg.length, "Invalid Number of Arguments");
			socket_connection(addr, PRE + " host path\n");
			break;
		default:
			console.log("Command not recognized");
	}
}

function command_freechains (arg)
{
	var addr = "localhost";
	switch (arg[1])
	{
		case "crypto":
			assert_size([4], arg.length, "Invalid Number of Arguments");
			socket_connection(addr, PRE + " crypto " + arg[2] + "\n" + arg[3] + "\n");
			break
		case "peer":
			assert_size([4,5], arg.length, "Invalid Number of Arguments");
			var remote = arg[2];
			switch(arg[3])
			{
				case "ping":
				assert_size([4], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, PRE + " peer " + remote + " ping\n");
				break;
				case "chains":
				assert_size([4], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, PRE + " peer " + remote + " chains\n");
				break;
				case "send":
				assert_size([5], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, PRE + " peer " + remote + " send " + arg[4] + "\n");
				break;
				case "recv":
				assert_size([5], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, PRE + " peer " + remote + " recv " + arg[4] + "\n");
				break;
				default:
					console.log("Command not recognized");
			}
			break
		case "chains":
			switch(arg[2])
			{
				case "list":
				assert_size([3], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, PRE + " chains list\n");
				break;
				case "leave":
				assert_size([4], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, PRE + " chains leave " + arg[3] + "\n");
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
					socket_connection(addr, comd + "\n");
				}
				else
				{
					assert_size([4], arg.length, "Invalid Number of Arguments");
					socket_connection(addr, PRE + " chains join " + arg[3] + "\n");
                }
				break;
				case "listen":
				assert_size([3], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, PRE + " chains listen\n", true);
				break;
				default:
					console.log("Command not recognized");
			}
			break
		case "chain":
			//checar quantidade de argumentos
//			assert_size([4,5], arg.length, "Invalid Number of Arguments");
			var chain = arg[2];
			switch(arg[3])
			{
				case "genesis":
				assert_size([4], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, PRE + " chain " + chain + " genesis\n");
				break;
				case "heads":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
				break;
				case "get":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
				break;
				case "post":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
				break;
				case "traverse":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
				break;
				case "reps":
				assert_size([5], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, PRE + " chain " + chain + " reps " + arg[4] + "\n");
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
				socket_connection(addr, PRE + " chain " + chain + " listen\n", true);
				break;
				default:
					console.log("Command not recognized");
			}			
			break;
		default:
			console.log("Command not recognized");
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
