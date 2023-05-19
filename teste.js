const Main = require("./Main");

const SHA0 = "07F3AE7D10A8AFB6145227A798B7B5B953380263C5E6CF88B8BE6C2CF8C0C8A0"

const PVT0 = "07F3AE7D10A8AFB6145227A798B7B5B953380263C5E6CF88B8BE6C2CF8C0C8A047F815A7A0E529CA32E9B40E81CD4E63BBF4852B8993C515003C9C992ACEACAF"
const PUB0 = "47F815A7A0E529CA32E9B40E81CD4E63BBF4852B8993C515003C9C992ACEACAF"
/*
const PVT1 = "6A416117B8F7627A3910C34F8B35921B15CF1AC386E9BB20E4B94AF0EDBE24F4E14E4D7E152272D740C3CA4298D19733768DF7E74551A9472AAE384E8AB34369"
const PUB1 = "E14E4D7E152272D740C3CA4298D19733768DF7E74551A9472AAE384E8AB34369"
const PVT2 = "320B59D3B1C969E20BD10D1349CEFECCD31B8FB84827369DCA644E780F004EA6146754D26A9B803138D47B62C92D9542343C22EB67BFFA9C429028985ED56C40"
const PUB2 = "146754D26A9B803138D47B62C92D9542343C22EB67BFFA9C429028985ED56C40"
const PVT3 = "64976DF4946F45D6EF37A35D06A1D9A1099768FBBC2B4F95484BA390811C63A293BB7635E1472D51F94B5B0F3C3157FAD1EB06E5F356371AA4A2C1EF00657698"
const PUB3 = "93BB7635E1472D51F94B5B0F3C3157FAD1EB06E5F356371AA4A2C1EF00657698"
*/
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

function freechains_command_call (cmd)
{
    try
    {
        return new Promise(Main.main(cmd, print_return));
    }
    catch (error)
    {
        console.log("error")
    }
}

function print_return (printable)
{
    process.stdout.write(printable);
}

async function init_host()
{

    //Main.main(["freechains-host", "start", "/tmp/8340", `${P0}`], print_return);
    //Main.main(["freechains-host", "start", "/tmp/8341", `${P1}`], print_return);
    //Main.main(["freechains-host", "start", "/tmp/8342", `${P2}`], print_return);

}

async function test_keys()
{
    await delay(1000)
    await freechains_command_call(["freechains", "keys", "shared", "teste", `${P0}`])
    await delay(1000)
    await freechains_command_call(["freechains", "keys", "pubpvt", "teste", `${P0}`])    
    await delay(1000)

//Main.main(["freechains", "keys", "shared", "teste1", `${P1}`], print_return);
//Main.main(["freechains", "keys", "pubpvt", "teste1", `${P1}`], print_return);

//Main.main(["freechains", "keys", "shared", "teste2", `${P2}`], print_return);
//Main.main(["freechains", "keys", "pubpvt", "teste2", `${P2}`], print_return);


}

async function close_host()
{

//Main.main(["freechains-host", "stop" `${P0}`], print_return);
//Main.main(["freechains-host", "stop" `${P1}`], print_return);
//Main.main(["freechains-host", "stop" `${P2}`], print_return);

}
async function run()
{
    console.log("Initiating hosts...")

    init_host()

    console.log("Hosts initiated.")

    console.log("Initiating crypto keys test...")

    test_keys()

    console.log("Finished crypto keys test.")

    console.log("Closing hosts...")

    close_host()

    console.log("Hosts closed.")

}

run()