// $('.ui.modal').modal('show');
$('.menu .item').tab();
$('.dropdown').dropdown({
    onChange: function (value, text, $choice) {
        console.log(value, text, $choice);
    }
});