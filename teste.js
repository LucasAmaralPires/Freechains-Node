const Main = require("./Main");

const SHA0 = "07F3AE7D10A8AFB6145227A798B7B5B953380263C5E6CF88B8BE6C2CF8C0C8A0"
const SHA1 = "3A8F27002337E70E2FC48C1573E8243EF190A7C176DC40FC4E6211E56065665F"
const SHA2 = "7A27183A1DEA574C40FB78E351059655538A31AC57541B82DECA1207B6024F4E"

const PVT0 = "07F3AE7D10A8AFB6145227A798B7B5B953380263C5E6CF88B8BE6C2CF8C0C8A047F815A7A0E529CA32E9B40E81CD4E63BBF4852B8993C515003C9C992ACEACAF"
const PUB0 = "47F815A7A0E529CA32E9B40E81CD4E63BBF4852B8993C515003C9C992ACEACAF"
const PVT1 = "3A8F27002337E70E2FC48C1573E8243EF190A7C176DC40FC4E6211E56065665FAD63E4E834ED26081D61E1BB65141D295F38ACE00260D1192878B79020B793CC"
const PUB1 = "AD63E4E834ED26081D61E1BB65141D295F38ACE00260D1192878B79020B793CC"
const PVT2 = "7A27183A1DEA574C40FB78E351059655538A31AC57541B82DECA1207B6024F4ED71B87E5F50F19B65561044D4C7BA599C6501BB55242042E3A087840B56E2ABA"
const PUB2 = "D71B87E5F50F19B65561044D4C7BA599C6501BB55242042E3A087840B56E2ABA"

const P0 = "--port=8340"
const P1 = "--port=8341"
const P2 = "--port=8342"

/*
const H0 = "--host=localhost:8340"
const H1 = "--host=localhost:8341"
const H2 = "--host=localhost:8342"

const S0 = "--sign=" + PVT0
const S1 = "--sign=" + PVT1
const S2 = "--sign=" + PVT2
const S3 = "--sign=" + PVT3
*/

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}   

function freechains_command_call (cmd, for_test)
{
    try
    {
        return new Promise((resolve,reject) => 
            {
                try
                {
                    resolve(Main.main(cmd, function(answer){
                        for_test.Val_cor += "\n"
                        if(answer == for_test.Val_cor)
                        {
                            console.log(for_test.Msn_sucesso)
                        }
                        else
                        {
                            console.log(for_test.Msn_erro)
                            process.exit()
                        }
                    }))
                }
                catch
                {
                    reject(() => {console.log(for_test.Msn_erro); process.exit()})
                }
            })
    }
    catch (error)
    {
        console.log("error")
        process.exit()
    }
}

async function init_host()
{

    freechains_command_call(["freechains-host", "start", "/tmp/8340", `${P0}`], "");
    freechains_command_call(["freechains-host", "start", "/tmp/8341", `${P1}`], "");
    freechains_command_call(["freechains-host", "start", "/tmp/8342", `${P2}`], "");

}

async function host_path()
{

    freechains_command_call(["freechains-host", "path", `${P0}`], {Val_cor: "//tmp/8340/", Msn_sucesso: `Host port ${P0} created`, Msn_erro: `Error creating Host port ${P0}`});
    freechains_command_call(["freechains-host", "path", `${P1}`], {Val_cor: "//tmp/8341/", Msn_sucesso: `Host port ${P1} created`, Msn_erro: `Error creating Host port ${P1}`});
    freechains_command_call(["freechains-host", "path", `${P2}`], {Val_cor: "//tmp/8342/", Msn_sucesso: `Host port ${P2} created`, Msn_erro: `Error creating Host port ${P2}`});

}

async function test_keys()
{

    freechains_command_call(["freechains", "keys", "shared", "teste", `${P0}`], {Val_cor: SHA0, Msn_sucesso: "Success creating shared key -p teste", Msn_erro: "Error creating shared key -p teste"})
    freechains_command_call(["freechains", "keys", "pubpvt", "teste", `${P0}`], {Val_cor: PUB0 + " " + PVT0, Msn_sucesso: "Success creating pubpvt key -p teste", Msn_erro: "Error creating pubpvt key -p teste"})

    freechains_command_call(["freechains", "keys", "shared", "ola mundo", `${P1}`], {Val_cor: SHA1, Msn_sucesso: "Success creating shared key -p ola mundo", Msn_erro: "Error creating shared key -p ola mundo"})
    freechains_command_call(["freechains", "keys", "pubpvt", "ola mundo", `${P1}`], {Val_cor: PUB1 + " " + PVT1, Msn_sucesso: "Success creating pubpvt key -p ola mundo", Msn_erro: "Error creating pubpvt key -p ola mundo"})

    freechains_command_call(["freechains", "keys", "shared", "freechains", `${P2}`], {Val_cor: SHA2, Msn_sucesso: "Success creating shared key -p freechains", Msn_erro: "Error creating shared key -p freechains"})
    freechains_command_call(["freechains", "keys", "pubpvt", "freechains", `${P2}`], {Val_cor: PUB2 + " " + PVT2, Msn_sucesso: "Success creating shared key -p freechains", Msn_erro: "Error creating pubpvt key -p freechains"})

}

