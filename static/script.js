$(document).ready(function(){
    let reqEndpoint = '/daily-protein-requirement';
    let foodListEndpoint = "/food-list";
    let total = 0;
    let response2Template = `You have consumed <h1>${total} g</h1> so far for today.`;
    

    $.getJSON(foodListEndpoint,function(data,status){
        let items = data.foods;
        let dropdown = $('#food-items');
        $.each(items,function(){
            dropdown.append($("<option />").val(this.name).text(this.name+" - "+this.quantity));
        });
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