WSH.echo("Enter the first number");
number1 = WScript.StdIn.Readline();
WSH.echo("Enter the second number");
number2 = WScript.StdIn.Readline();
pocket = 1; // кармашек с единицей

function toBin(num) // функция перевода числа в двоичное
{
    num = Math.abs(num);
    var int = Math.floor(num); // берем целую часть числа
    var float = num % 1; // берем дробную часть числа
    var numBin = ""; // переменная для записи двоичного вида числа
    if (int == 0) numBin += 0;
    while (int > 0) // перевод целой части
    {
        var a = int % 2;
        numBin = a + numBin;
        int = Math.floor(int / 2);
    }

    if (float != 0) numBin += '.';
    while(numBin.length < 25 && float != 0) // перевод дробной части
    {
        float *= 2;
        if (float >= 1)
        {
            numBin += 1;
            float %= 1;
        }
        else numBin += 0;
    }
    return numBin;
}

function fromBin(sBinary) // функция перевода из двоичной сс в десятичную
{
    var iNumFromBin = 0; // переменная для целой части
    (sBinary.indexOf('.') != -1) ? iPointPos = sBinary.indexOf('.') : iPointPos = sBinary.length; // если у нас есть запятая в числе -> число дробное, иначе нет
    var sIntPart = sBinary.substring(0, iPointPos); // берем целую часть числа
    var sFloatPart = sBinary.substring(iPointPos + 1); // берем дробную часть числа
    var sNoPoint = sIntPart + sFloatPart; // соединяем целую и дробные части (убираем запятую)
    var iPower = sIntPart.length - 1; // максимальная степень для перевода в десятичную сс
    for (i = 0; i < sNoPoint.length; i++, iPower--) // переводим число в десятичную сс
        {
            iNumFromBin += sNoPoint.charAt(i) * (Math.pow(2, iPower));
        }
    return iNumFromBin;
}

function toFloat(number)
{
    arrFloat = new Array(32); // массив, в котором будет формироваться внутренний вид числа

    for (i = 0; i < arrFloat.length; i++)
        arrFloat[i] = '0';

    var sciNum = toBin(Math.abs(number)); // переменная, в которую сохраняем наше двоичное число, чтобы представить число в научном виде и определить порядок числа
    if (number % 1 == 0) sciNum += '.' // добавляю точку, чтобы можно было найти порядок
    p = 0; // переменная для подсчета порядка числа

    if (Math.floor(Math.abs(number)) != 0) // если целая часть не равно 0, то сдвигаем запятую влево, порядок будет > 0
        {
            while (sciNum.indexOf('.') != 1)
            {
                var newPosition = sciNum.indexOf(".") - 1; // Новая позиция запятой
                var sciNum = sciNum.substring(0, newPosition) + "." + sciNum.substring(newPosition, newPosition + 1) + sciNum.substring(newPosition + 2); // Новая дробь с перемещенной запятой
                p++;
            }
        }
    else // если целая часть равно 0, то сдвигаем запятую влево, порядок будет < 0
    {
        while(Math.floor(Math.abs(sciNum)) != 1)
        {
            var newPosition = sciNum.indexOf(".") + 1; // Новая позиция запятой
            var sciNum = sciNum.substring(0, newPosition - 1) + sciNum.substring(newPosition, newPosition + 1) + "." + sciNum.substring(newPosition + 1); // Новая дробь с перемещенной запятой
            p--;
        }
        newPosition = sciNum.indexOf('.');
        sciNum = sciNum.substring(newPosition - 1);
    }

    var P = toBin(p + 127); // переводим машинный порядок в двоичный вид   
    (number > 0) ? arrFloat[0] = "0" : arrFloat[0] = "1"; // записываем знак числа в машинный вид

    for (i = 8, j = P.length - 1; j >= 0; i--, j--) // записываем машинный порядок в машинный вид
        arrFloat[i] = P.charAt(j); // записываем с конца

    for (i = 2; i < sciNum.length; i++) // записываем мантису в машинный вид
        arrFloat[i + 7] = sciNum.charAt(i);

    return arrFloat;
}

function fromFloat(float)
{
    if (typeof(float) != "string") float = float.join(''); // если передаваемое значение у меня - массив, то мы переводим его в строку, тк с ней легче работать
    var pLocal = fromBin(float.substring(1, 9)) - 127; // вырезаем машинный порядок, переводим из двоичной сс и находим степень научного числа

    if (pLocal >= 0) var backToNum = pocket + float.substring(9, 9 + pLocal) + '.' + float.substring(9 + pLocal); // если машинный порядок > 0
    else // если < 0
        {
            backToNum = "0."
            for (i = Math.abs(pLocal) - 1; i > 0; i--) backToNum += '0';
            backToNum += '1' + float.substring(9);            
        }

    backToNum = fromBin(backToNum) // переводим из двоичной системы
    if (float.charAt(0) == '1') backToNum = '-' + backToNum; // определение знака числа
    return backToNum;
}   