async function join_chains()
{

    freechains_command_call(["freechains", "chains", "join", "#teste", PUB0, `${P0}`], {Val_cor: "91DBDFE4573B89C6726F882089649E50EB86D6D3B88E9ADBBB4DC2F718D8DF67", Msn_sucesso: `Success entering chain #teste ${P0}`, Msn_erro: `Error entering chain #teste ${P0}`})
    freechains_command_call(["freechains", "chains", "join", "#teste", PUB1, `${P1}`], {Val_cor: "1D753166C15465469442F1373ECA58967DE1CB5A658460543F5AA5D4D4E73BED", Msn_sucesso: `Success entering chain #teste ${P1}`, Msn_erro: `Error entering chain #teste ${P1}`})
    freechains_command_call(["freechains", "chains", "join", "#teste", PUB2, `${P2}`], {Val_cor: "BDB6BE16DC218F94B23FDBD412EA4A8289C299B1AFDC33B136A2F8966EC66AE9", Msn_sucesso: `Success entering chain #teste ${P2}`, Msn_erro: `Error entering chain #teste ${P2}`})

    freechains_command_call(["freechains", "chains", "join", "$chat", SHA0, `${P0}`], {Val_cor: "7231419A405076D6972C0C6E40806A62DFA8D86D0CAFBD8D5FEE058D854CA9A4", Msn_sucesso: `Success entering chain $chat ${P0}`, Msn_erro: `Error entering chain $chain ${P0}`})
    freechains_command_call(["freechains", "chains", "join", "$chat", SHA0, `${P1}`], {Val_cor: "7231419A405076D6972C0C6E40806A62DFA8D86D0CAFBD8D5FEE058D854CA9A4", Msn_sucesso: `Success entering chain $chat ${P1}`, Msn_erro: `Error entering chain $chain ${P1}`})
    freechains_command_call(["freechains", "chains", "join", "$chat", SHA0, `${P2}`], {Val_cor: "7231419A405076D6972C0C6E40806A62DFA8D86D0CAFBD8D5FEE058D854CA9A4", Msn_sucesso: `Success entering chain $chat ${P2}`, Msn_erro: `Error entering chain $chain ${P2}`})

}

async function chains_list()
{

    freechains_command_call(["freechains", "chains", "list", `${P0}`], {Val_cor: "$chat #teste", Msn_sucesso: `Success listing chains ${P0}`, Msn_erro: `Error listing chains ${P0}`})
    freechains_command_call(["freechains", "chains", "list", `${P1}`], {Val_cor: "$chat #teste", Msn_sucesso: `Success listing chains ${P1}`, Msn_erro: `Error listing chains ${P1}`})
    freechains_command_call(["freechains", "chains", "list", `${P2}`], {Val_cor: "$chat #teste", Msn_sucesso: `Success listing chains ${P2}`, Msn_erro: `Error listing chains ${P2}`})

}


async function chains_genesis()
{

    freechains_command_call(["freechains", "chain", "#teste", "genesis", `${P0}`], {Val_cor: "0_91DBDFE4573B89C6726F882089649E50EB86D6D3B88E9ADBBB4DC2F718D8DF67", Msn_sucesso: `Success genesis hash #teste ${P0}`, Msn_erro: `Error genesis hash #teste ${P0}`})
    freechains_command_call(["freechains", "chain", "#teste", "genesis", `${P1}`], {Val_cor: "0_1D753166C15465469442F1373ECA58967DE1CB5A658460543F5AA5D4D4E73BED", Msn_sucesso: `Success genesis hash #teste ${P1}`, Msn_erro: `Error genesis hash #teste ${P1}`})
    freechains_command_call(["freechains", "chain", "#teste", "genesis", `${P2}`], {Val_cor: "0_BDB6BE16DC218F94B23FDBD412EA4A8289C299B1AFDC33B136A2F8966EC66AE9", Msn_sucesso: `Success genesis hash #teste ${P2}`, Msn_erro: `Error genesis hash #teste ${P2}`})

    freechains_command_call(["freechains", "chain", "$chat", "genesis", `${P0}`], {Val_cor: "0_7231419A405076D6972C0C6E40806A62DFA8D86D0CAFBD8D5FEE058D854CA9A4", Msn_sucesso: `Success genesis hash $chat ${P0}`, Msn_erro: `Error genesis hash $chain ${P0}`})
    freechains_command_call(["freechains", "chain", "$chat", "genesis", `${P1}`], {Val_cor: "0_7231419A405076D6972C0C6E40806A62DFA8D86D0CAFBD8D5FEE058D854CA9A4", Msn_sucesso: `Success genesis hash $chat ${P1}`, Msn_erro: `Error genesis hash $chain ${P1}`})
    freechains_command_call(["freechains", "chain", "$chat", "genesis", `${P2}`], {Val_cor: "0_7231419A405076D6972C0C6E40806A62DFA8D86D0CAFBD8D5FEE058D854CA9A4", Msn_sucesso: `Success genesis hash $chat ${P2}`, Msn_erro: `Error genesis hash $chain ${P2}`})

}

