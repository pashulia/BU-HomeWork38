const Web3 = require('web3')
const fs = require('fs');
const solc = require('solc');
const readline = require('readline-sync')
let web3 = new Web3('http://127.0.0.1:7545')
let fName = "contracts.sol";
let cName = "Example";


function myCompiler(solc, fileName, contractNames, contractCode) {
    // настраиваем структуру input для компилятора
    let input = {
        language: 'Solidity',
        sources: {
            [fileName]: {
                content: contractCode
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // console.log("Compilation result: ", output);
    // console.log("Compilation result: ", output.contracts);

    let ABI = output.contracts[fName].Caller.abi;
    let bytecode = output.contracts[fName].Caller.evm.bytecode.object;
    let ABI2 = output.contracts[fName].Respondent.abi;
    let bytecode2 = output.contracts[fName].Respondent.evm.bytecode.object;

    fs.writeFileSync(__dirname + '/' + 'Caller' + '.abi', JSON.stringify(ABI));
    fs.writeFileSync(__dirname + '/' + 'Caller' + '.bin', bytecode);
    fs.writeFileSync(__dirname + '/' + 'Respondent' + '.abi', JSON.stringify(ABI2));
    fs.writeFileSync(__dirname + '/' + 'Respondent' + '.bin', bytecode2);
}

// если хотите автоматически, то попробуйте 
// const abi = await web3.eth.getAbi(address);

async function main() {

    // считываем код контракта из файла
    let cCode = fs.readFileSync(__dirname + "/" + fName, "utf-8")
    
    try {
        myCompiler(solc, fName, cName, cCode)
    } catch (err) {
        console.log(err);

        let compileVers = 'v0.8.15+commit.e14f2714'
        solc.loadRemoteVersion(compileVers, (err, solcSnapshot) => {
            if (err) {
                console.log(err);
            } else {
                myCompiler(solcSnapshot, fName, cName, cCode)
            }
        })
    }     

    let key = "0x8e2d55c7f19d1dd6a04e656b53c6c83b9b82289ae1f6566fc6973e5c834d130f"
    let account = web3.eth.accounts.privateKeyToAccount(key)
    
    // считываение уже развернутого контракта по указаному пути
    const ABI = JSON.parse(fs.readFileSync(__dirname + '/' + 'Caller.abi', 'utf-8'))
    const bytecode = fs.readFileSync(__dirname + '/' + 'Caller.bin', 'utf-8')
    const ABI2 = JSON.parse(fs.readFileSync(__dirname + '/' + 'Respondent.abi', 'utf-8'))
    const bytecode2 = fs.readFileSync(__dirname + '/' + 'Respondent.bin', 'utf-8')

    // Создает новый экземпляр контракта и связывает его с уже развёрнутым в сети контрактом
    let myContract = new web3.eth.Contract(ABI)
    let myContract2 = new web3.eth.Contract(ABI2)
    // console.log(myContract);
    // console.log(myContract2);

    // Деплой контракта Caller
    await myContract.deploy({
        data: bytecode, 
        arguments: ['0x124a91a739E8b398B8Dd91edb59f36Cd46Ace05c']
    })
    .send({
        from: account.address,
        gas: 5_000_000 
    })
    // .on('receipt', (receipt) => {
    //     console.log(receipt);
    // })
    .then(function(newContractInstance) {
            myContract = newContractInstance
        }
    )

    // Деплой контракта Respondent
    await myContract2.deploy({
        data: bytecode2, 
    })
    .send({
        from: account.address,
        gas: 5000000 
    })
    .then(function(newContractInstance) {
            myContract2 = newContractInstance
        }
    )
    
    console.log(myContract2._address);
    // вывод методов
    console.log("methods: ", myContract.methods);

    //  Кодирует данный вызова функции
    let calldata = web3.eth.abi.encodeFunctionCall({
        name: 'target',
        type: 'function',
        inputs: [{
            type: 'uint256',
            name: 'x'
        },{
            type: 'address',
            name: 'adr'
        },{
            type: 'string',
            name: 'str'
        }]
    }, [100, account.address, 'Hello!'])

    // Отрпавка вызова call на контракте
    let tx = await web3.eth.accounts.signTransaction({
        from: account.address,
        to: myContract2._address,
        gas: 30_000,
        data: calldata,
    }, key)

    // выводим данные
    await web3.eth.sendSignedTransaction(tx.rawTransaction)
    .on("receipt", console.log)

}

main()

.then(() => process.exit(0))

.catch((error) => {
    console.error(error);
    process.exit(1);
})