function subtractionFloat(subtracNum1, subtracNum2)
{
    var subtraction = "";
    var len = subtracNum1.length;
    var unit = 0; // единица, взятая из другого разряда
    for (var i = len - 1; i >= 0; i--) {
        var digit = parseInt(subtracNum1.charAt(i)) - parseInt(subtracNum2.charAt(i)) - unit;
        if (digit < 0) {
            unit = 1;
            if (digit == -2)
                subtraction = '0' + subtraction;
            else
                subtraction = '1' + subtraction;
        }
        else {
            unit = 0;
            subtraction = String(digit) + subtraction;
        }
    }

    var unitPosition = subtraction.indexOf('1') + 1; // находим индекс первой единицы в числе
    p -= unitPosition - 1;
    var subtractionShift = new Array(len);
    for (var i = 0; i < len; i++) {subtractionShift[i] = 0;}
    for (var i = unitPosition; i < len; i++) {subtractionShift[i - unitPosition] = subtraction.charAt(i)}

    return subtractionShift;
}

function beaгtifulView(num)
{
    if (typeof(num) == "object") { num = num.join(''); }
    num = (num.substring(0, 1) + ' ' + num.substring(1, 9) + ' ' + num.substring(9));
    return num;
}

function SumFloat(num1, num2) // подается 2 массива со float
{
    var sumFloat = new Array(); // создаем массив, в котором будем записывать сумму
    var remind = 0; // переменная, в которой будем запоминать единицу, которая переходит в следующий разряд
    mantisa1 = num1.slice(9); // вырезаем мантисы наших чисел
    mantisa2 = num2.slice(9);
    p = Math.max(pNum1, pNum2);
    var sgnAndPArr = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0) // создаем массив, в котором записываем знак и машинный порядок
    var diff = Math.abs(pNum1 - pNum2); // находим разницу порядком
    var shift = new Array(diff) // создаем массив, в котором будет нужное количество ведущих нулей
    for (var i = 0; i < diff; i++) shift[i] = 0; // заполняем массив нулями
    shift[diff - 1] = 1; // единица из кармашка

    if (pNum1 > pNum2) mantisa2 = shift.concat(mantisa2).slice(0, 23); // в зависимости от того, чей порядок больше, делаем сдвиг мантисы
    else if (pNum1 < pNum2) mantisa1 = shift.concat(mantisa1).slice(0, 23);

    if (parseInt(num1[0]) + parseInt(num2[0]) == 1) // если у нас числа с разными знаками, то будем вычитать из одного числа другое. Формируем для того нужную базу.
        {
            if (Math.abs(number2) > Math.abs(number1)) // меняем числа местами, чтобы число большее по модулю было первым, из него будет вычитать
                {
                    var mant = mantisa1;
                    mantisa1 = mantisa2;
                    mantisa2 = mant;
                }
            if (number1 < 0 && Math.abs(number1) > Math.abs(number2)) sgnAndPArr[0] = 1; // ответ будет иметь знак бОльшего числа
            else if (number2 < 0 && Math.abs(number2) > Math.abs(number1)) sgnAndPArr[0] = 1;

            mantisa1.unshift(1); // добавляем единицу из кармашка и удаляем элемент, выходящий за пределы
            mantisa1.pop();

            if (pNum1 != pNum2) // сдвиги мантиссы в зависимости от порядка 
                {
                    mantisa2.unshift(0);
                    mantisa2.pop();
                }
            else
            {
                mantisa2.unshift(1);
                mantisa2.pop();
            }

            sumFloat = subtractionFloat(mantisa1.join(''), mantisa2.join('')); // вычитаем 
        }
    else
    {
        if (parseInt(num1[0]) + parseInt(num2[0]) == 2) sgnAndPArr[0] = 1; // если знаковые биты двух чисел в сумме будут давать 2, то складываем 2 отрицательных числа
        if (pNum1 == pNum2) p++; // если машинные порядки чисел равны, то увеличиваем порядок на 1
        for (var i = mantisa1.length - 1; i >= 0; i--) // идем по мантисе с конца и складываем соответствующие элементы мантис
            {
                var forSwitch = parseInt(mantisa1[i]) + parseInt(mantisa2[i]) + remind; // находим сумму, которая будет получаться при сложении на каждом разряде
                switch (forSwitch)
            {
                case 0:
                    sumFloat[i + 1] = 0;
                    remind = 0;
                    break;
                    case 1:
                        sumFloat[i + 1] = 1;
                        remind = 0;
                        break;
                        case 2:
                            sumFloat[i + 1] = 0;
                            remind = 1;
                            break;
                            case 3:
                                sumFloat[i + 1] = 1;
                                remind = 1;
                                break;
            }
            }
        if (pNum1 == pNum2) // условия, для записи оставшейся единицы
            {
                if (remind == 1) {sumFloat[0] = 1;} // если у нас остается еще лишняя единица, мы ее записываем
                else {sumFloat[0] = 0;} // одновременно с этим просиходит сдвиг мантисы вправо
                sumFloat.pop(); // удаляем элемент, который выходит за сетку
            }
        else
        {
            if (remind == 1) // если осталась единица, то порядок увеличивается
                {
                    sumFloat[0] = 0; // при этом первый символ мантисы будет 0
                    p++;
                }
            else sumFloat.shift(); // удаляем выделенное место на случай дополнительного разряда при сложении
            //            sumFloat.pop(); // удаляем элемент, который выходит за сетку
        }
    }
    for (i = 8, j = toBin(p + 127).length - 1; j >= 0; i--, j--) // записываем машинный порядок в машинный вид
        sgnAndPArr[i] = toBin(p + 127).charAt(j); // записываем с конца
    sumFloat = sgnAndPArr.concat(sumFloat); // склеиваем мантису и знак с порядоком
    return sumFloat;
}

