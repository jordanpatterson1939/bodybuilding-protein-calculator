$(document).ready(function(){
    let reqEndpoint = '/daily-protein-requirement';
    let foodListEndpoint = "/food list";
    let response2Template = `You have consumed <h1>20g</h1> so far for today.`;

    $.get(foodListEndpoint,function(data,status){
        alert("Data: "+data+"\nStatus: "+status);
    });

    $('#response2').html(response2Template);
    $('#req-form').submit(function(e){
        e.preventDefault();
    });
    $('#req-form').submit(function(){
        let weight = $('#weight').val();
        let unit = $('#unit').val();
        $.post(reqEndpoint,{
            weight:weight,
            unit: unit
        },
        function(data,status){
            // alert("Data: "+ data +"\nStatus: "+status);
            if (status=="success"){
                let response1Template = `Your daily protein requirement for building muscle is <h1>${data} grams</h1> suplemented with regular exercise.`;
                $('#response1').html(response1Template);
            }
        });
        $('#response1').html(response1Template);
    });
});