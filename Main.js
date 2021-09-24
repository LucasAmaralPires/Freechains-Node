const MAJOR    = "0";
const MINOR    = "8";
const REVISION = "6";
const VERSION  = "v" + MAJOR + "." + MINOR + "." + REVISION;
const PRE      = "FC " + VERSION;

main(process.argv.slice(2))

/*
Usage:
    freechains chains join  <chain> [<key>...]
    freechains chains leave <chain>
    freechains chains list
    freechains chains listen
    
    freechains chain <name> genesis
    freechains chain <name> heads [blocked]
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
    --port=<port>       [all]             sets host port to connect [default: $PORT_8330]
    --sign=<pvt>        [post|(dis)like]  signs post with given private key
    --encrypt           [post]            encrypts post with public key (only in public identity chains)
    --decrypt=<pvt>     [get]             decrypts post with private key (only in public identity chains)
    --why=<text>        [(dis)like]       explains reason for the like

More Information:
    http://www.freechains.org/
    Please report bugs at <http://github.com/Freechains/README/>.
*/

function main (argumentos)
{
	for (input of argumentos)
	{
		if(typeof input !== "string")
		{
			console.error("The Command is Not a String");
			process.exit(1);
		}
	} 
	caminho(argumentos);
}

function socket_connection(addr, port, message)
{
	const net = require('net');
	const client = net.connect(port, addr);
	var buffer = "";
	client.write(message);

	client.on('data', (data) => 
	{
		buffer += data.toString();
		if(buffer[buffer.length-1] === "\n")
		{
			client.unref()
			process.stdout.write(buffer);
		}
	});
}

function caminho (arg)
{
	var addr = "localhost";
	var port = 8330;
	switch (arg[1])
	{
		case "crypto":
			assert_size([4], arg.length, "Invalid Number of Arguments");
			socket_connection(addr, port, PRE + " crypto shared\n" + arg[3] + "\n");
			break
		case "peer":
			assert_size([4,5], arg.length, "Invalid Number of Arguments");
			var remote = arg[2];
			switch(arg[3])
			{
				case "ping":
				assert_size([4], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, port, PRE + " peer " + remote + " ping\n");
				break;
				case "chains":
				assert_size([4], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, port, PRE + " peer " + remote + " chains\n");
				break;
				case "send":
				assert_size([5], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, port, PRE + " peer " + remote + " send " + arg[4] + "\n");
				break;
				case "recv":
				assert_size([5], arg.length, "Invalid Number of Arguments");
				socket_connection(addr, port, PRE + " peer " + remote + " recv " + arg[4] + "\n");
				break;
			}
			break
		case "chains":
//			assert_size([4,5], arg.length);
			//checar quantidade de argumentos
			switch(arg[2])
			{
				case "list":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
				socket_connection("localhost", 8330, PRE + " chains list\n");
				break;
				case "leave":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
				break;
				case "join":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
				break;
				case "listen":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
				break;
			}
			break
		case "chain":
			//checar quantidade de argumentos
//			assert_size([4,5], arg.length, "Invalid Number of Arguments");
			var chain = arg[2];
			switch(arg[3])
			{
				case "genesis":
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
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
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
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
//				assert_size([4,5], arg.length, "Invalid Number of Arguments");
				//codigo
				break;
			}			
			break;
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
