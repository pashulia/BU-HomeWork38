# BU-HomeWork38

web3 homework download lib web3(yarn add web3/npm install web3) web3 homework download lib readline-sync(yarn add readline-sync/npm install readline-sync) web3 homework download lib solc(yarn add solc@0.8.17+commit.8df45f5f/npm install solc@0.8.17+commit.8df45f5f)

Задача 1

Напишите два контракта Caller и Respondent
Caller должен вызывать некоторую функцию target(uint256, address, string),  контракте Respondent при помощи низкоуровневого вызова.
При этом в target() должен срабатывать некоторый ивент eventCall(uint256 indexed, address indexed, string)

Напишите скрипт, который компилирует и деплоит контракты в сети.

Затем, при помощи изученных методов создаст байтмассив с calldata для вызова target() и вместе с адресом контракта Respondent передаст в функцию call(address, bytes) контракта Caller. В этой функции и должен произойти вызов функции target() контракта Respondent

Подпишитесь на событие eventCall()

Сделайте вызов функции call()

При помощи изученных в уроке методов декодируйте логи события и выведите результат в консоль


Задание 2

Потренироваться работать с методами web3.utils

Изучить документацию по BN.js https://github.com/indutny/bn.js/