first = "First number in IEEE:";
second = "Second number in IEEE:";
result = "Result:";

num1 = toFloat(number1);
pNum1 = p;
num2 = toFloat(number2);
pNum2 = p;

if (isNaN(number1) || isNaN(number2))
{
    WSH.echo("Error: this is not a number.");
}
else if (number1 == 0 && number2 == 0)
{
    WSH.echo(first, "0 00000000 00000000000000000000000");
    WSH.echo(second, "0 00000000 00000000000000000000000");
    WSH.echo(result, 0);
}
else if (number1 == 0)
{
    WSH.echo(first, "0 00000000 00000000000000000000000");
    WSH.echo(second, beaгtifulView(toFloat(number2)));
    WSH.echo(result, number2)
}
else if (number2 == 0)
{
    WSH.echo(first, beaгtifulView(toFloat(number1)));
    WSH.echo(second, "0 00000000 00000000000000000000000");
    WSH.echo(result, number1)
}
else if ((number1 < 0 ^ number2 < 0) && Math.abs(number1) == Math.abs(number2))
{
    WSH.echo(first, beaгtifulView(toFloat(number1)));
    WSH.echo(second, beaгtifulView(toFloat(number2)));
    WSH.echo(result, 0);
}
else if (number1 >= 1e+38 && number2 >= 1e+38)
{
    WSH.echo(first, "0 11111111 00000000000000000000000");
    WSH.echo(second, "0 11111111 00000000000000000000000");
    WSH.echo(result, "+Inf");
}
else if (number1 >= 1e+38)
{
    WSH.echo(first, "0 11111111 00000000000000000000000");
    WSH.echo(second, beaгtifulView(toFloat(number2)));
    WSH.echo(result, "+Inf")
}
else if (number2 >= 1e+38)
{
    WSH.echo(first, beaгtifulView(toFloat(number1)));
    WSH.echo(second, "0 11111111 00000000000000000000000");
    WSH.echo(result, "+Inf")
}
else if (number1 <= -1e+38 && number2 <= -1e+38)
{
    WSH.echo(first, "1 11111111 00000000000000000000000");
    WSH.echo(second, "1 11111111 00000000000000000000000");
    WSH.echo(result, "-Inf");
}
else if (number1 <= -1e+38)
{
    WSH.echo(first, "1 11111111 00000000000000000000000");
    WSH.echo(second, beaгtifulView(toFloat(number2)));
    WSH.echo(result, "-Inf")
}
else if (number2 <= -1e+38)
{
    WSH.echo(first, beaгtifulView(toFloat(number1)));
    WSH.echo(second, "1 11111111 00000000000000000000000");
    WSH.echo(result, "-Inf")
}
else if (num1.join('').substring(1,9) == "11111111" && num1.join('').substring(9) > 0)
{
    WSH.echo(first, "NaN");
    WSH.echo(second, beaгtifulView(toFloat(number2)));
    WSH.echo(result, "NaN")
}
else if (num2.join('').substring(1,9) == "11111111" && num2.join('').substring(9) > 0)
{
    WSH.echo(first, beaгtifulView(toFloat(number1)));
    WSH.echo(second, "NaN");
    WSH.echo(result, "NaN")
}
else if (num2.join('').substring(1,9) == "11111111" && num2.join('').substring(9) > 0 && num1.join('').substring(1,9) == "11111111" && num1.join('').substring(9) > 0)
{
    WSH.echo(first, "NaN");
    WSH.echo(second, "NaN");
    WSH.echo(result, "NaN")
}
else
{
    WSH.echo("--------------------------------------");
    WSH.echo(first, beaгtifulView(num1))
    WSH.echo(second, beaгtifulView(num2))
    sum = SumFloat(num1, num2);
    if (sum.join('').substring(1) == '11111111100000000000000000000000')
        WSH.echo(result, "Inf");
    else if (sum.join('').substring(1, 9) == "11111111" && sum.join('').substring(9) > 0) WSH.echo(result, "NaN")
    else
    {
        WSH.echo("Sum in IEEE:", beaгtifulView(sum));
        WSH.echo(result, fromFloat(sum));
    }
    WSH.echo("--------------------------------------");
}