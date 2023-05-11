
$(document).ready(function(){
    $('#showactiveusers').click(function(){
        $.getJSON('/admin/getusers',function(data){
            let htm=""
            data.map((item)=>{
                htm+="<tr><td>"+item.userid+"</td><td>"+item.username+"</td><td>"+item.useraddress+"</td></tr>"
            })
            $('#result').html(htm)
        })
    })
})