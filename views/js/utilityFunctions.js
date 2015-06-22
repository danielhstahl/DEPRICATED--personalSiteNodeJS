function getValues(){ 
    $('input').each(function(){
        var current=$(this);               
        var id=current.attr('id');
        attributes[id]=current.val();
        if(!isNumeric(attributes[id])){ 
            attributes[id]=Number(current.attr('placeholder'));
        }
        else {
            attributes[id]=Number(attributes[id]);
        }           
    });
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
} 