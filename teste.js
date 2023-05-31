const Main = require("./Main");

const SHA0 = "07F3AE7D10A8AFB6145227A798B7B5B953380263C5E6CF88B8BE6C2CF8C0C8A0"

const PVT0 = "07F3AE7D10A8AFB6145227A798B7B5B953380263C5E6CF88B8BE6C2CF8C0C8A047F815A7A0E529CA32E9B40E81CD4E63BBF4852B8993C515003C9C992ACEACAF"
const PUB0 = "47F815A7A0E529CA32E9B40E81CD4E63BBF4852B8993C515003C9C992ACEACAF"

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
                        if(for_test == SHA0)
                        {
                            for_test += "\n"
                            if(answer == for_test)
                            {
                                console.log("SUCESSO!")
                            }
                        }
                        else
                        {
                            process.stdout.write(answer)
                        }
                    }))
                }
                catch
                {
                    reject(console.log("Erro!"))
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

    //Main.main(["freechains-host", "start", "/tmp/8341", `${P1}`], print_return);
    //Main.main(["freechains-host", "start", "/tmp/8342", `${P2}`], print_return);

}

async function test_keys()
{
    freechains_command_call(["freechains", "keys", "shared", "teste", `${P0}`], SHA0)
//    freechains_command_call(["freechains", "keys", "pubpvt", "teste", `${P0}`], PVT0)

//Main.main(["freechains", "keys", "shared", "teste1", `${P1}`], print_return);
//Main.main(["freechains", "keys", "pubpvt", "teste1", `${P1}`], print_return);

//Main.main(["freechains", "keys", "shared", "teste2", `${P2}`], print_return);
//Main.main(["freechains", "keys", "pubpvt", "teste2", `${P2}`], print_return);


}

async function close_host()
{

    freechains_command_call(["freechains-host", "stop", `${P0}`], "");

//Main.main(["freechains-host", "stop", `${P1}`], print_return);
//Main.main(["freechains-host", "stop", `${P2}`], print_return);

}

async function run()
{
    console.log("Initiating hosts...")

    init_host()

    await delay(1000)

    console.log("Hosts initiated.")
 
    console.log("Initiating crypto keys test...")

    test_keys()

    await delay(1000)

    console.log("Finished crypto keys test.")

//    console.log("Closing hosts...")

    close_host()

 //   console.log("Hosts closed.")

}

run()
