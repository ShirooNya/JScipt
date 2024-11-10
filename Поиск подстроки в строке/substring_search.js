var fso = new ActiveXObject("Scripting.FileSystemObject");
var s = fso.OpenTextFile("T1.txt", 1).ReadAll();
var t = "Князь Андрей";

len_s = s.length;
len_t = t.length;
var countbf = 0, countHash1 = 0, countHash2 = 0, countHash3 = 0;


function BF(s, t)
{
    var j = 0;
    while (s.charAt(i + j) == t.charAt(j)) // если символ подстороки равен символу в строке, то переходим к следующим символам и увеличиваем счетчик j
        {
            j++;
            if (j == len_t) // если счетчик равен количеству символов подстроки, то значит, что все символы совпали
                {
                    return(i); // выводим индекс
                    break;
                }
        }
}

// --------------------- BRUTEFORCE --------------------- //

var start = new Date();
bf = new Array();

for (var i = 0; i < len_s; i++)
{
    if (BF(s, t) == i)
    {
        countbf++;
        if (bf.length < 10)
            bf.push(i);
    }
}
var end = new Date();
WSH.echo("------------------------------------")
WSH.echo("Bruteforce:", bf);
WSH.echo("Bruteforse occurrences:", countbf);
WSH.echo("BF execution time:", (end - start) / 1000, "second");

// --------------------- HASH_1 --------------------- //

start = new Date();
var t_hash = 0, s_hash = 0, hash1Count = 0, hash1_coll = 0;
hash1 = new Array();

for (var i = 0; i < len_t; i++) // считаем сумму кодов подстроки и сумму кодов первых символов строки
    {
        t_hash += t.charCodeAt(i); 
        s_hash += s.charCodeAt(i);
    }

for (var i = 0; i < len_s - 1; i++)
{
    if (t_hash == s_hash) // если сумма кодов совпадает, то запускаем брутфорс. Если строки совпадают, то выводим индекс, иначе - коллизия
        {
            if (BF(s, t) == i)
            {
                countHash1++;
                if (hash1.length < 10)
                    hash1.push(i);
            }
            else
                hash1_coll++;
        }
    s_hash = s_hash - s.charCodeAt(i) + s.charCodeAt(i + len_t);
}

end = new Date();
WSH.echo("------------------------------------")
WSH.echo("Hash 1:",hash1);
WSH.echo("Hash 1 collision:", hash1_coll);
WSH.echo("Hash 1 occurrences:", countHash1)
WSH.echo("H1 execution time:", (end - start) / 1000, "second");

// --------------------- HASH_2 --------------------- //

start = new Date();
var hash2Count = 0, hash2_coll = 0;
hash2 = new Array();
t_hash = s_hash = 0;

for (var i = 0; i < len_t; i++) // считаем сумму кодов подстроки и сумму кодов первых символов строки
    {
        t_hash += t.charCodeAt(i) * t.charCodeAt(i); 
        s_hash += s.charCodeAt(i) * s.charCodeAt(i);
    }

for (var i = 0; i < len_s - 1; i++)
{
    if (t_hash == s_hash) // если сумма кодов совпадает, то запускаем брутфорс. Если строки совпадают, то выводим индекс, иначе - коллизия
        {
            if (BF(s, t) == i)
            {
                countHash2++;
                if (hash2.length < 10)
                    hash2.push(i);
            }
            else
                hash2_coll++;
        }
    s_hash = s_hash - (s.charCodeAt(i) * s.charCodeAt(i)) + (s.charCodeAt(i + len_t) * s.charCodeAt(i + len_t));
}

end = new Date();
WSH.echo("------------------------------------")
WSH.echo("Hash 2:", hash2);
WSH.echo("Hash 2 collision:", hash2_coll);
WSH.echo("Hash 2 occurrences:", countHash2);
WSH.echo("H2 execution time:", (end - start) / 1000, "second");

// --------------------- HASH_3 --------------------- //

start = new Date();
var hash3Count = 0, hash3_coll = 0, j = 0;
hash3 = new Array();
t_hash = s_hash = 0;
for (var i = 0; i < len_t; i++)
{ 
    t_hash = t_hash * 2 + t.charCodeAt(i); 
    s_hash = s_hash * 2 + s.charCodeAt(i);
}
t_hash *= 2;
s_hash *= 2;
for (var i = 0; i < len_s - len_t; i++) {
    if (t_hash == s_hash) {
        if (BF(s, t) == i) {
            countHash3++;
            if (hash3.length < 10)
                hash3.push(i);
        } else
            hash3_coll++;
    }
    s_hash = ((s_hash - s.charCodeAt(i) * (2 << len_t - 1)) + s.charCodeAt(i + len_t)) * 2;
}

end = new Date();
WSH.echo("------------------------------------")
WSH.echo("Hash 3:", hash3);
WSH.echo("Hash 3 collision:", hash3_coll);
WSH.echo("Hash 3 occurrences:", countHash3);
WSH.echo("H3 execution time:", (end - start) / 1000, "second");
WSH.echo("------------------------------------")

// --------------------- BM --------------------- //

start = new Date();
var countBM = 0;
BM = new Array();
var char = '';
N = new Array();
for (var j = 0; j < len_t; j++)
    N[t.charAt(j)] = j + 1;

for (var i = 0; i < len_s; i++)
{
    var count = 0, l;
    for (var j = 1; j <= len_t; j++)
    {
        if (s.charAt(i + len_t - j) != t.charAt(len_t - j)) // если встретились различные символы, то прикрываем лавочку, запоминаем позицию и сам символ
            {
                char = s.charAt(i + len_t - j);
                l = j;
                j = len_t;
            }
                else // иначе увеличиваем счетчик
                    count++;
    }
    if (count == len_t) // если счетчик равен длине шаблона, то нашлось выхождение, выводим позицию
        {
            countBM++;
            if (BM.length < 10)
                BM.push(i);
        }
    else // иначе у нас подстроки не совпадает. делаем сдвиг
        {
            if (N[char])
                i += Math.max(1, (len_t - l - N[char])) - 1;
            else
            {
                i += len_t - 1;
            }
        }
}
end = new Date();
WSH.echo("BM:", BM);
WSH.echo("BM occurrences:", countBM);
WSH.echo("BM execution time:", (end - start) / 1000, "second");
WSH.echo("------------------------------------")