// $('.ui.modal').modal('show');
$('.menu .item').tab();
$('.dropdown').dropdown({
    onChange: function (value, text, $choice) {
        console.log(value, text, $choice);
    }
});

$('.file-label').mouseover(function () {
    var $tip = $(this).find('.file-label-tip');
    $tip.css('display', 'inline');
}).mouseout(function (event) {
    var $tip = $(this).find('.file-label-tip');  
    $tip.css('display', 'none');
})