# Freechains-Node

The file Main.js creates a client to use in conjunction with the Freechains server. With a version of Node installed in your local device you can run the program by typing:

~~~shell
nodejs Main.js "freechains command"
~~~

As an example you can retrive an encrypted shared key using freechains by typing:

~~~shell
nodejs Main.js freechains keys shared teste
~~~

In this case it will print on the terminal the encryption key.

Main.js can also be used as an module in a javascript application. It exports the main function contained within the module.

The next example demonstrates how to call a Freechains command using Main.js. It should be noted that it is necessary to pass a callback as the second argument to treat the server's response. In the following example the key generated will be printed on the terminal.

~~~javascript
const Main = require("./Main");

function print_answer (answ)
{
    console.log(answ);
}

Main.main(["freechains", "keys", "shared", "teste"], print_answer);
~~~
