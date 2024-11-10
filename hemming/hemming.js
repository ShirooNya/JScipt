WSH.echo("Enter the string: ")
var str = WScript.StdIn.Readline();

function xorPositions(unitPositions) // складываем по модулю двоичные значения номеров позиций
{
    var maxZero = unitPositions[unitPositions.length - 1].length; // берем длину максимального номера позиции, чтобы остальным числам допить нули

    for (var i = 0; i < unitPositions.length; i++) // добивка нулей. идем по каждому элементу массива
        {
            missingZero = maxZero - unitPositions[i].length; // определяем, сколько нулей не хватает
            while (missingZero > 0) // приписываем в начало строки, пока нули не закончатся
            {
                unitPositions[i] = '0' + unitPositions[i];
                missingZero--;
            }
        }
    maxZero--;
    var checkSum = ''; // контрольная сумма
    while(maxZero >= 0) // перебор каждого разряда
    {
        var rankSum = 0; // сумма для каждого разряда
        for (var i = 0; i < unitPositions.length; i++) // идем по каждому элементу массива и складываем соответствующие разряды
            {
                rankSum += Number(unitPositions[i].charAt(maxZero));
            }
        checkSum = rankSum % 2 + checkSum; // записываем xor каждого разряда
        maxZero--;
    }
    return checkSum;
}

function findCheckSum(strFindUnit)
{
    var unitPositions = new Array(); // создаем массив, в который будем добавлять номер позиции в двоичном виде
    for (var i = strFindUnit.length - 1; i >= 0; i--)
    {
        if (strFindUnit.charAt(i) == '1') { unitPositions.push(Math.abs(i - strFindUnit.length).toString(2)); } // если цифра = 1, то записываем в массив номер ее позиции, переведенный в двоичный вид
    }
    return xorPositions(unitPositions); // возвращаем контрольную сумму с помощью функции, которая обрабатывает массив (добили нулями и посчитали сумму)
}

function encode(string)
{
    var s_len = string.length;
    var hemmingStr = '*'; // в конце строки всегда будет звездочка, поэтому можно добавить ее сразу
    var degree = 1; // степень корня
    var i = s_len - 1;
    var position = 1; // позиции с конца

    while (i >= 0)
    {
        position++; // увеличиваем номер позиции
        if (Math.pow(position, 1/degree) == 2) // если номер позиции является степенью двойки, то приписываем звездочку в начала формируемой строки, степень корня увеличиваем
            {
                hemmingStr = '*' + hemmingStr;
                degree++;
            }
        else // иначе к формируемой строке записываем символы изначальной строки
        {
            hemmingStr = string.charAt(i) + hemmingStr;
            i--;
        }
    }

    var checkSum = findCheckSum(hemmingStr) // определяем первую контрольную сумму
//    WSH.echo(checkSum)
    for (var i = 0, j = 0; i < hemmingStr.length; i++) // j - индекс контрольной суммы
        {
            if (hemmingStr.charAt(i) == '*')
            {
                hemmingStr = hemmingStr.substring(0, i) + checkSum.charAt(j) + hemmingStr.substring(i + 1);
                j++;
            }
        }
    return hemmingStr;
}

function decode(encodedStr)
{
    encodedStr_len = encodedStr.length;
    decodedStr = "";
    var degree = 1; // степень корня
    var position = 1; // позиции с конца

    while (position <= encodedStr_len)
    {
        position++; // увеличиваем номер позиции
        if (!(Math.pow(position, 1/degree) == 2)) 
        {
            decodedStr = encodedStr.charAt(encodedStr_len - position) + decodedStr
        }
        else degree++;
    }
    return decodedStr;
}

function checkError(isErrorStr)
{
    var checkSum = findCheckSum(isErrorStr); // назодим контрольную сумму
    if (checkSum == 0) // если она равна 0, то все хорошо
    {
        dec = decode(isErrorStr)
        WSH.echo("Message encoded successfully.")
    }
    else // если не равно 0, то пытаемся исправить ошибку
        {
            var errorInx = isErrorStr.length - parseInt(checkSum, 2); // находим индекс, на котором находится ошибка
            if (isErrorStr.charAt(errorInx) == 1) isErrorStr = isErrorStr.substring(0, errorInx) + '0' + isErrorStr.substring(errorInx + 1); // если на ошибочном месте 1, то заменяем на 0
            else isErrorStr = isErrorStr.substring(0, errorInx) + '1' + isErrorStr.substring(errorInx + 1); // если 0, то заменяем на 1
            if (findCheckSum(isErrorStr) == 0) // снова находим контрольную сумму. Если она равна 0, то больше ошибок нет
                {
                    dec = decode(isErrorStr);
                    WSH.echo("Message encoded successfully. Error number:", parseInt(checkSum, 2))
                }
            else return "The message cannot be decoded"; // иначе есть еще одна ошибка --> нельзя декодировать сообщение
        }
    return dec;
}

var encoded = encode(str)
WSH.echo("Encoded", encoded)
decoded = checkError("10011000101");
WSH.echo("Decoded", decoded)
