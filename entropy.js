WSH.echo("Enter the string: ");
var string = WScript.StdIn.ReadLine();
var counts = {};
var H = 0, n = 0;

for (var i = 0; i < string.length; i++)
{
    var char = string.charAt(i);
    if (counts[char])
    {
        counts[char] += 1;
    }
    else
    {
        counts[char] = 1;
        n += 1;
    }
}

if (n == 1)
    WSH.echo(0);
else
{
    for (var char in counts)
{
    H += counts[char] / string.length * (Math.log(counts[char] / string.length)/Math.log(n));
}
WSH.echo(-H);
}