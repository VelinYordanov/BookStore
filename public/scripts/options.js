(function () {
    if (toastr) {
        toastr.options.preventDuplicates = true;
        toastr.options.showEasing = 'swing';
        toastr.options.hideEasing = 'linear';
        toastr.options.closeEasing = 'linear';
        toastr.options.closeMethod = 'fadeOut';
        toastr.options.closeDuration = 300;
    }
}())