async function leave_chains()
{

    freechains_command_call(["freechains", "chains", "leave", "#teste", `${P0}`], {Val_cor: "true", Msn_sucesso: `Success leaving chain #teste ${P0}`, Msn_erro: `Error leaving chain #teste ${P0}`})
    freechains_command_call(["freechains", "chains", "leave", "#teste", `${P1}`], {Val_cor: "true", Msn_sucesso: `Success leaving chain #teste ${P1}`, Msn_erro: `Error leaving chain #teste ${P1}`})
    freechains_command_call(["freechains", "chains", "leave", "#teste", `${P2}`], {Val_cor: "true", Msn_sucesso: `Success leaving chain #teste ${P2}`, Msn_erro: `Error leaving chain #teste ${P2}`})

    freechains_command_call(["freechains", "chains", "leave", "$chat", `${P0}`], {Val_cor: "true", Msn_sucesso: `Success leaving chain $chat ${P0}`, Msn_erro: `Error leaving chain $chain ${P0}`})
    freechains_command_call(["freechains", "chains", "leave", "$chat", `${P1}`], {Val_cor: "true", Msn_sucesso: `Success leaving chain $chat ${P1}`, Msn_erro: `Error leaving chain $chain ${P1}`})
    freechains_command_call(["freechains", "chains", "leave", "$chat", `${P2}`], {Val_cor: "true", Msn_sucesso: `Success leaving chain $chat ${P2}`, Msn_erro: `Error leaving chain $chain ${P2}`})

}

async function close_host()
{

    freechains_command_call(["freechains-host", "stop", `${P0}`], {Val_cor: "true", Msn_sucesso: `Host port ${P0} closed`, Msn_erro: `Error closing Host port ${P0}`});
    freechains_command_call(["freechains-host", "stop", `${P1}`], {Val_cor: "true", Msn_sucesso: `Host port ${P1} closed`, Msn_erro: `Error closing Host port ${P1}`});
    freechains_command_call(["freechains-host", "stop", `${P2}`], {Val_cor: "true", Msn_sucesso: `Host port ${P2} closed`, Msn_erro: `Error closing Host port ${P2}`});

}

async function run()
{
    console.log("Initiating hosts...")

    init_host()

    await delay(2000)

    console.log("Hosts initiated.")

    host_path()

    console.log("Initiating crypto keys test...")

    test_keys()

    await delay(2000)

    console.log("Finished crypto keys test.")

    console.log("Joining chains...")

    join_chains()

    await delay (2000)

    console.log("Chains joined.")

    console.log("Listing chains...")

    chains_list()

    await delay (2000)

    console.log("Chains listed.")

    console.log("Initianting test of genesis block...")

    chains_genesis()

    await delay (2000)

    console.log("Genesis block ok.")

    console.log("Leaving chains...")

    leave_chains()

    await delay (2000)

    console.log("Chains left.")

    close_host()

}

run()


/*
	freechains chains listen
	
	freechains chain <name> heads [blocked]
	freechains chain <name> get (block | payload) <hash> [file <path>]
	freechains chain <name> post (inline | file | -) [<path_or_text>]
	freechains chain <name> (like | dislike) <hash>
	freechains chain <name> reps <hash_or_pub>
	freechains chain <name> consensus
	freechains chain <name> listen
	
	freechains peer <addr:port> ping
	freechains peer <addr:port> chains
	freechains peer <addr:port> (send | recv) <chain>
	
	Options:
		--help              [none]            displays this help
		--version           [none]            displays software version
		--host=<addr:port>  [all]             sets host address and port to connect [default: localhost:8330]
		--port=<port>       [all]             sets host port to connect [default: 8330]
		--sign=<pvt>        [post|(dis)like]  signs post with given private key
		--encrypt           [post]            encrypts post with public key (only in public identity chains)
		--decrypt=<pvt>     [get]             decrypts post with private key (only in public identity chains)
		--why=<text>        [(dis)like]       explains reason for the like

*/