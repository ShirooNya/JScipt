var fso = new ActiveXObject("Scripting.FileSystemObject");
var s = fso.OpenTextFile("T1.txt", 1).ReadAll();
var t = "чfvsjvsc"; 
m = t.length;
n = s.length;
alph = new Array();

//Определяем алфавит строки t
for(i = 0; i < m; i++)
    alph[t.charAt(i)] = 0;
//В двумерном массиве del храним таблицу переходов
del = new Array(m + 1);
for(j = 0; j <= m; j++)
    del[j] = new Array();

//Инициализируем таблицу переходов
for(i in alph)
    del[0][i] = 0;

//Формируем таблицу переходов
for(j = 0; j < m; j++)
{
    prev = del[j][t.charAt(j)];
    del[j][t.charAt(j)] = j + 1;
    
    for(i in alph)
        del[j + 1][i] = del[prev][i];
}

//Выводим таблицу переходов
for (j = 0; j <= m; j++)
    {
        out = '';
        for (i in alph)
            {
                out += del[j][i] + ' ';
            }
        WSH.echo(out)
    }

q = 0;
noOccur = true;
for (var i = 0; i < n; i++)
{
    if ((s.charAt(i) in alph))
    {
        q = del[q][s.charAt(i)]
        if (q == m)
        {
            q = 0;
            noOccur = false;
            WSH.echo(i - m + 1);
            continue;
        }
    }
    else { q = 0; }
}
if (noOccur) WSH.echo("No occurrences")

//138118,138425,150372,162616,166142,171746,179087,181607,182255,183325