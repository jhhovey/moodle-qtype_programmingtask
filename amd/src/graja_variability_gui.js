define(['jquery', 'core/ajax', 'qtype_programmingtask/dtjava'], function ($, ajax, dtjava) {
    return {
        deployGraja: function() {
            $("#testthetaskfilebutton").click(function () {
                const fileManager = $("#id_proformataskfileupload").parent();
                const itemId = fileManager.find("[name='proformataskfileupload']")[0].value;
                const id = $("[name='id']", ".mform").val();
                //console.log(id);
                return ajax.call([
                    {
                        methodname: 'qtype_programmingtask_get_task_template',
                        args: {itemid: itemId, qid: id},
                        fail: function(errorObject) {
                            console.log(errorObject);
                            $("#id_error_ajaxerrorlabel").parent().children().first().
                            html('<div>' + errorObject.debuginfo + '</div><div> For more information see browser '
                                + 'console.</div>');
                        }
                    }
                ])[0].done(result => {
                    console.log("result: " + JSON.stringify(result));
                    window.alert("result: " + JSON.stringify(result));
                    return result;
                });
            });
        }
    };
});
