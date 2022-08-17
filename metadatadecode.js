//var nodelist = NODES;
var nodelist = TEST_NODES;

symbol_sdk_1 = require("/node_modules/symbol-sdk");

alert('AAA');

if(!window.SSS){
    console.log('SSS Extension not installed');
    alert('SSS Extension not installed');
}else{
    //アドレスからアカウント（AccountInfo）復元
    address = symbol_sdk_1.Address.createFromRawAddress(window.SSS.activeAddress);
    var getAccountInfo = async function()
    {
        return new Promise((resolve, reject) => 
        {
            accountHttp.getAccountInfo(address).subscribe(function(accountInfo)
            {
                resolve(accountInfo);
            }, err => console.error(err));
        });
    }
    var accountInfo = await getAccountInfo();

    //select要素を取得する
    selectMosaicId = document.getElementById('mosaicid');
    for(i = 0 ; i < accountInfo.mosaics.length ; i++){

        text = accountInfo.mosaics[i].id.toHex();

        //option要素を新しく作る
        option1 = document.createElement('option');
        //option要素にvalueと表示名を設定
        option1.value = text;
        option1.textContent = text;

        //select要素にoption要素を追加する
        selectMosaicId.appendChild(option1);
    }
}

async function decodeMetadataFromMosaicId(){
    
    // replace with mosaic id
    const mosaicIdHex = document.getElementById("mosaicid").value;
    const mosaicId = new symbol_sdk_1.MosaicId(mosaicIdHex);

    // replace with node endpoint
    //const nodeUrl = 'https://sym-test.opening-line.jp:3001';
    //const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl, symbol_sdk_1.NetworkType.TEST_NET);

    /*const d = $.Deferred();
    const node = await connectNode(nodelist, d);
    const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(node);*/
    
    const d2 = $.Deferred();
    const repositoryFactory = await createRepo(d2,nodelist);

    const metadataHttp = repositoryFactory.createMetadataRepository();
    const searchCriteria = {
        targetId: mosaicId,
        metadataType: symbol_sdk_1.MetadataType.Mosaic,
    };
    metadataHttp.search(searchCriteria).subscribe(
        (metadataEntries) => {
            if (metadataEntries.pageSize > 0) {
                console.log('Page', metadataEntries.pageNumber);
                metadataEntries.data.map((entry) => {
                    const metadataEntry = entry.metadataEntry;
                    document.getElementById("decodedmetadata").value=symbol_sdk_1.Convert.decodeHex(metadataEntry.value);

                    console.log('\n Decoded Value:\t', symbol_sdk_1.Convert.decodeHex(metadataEntry.value));
                    console.log('\n \n Key:\t', metadataEntry.scopedMetadataKey);
                    console.log('\n ---');
                    console.log('\n Value:\t', metadataEntry.value);
                    console.log('\n Sender Address:\t',metadataEntry.sourceAddress.pretty(),);
                    console.log('\n Target address:\t',metadataEntry.targetAddress.pretty(),);
                    console.log('\n Scoped metadata key:\t',metadataEntry.scopedMetadataKey.toHex(),);
                    console.log('\n TargetId:\t', metadataEntry.targetId);
                });
            } else {
                document.getElementById("errormessage").innerText='The mosaic does not have metadata .entries assigned';

                console.log('\n The mosaic does not have metadata entries assigned.');
            }
        },
        (err) => console.log(err),
        )
    }
