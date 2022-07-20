var listener;

sym = require("/node_modules/symbol-sdk");

function connectNode(nodes,d){

    const node = nodes[Math.floor(Math.random() * nodes.length)] ;
    $.ajax({url:  node + "/node/health" ,type: 'GET',timeout: 1000})
    .then(res => {
        console.log(res);
        if(res.status.apiNode == "up" && res.status.db == "up"){
            console.log(node);
            return d.resolve(node);
        }
        return connectNode(nodes,d);
    })
    .catch(res =>connectNode(nodes,d));
    return d.promise();
}

async function createRepo(d2,nodes){

    const d = $.Deferred();
    const node = await connectNode(nodes,d);
    const repo = new sym.RepositoryFactoryHttp(node);
    const nsRepo = repo.createNamespaceRepository();

    try{
        if(listener === undefined){
            const wsEndpoint = node.replace('http', 'ws') + "/ws";
            listenerKeepOpening(wsEndpoint,nsRepo);
        }
        d2.resolve(repo);

    }catch(error){
        console.log(error);
        createRepo(d2,nodes);
    }
    return d2.promise();
}

isWebsocketSupported = false;
function listenerKeepOpening(wsEndpoint,nsRepo){

    listener = new sym.Listener(wsEndpoint,nsRepo,WebSocket);
//  await listener.open();
    listener.open().then(() => {
    isWebsocketSupported = true;
    console.log(wsEndpoint);
        listener.newBlock();
    });

    listener.webSocket.onclose = async function(){
        console.log("listener onclose");
    if(!isWebsocketSupported){
      console.log("websocket no supported.")
    }else{
        listenerKeepOpening(wsEndpoint,nsRepo);
    }
  }
}