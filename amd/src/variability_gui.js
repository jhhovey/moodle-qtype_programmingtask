define(['jquery', 'qtype_programmingtask/dtjava'], function ($, dtjava) {
    return {
        deployGui: function() {
            $("#testthetaskfilebutton").click(function () {
                const baseUrl = $("[name='jnlpUrl']").val();
                /*const service = $("[name='serviceUrl']").val();
                const qid = $("[name='questionId']").val();
                const taskTemplate = $("[name='taskTemplate']").val();*/
                const url = baseUrl/* + "?service=" + service +
                    "&question_id=" + qid.toString() +
                    "&task_template=" + taskTemplate*/;
                console.log("url: " + url);
                window.alert("url: " + url);
                dtjava.launch({url: url});
            });
        }
    };
});
