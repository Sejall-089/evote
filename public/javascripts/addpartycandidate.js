
$(document).ready(function(){
    $('#showactivecandidates').click(function(){
        $.getJSON('/admin/getcandidates',function(data){
            let htm=""
            data.map((item)=>{
                htm+="<tr><td>"+item.partyid+"</td><td>"+item.partyname+"</td><td>"+item.candidatename+"</td></tr>"
            })
            $('#result').html(htm)
        })
    })
})