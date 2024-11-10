var s = "abcdhbhbgbcdayfabcdhdbgabcd";
var t = "abcd";
len_s = s.length;
len_t = t.length;
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
            WSH.echo(i);
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







/*
var s = "abcdhyfabcdhdbgabcd";
var t = "abcd";
var char = '';
len_s = s.length;
len_t = t.length;
N = new Array();
for (var j = 0; j < len_t; j++)
    N[t.charAt(j)] = j + 1;
for (j in N)
    WSH.echo('N[',j,']=', N[j]);

for (var i = 0; i < len_s; i++)
    {
        WSH.echo(s.charAt(i), i, s.charAt(i + len_t - 1), t.charAt(len_t - 1)); 
        var count = 0, l;
        if (s.charAt(i) == t.charAt(0) && s.charAt(i + len_t - 1) == t.charAt(len_t - 1))  // если 1-й и последний символы совпадают, то проверяем символы справа налево
            {
                
                for (var j = 1; j <= len_t; j++)
                {
                    if (s.charAt(i + len_t - j) != t.charAt(len_t - j)) // если встретились различные символы, то прикрываем лавочку, запоминаем позицию и сам символ
                    {
//                        WSH.echo(s.charAt(i), i, s.charAt(i + len_t - j)); 
                        char = s.charAt(i + len_t - j);
                        l = j;
                        j = len_t;
                    }
                    else // иначе увеличиваем счетчик
                        count++;
                }
//                WSH.echo(count);
                if (count == len_t) // если счетчик равен длине шаблона, то нашлось выхождение, выводим позицию
                    WSH.echo(i);
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
        else
            {
                i += len_t - 1;
            }
        
    }


*/
