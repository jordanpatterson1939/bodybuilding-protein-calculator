$(document).ready(function(){
    let reqEndpoint = '/daily-protein-requirement';
    let foodListEndpoint = "/food-list";
    let proteinTrackerUrl = "/protein-amount";
    let total = 0;
    
    function updateTotalMessage(){
        let response2Template = `You have consumed <h1>${total.toFixed(2)} g</h1> of protein so far for today.`;
        $('#response2').html(response2Template);
    }
    updateTotalMessage();
    $.getJSON(foodListEndpoint,function(data,status){
        let items = data.foods;
        let dropdown = $('#food-items');
        $.each(items,function(){
            dropdown.append($("<option />").val(this.name).text(this.name+" - "+this.serving_size));
        });
    });

    $('#reset-btn').click(function(){
        total = 0;
        updateTotalMessage();
    });

    $('#tracker-form').submit(function(e){
        e.preventDefault();
    });
    $('#tracker-form').submit(function(){
        let food = $('#food-items').val();
        let amount = $('#quantity').val();
        console.log("Food: "+food+"\nAmount: ",amount);
        $.post(proteinTrackerUrl,
            {
                food:food,
                amount:amount
            },
            function(data,status){
                // alert("Data: "+data+"\nStatus: "+status);
                total+=parseFloat(data);
                updateTotalMessage();
            });
    });


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