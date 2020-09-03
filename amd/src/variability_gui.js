define(['jquery', 'core/ajax', 'qtype_programmingtask/dtjava'], function ($, ajax, dtjava) {
    return {
        deployGraja: function() {
            $("#testthetaskfilebutton").click(function () {
                const fileManager = $("#id_proformataskfileupload").parent();
                const itemId = fileManager.find("[name='proformataskfileupload']")[0].value;
                ajax.call([
                    {
                        methodname: 'qtype_programmingtask_get_task_template',
                        args: {itemid: itemId},
                        done: function (result) {
                            console.log("result: " + JSON.stringify(result));
                            const app = new dtjava.App(
                                'http://localhost/graja/Graja.jnlp',
                                {
                                    params: [
                                        '--input ' + result,
                                        '--url=' + "http://localhost:8080/GrajaVariability/rest/instantiate"
                                    ]
                                }
                            );
                            dtjava.launch(app, null, null);
                        },
                        fail: function(errorObject) {
                            console.log(errorObject);
                            $("#id_error_ajaxerrorlabel").parent().children().first().
                            html('<div>' + errorObject.debuginfo + '</div><div> For more information see browser '
                                + 'console.</div>');
                        }
                    }
                ]);
            });
        }
    };
});
