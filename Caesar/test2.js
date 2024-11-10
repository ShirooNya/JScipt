alph = "abcdefghijklmnopqrstuvwxyz0123456789,.;-()*?!''№:><`[] ";

function createGT()
{
    var FSO = new ActiveXObject("Scripting.FileSystemObject");
    file1 = FSO.OpenTextFile("BBITW.txt", 1);
    var global = file1.ReadAll();
    file1.close();
    k = global.length;
    var globalFreq = {};
    for (var i = 0; i < global.length; i++)
    {
        var char = global.charAt(i).toLowerCase();
        if (globalFreq[char]) globalFreq[char]++;
        else globalFreq[char] = 1;
    }
    for (var i in globalFreq) globalFreq[i] /= k;
    return globalFreq;
}

function createLT(str)
{
    m = str.length;
    var freq = {};
    for (var i = 0; i < str.length; i++)
    {
        var char = str.charAt(i).toLowerCase();
        if (freq[char]) freq[char]++;
        else freq[char] = 1;
    }
    for (var i in freq) freq[i] /= m;
    return freq
}

function encode(str, shift, alph)
{
    encodeStr = "";
    var n = alph.length;
    if (shift > 0)
    {
        if (shift >= n) shift = shift % n;
    }
    else
    {
        if (shift <= -n) shift % n;
        shift += n;
    }
    for (var i = 0; i < str.length; i++)
    {
        if (n - alph.indexOf(str.charAt(i)) >= shift) encodeStr = encodeStr.concat(alph.charAt(alph.indexOf(str.charAt(i).toLowerCase())+shift));
        else encodeStr = encodeStr.concat(alph.charAt(shift - n + alph.indexOf(str.charAt(i).toLowerCase())));
    }
    return encodeStr;
}

function decode(str, alph)
{
    var gt = createGT();
    var lt = createLT(str);
    for (var i = 0; i < alph.length; i++)
    {
        if (!(alph.charAt(i) in lt)) lt[alph.charAt(i)] = 0;
        if (!(alph.charAt(i) in gt)) gt[alph.charAt(i)] = 0;
    }
    decodeStr = "";
    var msum = 1;
    var shift = 0;
    var n = alph.length;
    
    for (var i = 0; i < n; i++)
    {
        var sum = 0;
        for (var j = 0; j < str.length; j++)
        {
            if (alph.indexOf(str.charAt(j)) >= i) sum += (gt[alph.charAt(alph.indexOf(str.charAt(j))-i)] - lt[str.charAt(j)]) * (gt[alph.charAt(alph.indexOf(str.charAt(j))-i)] - lt[str.charAt(j)]);
            else sum += (gt[alph.charAt(n - i + alph.indexOf(str.charAt(j)))] - lt[str.charAt(j)]) * (gt[alph.charAt(n - i + alph.indexOf(str.charAt(j)))] - lt[str.charAt(j)]);
        }
        if (msum > sum)
        {
            msum = sum;
            shift = i;
        }
    }
    for (var i = 0; i < str.length; i++)
    {
        if (alph.indexOf(str.charAt(i)) - shift >= 0) decodeStr = decodeStr.concat(alph.charAt(alph.indexOf(str.charAt(i))-shift));
        else decodeStr = decodeStr.concat(alph.charAt(n - shift + alph.indexOf(str.charAt(i))));
    }
    return decodeStr;
}


str = WScript.StdIn.ReadLine();
shift = Number(WScript.StdIn.ReadLine());
encode = encode(str, shift, alph);
decode = decode(encode, alph);
WSH.echo(shift)
WScript.echo("Encode string: ", encode);
WScript.echo("Decode string: ", decode)