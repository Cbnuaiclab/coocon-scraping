
function setTimeoutWrapper(aCodeBlock, aInterval)
{
    try{
        console.log("********** setTimeoutWrapper:[" + aInterval + "]:[" + aCodeBlock + "]");
        aCodeBlock();
    }catch(e){
        var msg="exception while setTimeoutWrapper:\\n\\t" + e.message + "\\n" + 
        e.stack; 
        console.log(msg); 
    }
}

function clearTimeoutWrapper()
{
    try{
        console.log("********** clearTimeoutWrapper");
    }catch(e){
        var msg="exception while clearTimeoutWrapper:\\n\\t" + e.message + "\\n" + 
        e.stack; 
        console.log(msg); 

    }
}

function querySelectorWrapper(aSelector)
{
    console.log("********** querySelectorWrapper CALL:[" + aSelector + "]");
    return true;
}


function loadeventTriger(){
    var event = document.createEvent('Event');
    event.initEvent('load', true, true);
    window.dispatchEvent(event);
}
