function Node(name, freq, code, used, parent) // структура для дерева
{
    this.name = name;
    this.freq = freq;
    this.code = code;
    this.used = used;
    this.parent = parent;
}

function cmp(a, b) // функция для сортировки с помощью sort
{
    if (String(a.freq) < String(b.freq)) return -1;
    if (String(a.freq) > String(b.freq)) return 1;
    return 0;
}

function createTree(string) // функецияфункция создания дерева 
{
    var alph = new Array(); // массив для частотного алфавита
    var countChar = 0; // переменная для подсчета количества букв
    for (var i = 0; i < string.length; i++) // ассоциативный массив
    {
        if (alph[string.charAt(i)]) alph[string.charAt(i)]++
        else
        {
            alph[string.charAt(i)] = 1;
            countChar++;
        }
    }
    var tree = new Array();

    for (char in alph) tree.push(new Node(char, alph[char], '', false, -1))
    var i = 0; // индекс, который будет проходить по каждому элементу дерева
    while(tree[tree.length - 1].name.length != countChar) // циклвыполняем алгоритм построения дерева, пока последний элемент не будет равен количеству букв в алфавите
    {
        tree.sort(cmp); //сортируем дерево каждый раз перед выполнением алгоритма
        var countFalse = 0; // счетчик количества подобранныъ элементов
        var i = 0; // индекс, который будет проходить по каждому лепестку дерева и искать неиспользованный
        var indexFalse = []; // массив, в котором будут храниться индексы найденныъ элементов для работы
        while (countFalse != 2) // цикл для поиска двух элементов, которые еще не были использованы
        {
            if (tree[i].used == false) // нашли неиспользованный элемент. Добавляем его индекс в массив indexFalse и меняем значение used
            {
                tree[i].used = true;
                indexFalse[countFalse] = i;
                countFalse++;
            }
            i++;
        }
        tree.push(new Node(tree[indexFalse[0]].name + tree[indexFalse[1]].name,  tree[indexFalse[0]].freq + tree[indexFalse[1]].freq, '', false, -1)) // создаем новый лепесток, объединив 2 предыдущих лепестка
        tree[indexFalse[0]].parent = tree[indexFalse[1]].parent = tree[tree.length - 1].name // у взятых лепестков будет один родитель - только что полученный лепесток
        tree[indexFalse[0]].code = '0'; // взятым лепестькамлепесткам присваиваем код
        tree[indexFalse[1]].code = '1';
    }
    return tree;
}

function Encode(tree, string)
{
    for (var i = 0; i < tree.length; i++) // идем по каждому лепестку дерева
    {
        if (tree[i].name.length == 1) // находим лепесток с одной буквой
        {
            var parent = tree[i].parent; // находим его родителя
            while (parent != -1) // пока у нас будет находиться родитель родителя, мы к коду самых первых лепестков будем приписывать коды последующих лепестков
            {
                for (var j = 0; j < tree.length; j++) if (tree[j].name == parent) var inxParent = j; // сохраняем индекс родителя, чтобы взять его код
                tree[i].code = tree[inxParent].code + tree[i].code; 
                parent = tree[inxParent].parent; // нахождение нового родителя 
            }
        }
    }
    var encode = "";
    for (var i = 0; i < string.length; i++)
        {
            for (var j = 0; j < tree.length; j++) if (tree[j].name == string.charAt(i)) var charInx = j;
            encode += tree[charInx].code;
        }
    return encode;
}

function Decode(tree, string)
{
    var decoded = "";
    var charCode = "";
    for (var i = 0; i < string.length; i++)
        {
            charCode += string.charAt(i);
            for (var j = 0; j < tree.length; j++)
            {
                var char = tree[j].name
                if (char.length == 1 && tree[j].code == charCode)
                {
                    decoded += char;
                    charCode = "";
                }
            }
        }
    return decoded;
}

WSH.echo("Enter the string:");
var str = WScript.StdIn.Readline();
finishedTree = createTree(str);
encodedStr = Encode(finishedTree, str);
decodedStr = Decode(finishedTree, encodedStr);
WSH.echo("Encoded string:", encodedStr);
WSH.echo("Decoded string:", decodedStr);
for (var j = 0; j < finishedTree.length; j++)
    WSH.echo(finishedTree[j].name, finishedTree[j].freq, finishedTree[j].code)

