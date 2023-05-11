$(document).ready(function () {
    var votes = []
    $('#showvotingstatus').click(function () {
       
        $.getJSON('/admin/getvotingstatus', function (data) {
            let htm = ""
            var vote = []
            let label = []
            let backgroundcolor = []
            data.map((item) => {
                htm += "<tr><td>" + item.votedpartyname + "</td><td>" + item.votes + "</td></tr>"
                label.push(item.votedpartyname)
                vote.push(item.votes)
                backgroundcolor.push(`rgba(${Math.random()*500}, ${Math.random()*500}, 0, ${Math.random()*100})`)
            })
            $('#result').html(htm)
        
            var ctx = $("#chart-line");
            console.log(vote);
            
            var myLineChart = new Chart(ctx, {
    
                type: 'pie',
                data: {
                    labels: label,
                    datasets: [{
                        data: vote,
                        backgroundColor: backgroundcolor
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Weather'
                    }
                }
            });
        
        
        
        })

        

       
    })
    
    
    
})