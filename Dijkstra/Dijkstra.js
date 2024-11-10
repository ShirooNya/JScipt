fso = new ActiveXObject("Scripting.FileSystemObject");
file = fso.OpenTextFile("Dijkstra.txt");
var string = file.Readline();

var priorities = { // расставляем приоритеты знаков
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3
};

var values = {}

while(!file.AtEndOfStream) // записываем в ассоциативный массив операнды и их значения
{
    line = file.Readline();
    parts = line.split('=');
    operand = parts[0];
    values[operand] = parts[1];
}

stack = new Array();
result = new Array();
stackIn = 0; // индекс массива со стеком
resultIn = 0; // индекс массива с результатом
countBrackets = 0; // счетчик скобок

// запись в польской нотации

for (var i = 0; i < string.length; i++)
{
    symbol = string.charAt(i); // заводим символ в отдельную переменную для удобства
    if (symbol == '(') // если встретили открывающуюся скобку, кидаем в стек
    {
        stack[stackIn] = '(';
        stackIn++;
        countBrackets++;
    }
    else if (symbol == ')') // если встретили закрывающуюсю, то все из стека кидаем в результат до открывающейся
    {
        countBrackets--
        for (stackIn - 1; stackIn >= 0; stackIn--, resultIn++)
        {
            if (stack[stackIn - 1] == '(')
            {
                stackIn--;
                stack.pop();
                break;
            }
            result[resultIn] = stack[stackIn - 1];
            stack.pop();
        }
    }
    else if (symbol in priorities) // если символ есть в нашем ассоциативном массиве со знакками, значит это знак.
    {
        if (!(stack[stackIn - 1] in priorities)) // если до знака в стеке нет других знаков, то спокойно его записываем в стек
            {
                stack[stackIn] = symbol;
                stackIn++;
            }
        else if (priorities[symbol] <= priorities[stack[stackIn - 1]]) // если есть знак, при этом приоритет нашего меньше или равен, то его записываем в стек, а другой в результат
        {
            result[resultIn] = stack[stackIn - 1];
            stack[stackIn - 1] = symbol;
            resultIn++;
        }
        else // если приоритет больше, то добавляем наш знак в стек
        {
            stack[stackIn] = symbol;
            stackIn++;
        }
    }
    else // остальные случаи - это операнды
    {
        result[resultIn] = symbol;
        resultIn++;
    }
}

if (countBrackets != 0)
{
    WSH.echo("Error: brackets are placed incorrectly.") // проверка на наличие всех скобок
}
else 
{
    for (stackIn - 1; stackIn >= 0; stackIn--, resultIn++) // строка закончилась -> переписываем хвост в результат
        {
            result[resultIn] = stack[stackIn - 1];
            stack.pop();
        }
    result.pop();
    WSH.echo(result);
}

// вычисление выражения
zero = true;
stackIn = 0;
for (var i = 0; i < result.length && zero; i++)
{
    symbol = result[i];
    if (!(symbol in priorities)) // если у нас встретился операнд, то в стек кладем значения этого операнда
    {
        stack[stackIn] = values[symbol];
        stackIn++;
    }
    else
    {
        if (symbol == '^') // прописываем возведение
            stack[stackIn - 2] = Math.pow(stack[stackIn - 2], stack[stackIn - 1]);
        else if (eval(stack[stackIn - 2] + symbol + stack[stackIn - 1]) == "Infinity") // проверка на деление на 0
        {
            WSH.echo("Error: you can't divide by zero.")
            zero = false;
        }
        else
            stack[stackIn - 2] = eval(stack[stackIn - 2] + symbol + stack[stackIn - 1]); // берем последние 2 операнда в стеке и выполняем соответствующее действие
        stackIn--;
    }
}
if (zero)
    WSH.echo(stack[stackIn - 1]);
