alph = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!?,.:-' ";
WSH.echo("Enter the string:")
s = WScript.StdIn.ReadLine();
WSH.echo("Enter the shift:")
shift = parseInt(WScript.StdIn.ReadLine());
WSH.echo("String:", s)
alph_len = alph.length
s_len = s.length;
encrypted = "";

// шифрование

if (shift > alph_len) shift %= alph_len; // корректировка сдвига
else if (shift < 0 && shift > -alph_len) shift += alph_len;
else if (shift <= -alph_len) shift = shift % alph_len + alph_len;

for (i = 0; i < s_len; i++) // шифрование
{
    char = s.charAt(i);
    var indexShift = alph.indexOf(char) + shift; // индекс символа со сдвигом
    if (indexShift >= alph_len) // если сдвиг выходит на пределы алфавита, то отправляем в начало строки
        indexShift %= alph_len;
    encrypted += alph.charAt(indexShift);
}

WSH.echo("Encrypted:", encrypted)

// расшифровка
transcript = ""
gt = {};
lt = {};
fso = new ActiveXObject("Scripting.FileSystemObject");
file = fso.OpenTextFile("BBITW.txt", 1).ReadAll();

for (i = 0; i < file.length; i++) // формируем глобальную таблицу частот 
{
    if (gt[file.charAt(i)]) gt[file.charAt(i)]++;
    else gt[file.charAt(i)] = 1;
}

for (char in gt) { gt[char] /= file.length} // вероятность втречи буквы

for (i = 0; i < s_len; i++) // формируем локальную таблицу частот
{
    if (lt[encrypted.charAt(i)]) lt[encrypted.charAt(i)]++;
    else lt[encrypted.charAt(i)] = 1;
}

for (char in lt) { lt[char] /= s.length} // вероятность встречи

minsum = 1000000;
for (var j = 1; j < alph_len; j++) {
    var sum = 0;
    
    // находим сдвиг. если берем символ из зашифрованной строки, находим его индекс в алфавите. Перебором сдвига находим индекс нужного символа в алфавите и сравниваем символ
    // по этом индексу из глобальной таблицы с символом из строки в локальной таблице. Если у нас сдвиг выходит за пределы алфавита, то сдвиг переходит в конец алфавита 
    for (var i = 0; i < s_len; i++)
    {
        if (!(alph.indexOf(encrypted.charAt(i)) - j < 0)) sum += Math.pow(gt[alph.charAt(alph.indexOf(encrypted.charAt(i)) - j)] - lt[encrypted.charAt(i)], 2)
        else sum += Math.pow(gt[alph.charAt(alph_len - (j - alph.indexOf(encrypted.charAt(i))))] - lt[encrypted.charAt(i)], 2) 
    }
    if (sum < minsum) // если новая сумма меньше минимальной, то сохраняем ее и найденный сдвиг
    {
        minsum = sum;
        shift = j;
    }
}

for (i = 0; i < s_len; i++) // дешифрируем строку
{
    char = encrypted.charAt(i);
    var indexShift = alph.indexOf(char) - shift; // сдвигаем индекс на индекс нужного символа
    if (indexShift < 0) indexShift = alph_len + indexShift; // если этот индес меньше 0, значит, что он вышел за пределы алфавита -> переходим в конец алфавита 
    if (alph.charAt(indexShift) == '') transcript += ' '; // корректная запись пробела
    else transcript += alph.charAt(indexShift);
}

WSH.echo("shift:", shift)
WSH.echo("transcript:", transcript)

