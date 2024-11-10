mem = new Array();
file = WScript.StdIn.Readline();
fso = new ActiveXObject('Scripting.FileSystemObject');
code = fso.OpenTextFile(file);
var s = '', countZ = 0;
while (!code.AtEndOfStream)
{
    s += code.ReadLine() + ' ';
}


mem = s.split(' ');
ip = 0;

//for (var i = 0; i < sizeof(mem); i++) 

for (ip; mem[ip] != "end"; ip++)
{
    switch(mem[ip])
    {
        case "input":
            mem[mem[ip + 1]] = WScript.StdIn.readline();
            checkErr = mem[mem[ip + 1]]
            if (checkErr == 0)
                countZ++;
            if (isNaN(checkErr) == -1 || (checkErr * 10 % 10) != 0 || checkErr < 0)
                {
                    WSH.echo("Error: You can only enter natural numbers or 0.");
                    ip--;
                    break;
                }
            else if (countZ == 2)
                {
                    WSH.echo("Error: both arguments cannot be zeros.")
                    countZ = 0;
                    ip -= 4;
                }
            else if (mem[mem[ip + 1]] > 170 && file == "factorial.txt")
                {
                    WSH.echo("Error: factorial cannot be calculated.")
                    ip--;
                    break;
                }
            ip++;
            break;
        case "cons":
            WSH.echo(mem[mem[ip + 1]]);
            ip++;
            break;
        case "var":
            mem[mem[ip + 1]] = mem[ip + 2];
            ip += 2;
            break;
        case "+":
            mem[mem[ip + 3]] = mem[mem[ip + 1]] + mem[mem[ip + 2]];
            ip += 3;
            break;
        case "-":
            mem[mem[ip + 3]] = mem[mem[ip + 1]] - mem[mem[ip + 2]];
            ip += 3;
            break;
        case "*":
            mem[mem[ip + 3]] = mem[mem[ip + 1]] * mem[mem[ip + 2]];
            ip += 3;
            break;
        case "/":
            if (mem[mem[ip + 2]] == 0)
            {
                WSH.echo("Error: you can't divide by zero");
                mem[ip + 1] = "end";
            }
            else
                {
                    mem[mem[ip + 3]] = mem[mem[ip + 1]] / mem[mem[ip + 2]];
                    ip += 3;
                }
            break;
        case "|":
            if (mem[mem[ip + 2]] == 0)
            {
                WSH.echo(mem[100]);
                mem[ip + 1] = "end";
            }
            else
            {
                mem[mem[ip + 3]] = mem[mem[ip + 1]] % mem[mem[ip + 2]];
                ip += 3;
            }
            break;
        case "++":
            mem[mem[ip + 1]]++;
            ip++;
            break;
        case "--":
            mem[mem[ip + 1]]--;
            ip++;
            break;
        case "=":
            mem[mem[ip + 1]] = mem[mem[ip + 2]];
            ip += 2;
            break;
        case "==":
            if (mem[mem[ip + 1]] == mem[mem[ip + 2]])
                mem[ip + 3] = 1;
            else
                mem[ip + 3] = 0;
            ip += 3;
            break;
        case ">":
            if (mem[mem[ip + 1]] > mem[mem[ip + 2]])
                mem[mem[ip + 3]] = 1;
            else
                mem[mem[ip + 3]] = 0;
            ip += 3;
            break;
        case "<":
            if (mem[mem[ip + 1]] < mem[mem[ip + 2]])
                mem[mem[ip + 3]] = 1;
            else
                mem[mem[ip + 3]] = 0;
            ip += 3;
            break;
        case ">=":
            if (mem[mem[ip + 1]] >= mem[mem[ip + 2]])
                mem[mem[ip + 3]] = 1;
            else
                mem[mem[ip + 3]] = 0;
            ip += 3;
        break;
        case "<=":
            if (mem[mem[ip + 1]] <= mem[mem[ip + 2]])
                mem[mem[ip + 3]] = 1;
            else
                mem[mem[ip + 3]] = 0;
            ip += 3;
            break;
        case "!=":
            if (mem[mem[ip + 1]] != mem[mem[ip + 2]])
                mem[mem[ip + 3]] = 1;
            else
                mem[mem[ip + 3]] = 0;
            ip += 3;
            break;
        case "go":
            ip = mem[ip + 1] - 1;
            break;
        case "if":
            if (mem[mem[ip + 1]] == 1)
                {
                    ip += 2;
                }
            else
            {
                ip = mem[ip + 2] - 1;
            }
            break;
    }
}
WSH.echo(mem);