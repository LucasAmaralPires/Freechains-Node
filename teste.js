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

    freechains_command_call(["freechains-host", "path", `${P0}`], {Val_cor: "//tmp/8340/", Msn_sucesso: `Host port ${P0} criado`, Msn_erro: `Erro criacao Host port ${P0}`});
    freechains_command_call(["freechains-host", "path", `${P1}`], {Val_cor: "//tmp/8341/", Msn_sucesso: `Host port ${P1} criado`, Msn_erro: `Erro criacao Host port ${P1}`});
    freechains_command_call(["freechains-host", "path", `${P2}`], {Val_cor: "//tmp/8342/", Msn_sucesso: `Host port ${P2} criado`, Msn_erro: `Erro criacao Host port ${P2}`});

}

async function test_keys()
{

    freechains_command_call(["freechains", "keys", "shared", "teste", `${P0}`], {Val_cor: SHA0, Msn_sucesso: "Sucesso criacao shared de teste", Msn_erro: "Erro criacao shared de teste"})
    freechains_command_call(["freechains", "keys", "pubpvt", "teste", `${P0}`], {Val_cor: PUB0 + " " + PVT0, Msn_sucesso: "Sucesso criacao pubpvt de teste", Msn_erro: "Erro criacao pubpvt de teste"})

    freechains_command_call(["freechains", "keys", "shared", "ola mundo", `${P1}`], {Val_cor: SHA1, Msn_sucesso: "Sucesso criacao shared de ola mundo", Msn_erro: "Erro criacao shared de ola mundo"})
    freechains_command_call(["freechains", "keys", "pubpvt", "ola mundo", `${P1}`], {Val_cor: PUB1 + " " + PVT1, Msn_sucesso: "Sucesso criacao pubpvt de ola mundo", Msn_erro: "Erro criacao pubpvt de ola mundo"})

    freechains_command_call(["freechains", "keys", "shared", "freechains", `${P2}`], {Val_cor: SHA2, Msn_sucesso: "Sucesso criacao shared de freechains", Msn_erro: "Erro criacao shared de freechains"})
    freechains_command_call(["freechains", "keys", "pubpvt", "freechains", `${P2}`], {Val_cor: PUB2 + " " + PVT2, Msn_sucesso: "Sucesso criacao pubpvt de freechains", Msn_erro: "Erro criacao pubpvt de freechains"})

}

async function close_host()
{

    freechains_command_call(["freechains-host", "stop", `${P0}`], {Val_cor: "true", Msn_sucesso: `Host port ${P0} encerrado`, Msn_erro: `Erro encerrar Host port ${P0}`});
    freechains_command_call(["freechains-host", "stop", `${P1}`], {Val_cor: "true", Msn_sucesso: `Host port ${P1} encerrado`, Msn_erro: `Erro encerrar Host port ${P1}`});
    freechains_command_call(["freechains-host", "stop", `${P2}`], {Val_cor: "true", Msn_sucesso: `Host port ${P2} encerrado`, Msn_erro: `Erro encerrar Host port ${P2}`});

}

async function run()
{
    console.log("Initiating hosts...")

    init_host()

    await delay(1000)

    console.log("Hosts initiated.")

    host_path()

    console.log("Initiating crypto keys test...")

    test_keys()

    await delay(1000)

    console.log("Finished crypto keys test.")

    close_host()

}

run()
