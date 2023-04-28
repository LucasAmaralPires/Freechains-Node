const Main = require("./Main");

function print_return (printable)
{
    console.log(printable);
}

Main.main(["freechains", "keys", "shared", "teste"], print_return);
Main.main(["freechains", "keys", "pubpvt", "teste"], print_return);