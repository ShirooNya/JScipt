// esc-кодирование--------------------------

var string, symbol, count = 1, save1, save2, esc_enc = '', i;
WSH.echo('Enter the string:');
string = WScript.StdIn.ReadLine();
WSH.echo('Enter the special symbol:');
symbol = WScript.StdIn.ReadLine();
for (i = 0; i < string.length; i++)
{
	save = i; // сохраняем i, чтобы вернуться для запись символов в новую строку
	while (string.charAt(i) == string.charAt(i + 1)) // пока 2 символа равны, то увеличиваем счетчик одинаковых символов, i 
		{
			count += 1;
			i += 1;
			save2 = i; // сохраняем место, чтобы после записи вернуться к следующим символам
		}
	i = save;
	if (count <= 3 && string.charAt(i) != symbol) // если у нас счетчик меньшк 3 и кодируемый символ не равен специальному
	{
		esc_enc += string.charAt(i); // записываем в строку
		count = 1;
	}
	else if (string.charAt(i) == symbol) // если символ равен специальному
		{
			while (count > 255) // если специальный символ пояторяется больше 255 раз
				{
					esc_enc += symbol + String.fromCharCode(255) + symbol;
					count -= 255;
				}
			esc_enc += symbol + String.fromCharCode(count) + symbol; // кодирование оставшихся символов (символов, которых меньше 255)
			if (count > 1) // если было несколько одинаковых символов, то после записи возвращаемся туда, где они закончились
				i = save2;
			else // иначе просто идем дальше
				i + 1;
			count = 1;
		}
	else // записываем одинаковые символы, при этом кодируемый символ не равен специальному
		{
			while (count > 258) // случай, если символы посторяются больше 255 раз
				{
					esc_enc += symbol + String.fromCharCode(255) + string.charAt(i);
					count -= 258;
				}
			esc_enc += symbol + String.fromCharCode(count - 3) + string.charAt(i); // дописываем оставшие символы
			i = save2;
			count = 1;
		}
}
WSH.echo("Esc encoded:", esc_enc);

// decoding--------------------	

var esc_dec = "", j;
for (var i = 0; i < esc_enc.length; i++)
{
	if (esc_enc.charAt(i) == symbol) // если встречаем специальный символ, значит дальше закодированная строка
	{
		if (symbol != esc_enc.charAt(i + 2)) // проверка на то, что был закодирован не специальный символ
		{
			for (j = 0; j < esc_enc.charCodeAt(i + 1) + 3; j++) // записываем в строку одинаковые символы 
				esc_dec += esc_enc.charAt(i + 2);
		}
		else // если был закодирован специальный символ
			{
				for (j = 0; j < esc_enc.charCodeAt(i + 1); j++) // записываем в троку
					esc_dec += esc_enc.charAt(i + 2);
			}
		i += 2;
	}
	else
		esc_dec += esc_enc.charAt(i); // иначе переписываем различные символы
}
WSH.echo("-----------------------")
WSH.echo("Esc decoded:" + esc_dec)

// jump-кодирование---------------------

var countdif = 0, countsame = 1, jump_enc = "", jmp = "";
var i = 0;

while (i < string.length)
{
	if (string.charAt(i) == string.charAt(i + 1))
	{
		countsame++;
		if (countdif > 0) // если до этого были различные символы, то записываем их в строку
		{
			while (countdif > 127) // цикл, если различных символов больше 127
			{
				jump_enc += String.fromCharCode(128 + 127);
				countdif -= 127;
			}
			jump_enc += String.fromCharCode(128 + countdif) + jmp; // оставшиеся символы
			countdif = 0;
			jmp = ""; // обновление промежуточной строки
		}
	}
    else
	{
		if (countsame > 0) // если до этого были одинаковые символы, то они записываются в строку
		{
			while (countsame > 127) // цикл, если одинаковых символов больше 127
			{
				jump_enc += String.fromCharCode(127) + string.charAt(i);
				countsame -= 127;
			}
			jump_enc += String.fromCharCode(countsame) + string.charAt(i);  // оставшиеся символы
			countsame = 1;
		}
            else
			{
				countdif++;
				jmp += string.charAt(i);
			}
	}
	i++;
}
if (countdif > 0) // записываем оставшийся хвост
{
	while (countdif > 127)
	{
		jump_enc += String.fromCharCode(128 + 127);
		countdif -= 127;
	}
	jump_enc += String.fromCharCode(128 + countdif) + jmp;
}
WSH.echo("-----------------------")
WSH.echo("Jump encoded:", jump_enc);

// jump-декодирование

var jump_dec = "";

for (i = 0; i < jump_enc.length; i++)
	{
		
		if (jump_enc.charCodeAt(i) > 128) // декодинг различных символов
			{
				if (jump_enc.charCodeAt(i) == 255) // есть шанс, что различных символов будет больше 127
					{
						if (jump_enc.charAt(i + 129) != jump_enc.charAt(i + 130)) // если при прыжке попадаем туда, куда не нужно, значит, символов больше 127. Увеличиваем счетчик и идем дальше
							countdif += 127;
						else // если попали туда, куда нужно, значит, символов было меньше 127
							countdif = 127;
					}
				else // условие, если различных символов будет меньше 127
				{				
					countdif += jump_enc.charCodeAt(i) - 128;
					while (countdif > 0) // запись различных символов
					{
						i++;
						jump_dec += jump_enc.charAt(i);    
						countdif--;
					}
				}
			}
		else // декодинг одинаковых символов
			{
				countsame = jump_enc.charCodeAt(i); // присваиваем счетчику кол-вор одинаковых символов
				i++
				while (countsame > 0) // записываем их
				{
					jump_dec += jump_enc.charAt(i);
					countsame--;
				}
			}		
	}
WSH.echo("-----------------------")
WSH.echo("Jump decoded:", jump_dec);
