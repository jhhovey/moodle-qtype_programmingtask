<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * The programmingtask question renderer class is defined here.
 *
 * @package     qtype_programmingtask
 * @copyright   2019 ZLB-ELC Hochschule Hannover <elc@hs-hannover.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/../../locallib.php');

use qtype_programmingtask\utility\proforma_xml\separate_feedback_handler;
use qtype_programmingtask\output\separate_feedback_text_renderer;

/**
 * Generates the output for programmingtask questions.
 *
 * You should override functions as necessary from the parent class located at
 * /question/type/rendererbase.php.
 */
class qtype_programmingtask_renderer extends qtype_renderer {

    /**
     * Generates the display of the formulation part of the question. This is the
     * area that contains the quetsion text, and the controls for students to
     * input their answers. Some question types also embed bits of feedback, for
     * example ticks and crosses, in this area.
     *
     * @param question_attempt $qa the question attempt to display.
     * @param question_display_options $options controls what should and should not be displayed.
     * @return string HTML fragment.
     */
    public function formulation_and_controls(question_attempt $qa, question_display_options $options) {
        global $DB, $PAGE;

        $o = parent::formulation_and_controls($qa, $options);

        $question = $qa->get_question();
        $qubaid = $qa->get_usage_id();
        $slot = $qa->get_slot();
        $questionid = $question->id;

        // Load ace scripts.
        $plugindirrel = '/question/type/programmingtask';
        $PAGE->requires->js($plugindirrel . '/ace/ace.js');
        $PAGE->requires->js($plugindirrel . '/ace/ext-language_tools.js');
        $PAGE->requires->js($plugindirrel . '/ace/ext-modelist.js');

        // If teacher, display test option for download.
        if (has_capability('mod/quiz:grade', $PAGE->context)) {
            $fs = get_file_storage();
            $draftitemid = file_get_unused_draft_itemid();
            file_prepare_draft_area($draftitemid, $question->contextid, 'question', 'jnlp', 1);
            $jnlp_file_info = array(
                'contextid' => $question->contextid,
                'component' => 'question',
                'filearea' => 'jnlp',
                'itemid' => $draftitemid,
                'filepath' => '/',
                'filename' => 'Gui.jnlp');
            if ($fs->file_exists($jnlp_file_info['contextid'],
                $jnlp_file_info['component'],
                $jnlp_file_info['filearea'],
                $jnlp_file_info['itemid'],
                $jnlp_file_info['filepath'],
                $jnlp_file_info['filename'])) {
                $fs->get_file(
                    $jnlp_file_info['contextid'],
                    $jnlp_file_info['component'],
                    $jnlp_file_info['filearea'],
                    $jnlp_file_info['itemid'],
                    $jnlp_file_info['filepath'],
                    $jnlp_file_info['filename'])->delete();
            }
            $jnlp_file = $fs->create_file_from_string($jnlp_file_info, get_jnlp_file());
            $filesystem = $fs->get_file_system();
            $location = $filesystem->get_local_path_from_storedfile($jnlp_file, true);
            $filerecord = $DB->get_record('files', ['id' => $jnlp_file->get_id()]);
            $url = moodle_url::make_pluginfile_url($filerecord->contextid, $filerecord->component,
                $filerecord->filearea, $filerecord->itemid, $filerecord->filepath,
                $filerecord->filename, true);
            /*$url = moodle_url::make_pluginfile_url($jnlp_file->get_contextid(), $jnlp_file->get_component(),
                $jnlp_file->get_filearea(), $jnlp_file->get_itemid(), $jnlp_file->get_filepath(),
                $jnlp_file->get_filename(), true);*/
            $o .= "<a href='$url' style='display:block;text-align:right;'>" .
                " <span style='font-family: FontAwesome; display:inline-block;" .
                "margin-right: 5px'>&#xf019;</span> Download complete '{$jnlp_file->get_filename()}' file</a>";

            $file = $DB->get_record(
                'qtype_programmingtask_files',
                array(
                    'questionid' => $questionid,
                    'filearea' => PROFORMA_TASKZIP_FILEAREA));
            $taskfileinfo = array(
                'contextid' => $question->contextid,
                'component' => 'question',
                'filearea' => PROFORMA_TASKZIP_FILEAREA,
                'itemid' => "{$qubaid}/$slot/{$questionid}",
                'filepath' => $file->filepath,
                'filename' => $file->filename);
            $url = moodle_url::make_pluginfile_url($taskfileinfo['contextid'], $taskfileinfo['component'],
                $taskfileinfo['filearea'], $taskfileinfo['itemid'], $taskfileinfo['filepath'],
                $taskfileinfo['filename'], true);
            $o .= "<a href='$url' style='display:block;text-align:right;'>" .
                " <span style='font-family: FontAwesome; display:inline-block;" .
                "margin-right: 5px'>&#xf019;</span> Download complete '{$file->filename}' file</a>";
        }

        if (empty($options->readonly)) {
            $submissionarea = $this->render_submission_area($qa, $options);
        } else {
            $submissionarea = $this->render_files_read_only($qa, $options);
        }
        $o .= $this->output->heading(get_string('submission', 'qtype_programmingtask'), 3);
        $o .= html_writer::tag('div', $submissionarea, array('class' => 'submissionfilearea'));

        $PAGE->requires->js_call_amd('qtype_programmingtask/textareas', 'setupAllTAs');

        if (has_capability('mod/quiz:grade', $options->context) && $question->internaldescription != '') {
            $internaldescription = $this->render_internal_description($question);
            $o .= html_writer::tag('div', $internaldescription, array('class' => 'internaldescription'));
        }

        $downloadlinks = $this->render_download_links($qa, $options);
        $o .= html_writer::tag('div', $downloadlinks, array('class' => 'downloadlinks'));

        return $o;
    }

    private function render_internal_description($question) {
        $o = '';
        $o .= $this->output->heading(get_string('internaldescription', 'qtype_programmingtask'), 3);
        $o .= $question->internaldescription;
        return $o;
    }

    private function render_download_links(question_attempt $qa, question_display_options $options) {
        global $DB;

        $question = $qa->get_question();
        $qubaid = $qa->get_usage_id();
        $slot = $qa->get_slot();
        $questionid = $question->id;
        $o = '';

        $files = $DB->get_records('qtype_programmingtask_files', array('questionid' => $questionid));
        $anythingtodisplay = false;
        if (count($files) != 0) {
            $downloadurls = '';
            $downloadurls .= $this->output->heading(get_string('providedfiles', 'qtype_programmingtask'), 3);
            $downloadurls .= html_writer::start_div('providedfiles');
            $downloadurls .= '<ul>';
            foreach ($files as $file) {
                if ($file->visibletostudents == 0 && !has_capability('mod/quiz:grade', $options->context)) {
                    continue;
                }
                $anythingtodisplay = true;
                $url = moodle_url::make_pluginfile_url($question->contextid, 'question', $file->filearea,
                                "$qubaid/$slot/$questionid", $file->filepath, $file->filename, in_array($file->usagebylms,
                                        array('download', 'edit')));
                $linkdisplay = ($file->filearea == PROFORMA_ATTACHED_TASK_FILES_FILEAREA ? $file->filepath : '') . $file->filename;
                $downloadurls .= '<li><a href="' . $url . '">' . $linkdisplay . '</a></li>';
            }
            $downloadurls .= '</ul>';
            $downloadurls .= html_writer::end_div('providedfiles');

            if ($anythingtodisplay) {
                $o .= $downloadurls;
            }
        }
        return $o;
    }

    private function render_files_read_only(question_attempt $qa, question_display_options $options) {
        global $DB, $PAGE;

        $rendered = '';

        if ($qa->get_question()->enablefilesubmissions) {

            $files = $qa->get_last_qt_files('answer', $options->context->id);
            if (!empty($files)) {
                $output = array();

                foreach ($files as $file) {
                    $output[] = html_writer::tag('p', html_writer::link($qa->get_response_file_url($file),
                                            $this->output->pix_icon(file_file_icon($file), get_mimetype_description($file),
                                                    'moodle', array('class' => 'icon')) . ' ' . s($file->get_filename())));
                }
                $rendered .= $this->output->heading(get_string('files', 'qtype_programmingtask'), 4);
                $rendered .= html_writer::div(implode($output), 'readonlysubmittedfiles');
            }
        }

        if ($qa->get_question()->enablefreetextsubmissions) {
            $renderedfreetext = '';

            $questionoptions = $DB->get_record('qtype_programmingtask_optns', ['questionid' => $qa->get_question()->id]);
            $defaultproglang = $questionoptions->ftsstandardlang;

            for ($i = 0; $i < $qa->get_question()->ftsmaxnumfields; $i++) {
                $text = $qa->get_last_qt_var("answertext$i");
                if ($text) {
                    list($filename, ) = $this->get_filename($qa->get_question()->id, $i, $qa->get_last_qt_var("answerfilename$i"),
                            $qa->get_question()->ftsautogeneratefilenames);

                    $customoptions = $DB->get_record('qtype_programmingtask_fts', ['questionid' => $qa->get_question()->id,
                        'inputindex' => $i]);

                    $proglang = $defaultproglang;
                    if ($customoptions && $customoptions->ftslang != 'default') {
                        $proglang = $customoptions->ftslang;
                    }

                    $renderedfreetext .= html_writer::start_div('answertextreadonly');
                    $renderedfreetext .= html_writer::tag('div', mangle_pathname($filename) . ' (' .
                                    PROFORMA_ACE_PROGLANGS[$proglang] . ')' . ':');
                    $renderedfreetext .= html_writer::tag('div', html_writer::tag('textarea', $text, array('id' => "answertext$i",
                                        'style' => 'width: 100%;padding-left: 10px;height:400px;', 'class' => 'edit_code',
                                        'data-lang' => $proglang, 'readonly' => '')));
                    $renderedfreetext .= html_writer::end_div();

                    $PAGE->requires->js_call_amd('qtype_programmingtask/userinterfacewrapper', 'newUiWrapper',
                            ['ace', "answertext$i"]);
                }
            }

            if ($renderedfreetext != '') {
                $rendered .= $this->output->heading(get_string('freetextsubmissions', 'qtype_programmingtask'), 4);
                $rendered .= html_writer::div($renderedfreetext, 'readonlysubmittedfreetext');
            }
        }

        return $rendered;
    }

    private function render_submission_area(question_attempt $qa, question_display_options $options) {
        global $CFG, $DB, $PAGE;
        require_once($CFG->dirroot . '/lib/form/filemanager.php');
        require_once($CFG->dirroot . '/repository/lib.php');

        $questionoptions = $DB->get_record('qtype_programmingtask_optns', ['questionid' => $qa->get_question()->id]);

        $renderedarea = '';

        if ($questionoptions->enablefilesubmissions) {
            $pickeroptions = new stdClass();
            $pickeroptions->itemid = $qa->prepare_response_files_draft_itemid(
                    'answer', $options->context->id);
            $pickeroptions->context = $options->context;

            $fm = new form_filemanager($pickeroptions);
            $filesrenderer = $this->page->get_renderer('core', 'files');

            // This is moodles weird way to express which file manager is responsible for which response variable.
            $hidden = html_writer::empty_tag(
                            'input', array('type' => 'hidden', 'name' => $qa->get_qt_field_name('answer'),
                        'value' => $pickeroptions->itemid));

            $renderedarea .= $filesrenderer->render($fm) . $hidden;
        }
        if ($questionoptions->enablefreetextsubmissions) {

            if ($renderedarea != '') {
                $renderedarea .= html_writer::tag('hr', '');
            }

            $autogeneratefilenames = $questionoptions->ftsautogeneratefilenames;
            $maxindexoffieldwithcontent = 0;

            $defaultproglang = $questionoptions->ftsstandardlang;

            for ($i = 0; $i < $questionoptions->ftsmaxnumfields; $i++) {
                $answertextname = "answertext$i";
                $answertextinputname = $qa->get_qt_field_name($answertextname);
                $answertextid = $answertextinputname . '_id';

                $answertextresponse = $qa->get_last_step_with_qt_var($answertextname)->get_qt_var($answertextname) ?? '';

                $filenamename = "answerfilename$i";
                $filenameinputname = $qa->get_qt_field_name($filenamename);
                $filenameid = $filenameinputname . '_id';

                $customoptions = $DB->get_record('qtype_programmingtask_fts', ['questionid' => $qa->get_question()->id,
                    'inputindex' => $i]);

                $proglang = $defaultproglang;
                if ($customoptions && $customoptions->ftslang != 'default') {
                    $proglang = $customoptions->ftslang;
                }

                list($filenameresponse, $disablefilenameinput) = $this->get_filename($qa->get_question()->id, $i,
                        $qa->get_last_step_with_qt_var($filenamename)->get_qt_var($filenamename), $autogeneratefilenames);

                $output = '';
                $output .= html_writer::start_tag('div', array('class' => "qtype_programmingtask_answertext",
                            'id' => "qtype_programmingtask_answertext_$i",
                            'style' => 'display:none;'));
                $output .= html_writer::start_div('answertextfilename');
                $output .= html_writer::label(get_string('filename', 'qtype_programmingtask') . ":", $filenameid);
                $inputoptions = ['id' => $filenameid, 'name' => $filenameinputname, 'style' => 'width: 100%;padding-left: 10px;',
                    'value' => $filenameresponse];
                if ($disablefilenameinput) {
                    $inputoptions['disabled'] = true;
                }
                $output .= html_writer::tag('input', '', $inputoptions);
                $output .= html_writer::end_div();
                $output .= html_writer::div(get_string('yourcode', 'qtype_programmingtask') . ' (' .
                                get_string('programminglanguage', 'qtype_programmingtask') . ': ' .
                                PROFORMA_ACE_PROGLANGS[$proglang] . '):');
                $output .= html_writer::tag('div', html_writer::tag('textarea', $answertextresponse, array('id' => $answertextid,
                                    'name' => $answertextinputname, 'style' => 'width: 100%;padding-left: 10px;height:250px;',
                                    'class' => 'edit_code', 'data-lang' => $proglang)));
                $output .= html_writer::end_tag('div');

                $renderedarea .= $output;

                if ($answertextresponse != '') {
                    $maxindexoffieldwithcontent = $i + 1;
                }

                $PAGE->requires->js_call_amd('qtype_programmingtask/userinterfacewrapper', 'newUiWrapper', ['ace', $answertextid]);
            }
            $renderedarea .= html_writer::start_div('', ['style' => 'display:flex;justify-content:flex-end;']);
            $renderedarea .= html_writer::tag('button', get_string('addanswertext', 'qtype_programmingtask'),
                            ['id' => 'addAnswertextButton']);
            $renderedarea .= html_writer::tag('button', get_string('removelastanswertext', 'qtype_programmingtask'),
                            ['id' => 'removeLastAnswertextButton', 'style' => 'margin-left: 10px']);
            $renderedarea .= html_writer::end_div();

            $PAGE->requires->js_call_amd('qtype_programmingtask/manage_answer_texts', 'init',
                    [$questionoptions->ftsmaxnumfields, max($maxindexoffieldwithcontent, $questionoptions->ftsnuminitialfields)]);
        }

        if ($renderedarea == '') {
            $nosubmissionpossible = get_string('nosubmissionpossible', 'qtype_programmingtask');
            $renderedarea = "<div>$nosubmissionpossible</div>";
        }

        return $renderedarea;
    }

    private function get_filename($questionid, $index, $usersuppliedname, $autogeneratefilenames) {
        global $DB;

        $customoptions = $DB->get_record('qtype_programmingtask_fts', ['questionid' => $questionid, 'inputindex' => $index]);
        $filenameresponse = $usersuppliedname ?? '';         // Init with previous value.
        if ($filenameresponse == '') {
            $temp = $index + 1;
            $filenameresponse = "File$temp.txt";
        }
        $disablefilenameinput = false;
        if ($customoptions) {
            if ($customoptions->presetfilename) {
                $filenameresponse = $customoptions->filename;
                $disablefilenameinput = true;
            }
            // Else use already set previous value.
        } else {
            if ($autogeneratefilenames) {
                $temp = $index + 1;
                $filenameresponse = "File$temp.txt";
                $disablefilenameinput = true;
            }
            // Else use already set previous value.
        }
        return [$filenameresponse, $disablefilenameinput];
    }

    /**
     * Generate the specific feedback. This is feedback that varies according to
     * the response the student gave. This method is only called if the display options
     * allow this to be shown.
     *
     * @param question_attempt $qa the question attempt to display.
     * @return string HTML fragment.
     */
    protected function specific_feedback(question_attempt $qa) {
        global $PAGE, $DB;
        if ($qa->get_state()->is_finished()) {

            $PAGE->requires->js_call_amd('qtype_programmingtask/change_display_name_of_redo_button', 'init');

            if ($qa->get_state() == question_state::$finished) {
                $PAGE->requires->js_call_amd('qtype_programmingtask/pull_grading_status', 'init', [$qa->get_usage_id(),
                    get_config("qtype_programmingtask",
                            "grappa_client_polling_interval") * 1000 /* to milliseconds */]);
                $loader = '<div class="loader"></div>';
                return html_writer::div(get_string('currentlybeinggraded', 'qtype_programmingtask') . $loader, 'gradingstatus');
            } else if ($qa->get_state() == question_state::$needsgrading && !has_capability('mod/quiz:grade', $PAGE->context)) {
                // If a teacher is looking at this feedback and we did receive a valid response but it has an
                // internal-error-attribute we still want to display this result.
                return html_writer::div(get_string('needsgradingbyteacher', 'qtype_programmingtask'), 'gradingstatus');
            } else if ($qa->get_state()->is_graded() || (has_capability('mod/quiz:grade', $PAGE->context) &&
                    $qa->get_state() == question_state::$needsgrading)) {

                $qubarecord = $DB->get_record('question_usages', ['id' => $qa->get_usage_id()]);
                $initialslot = $DB->get_record('qtype_programmingtask_qaslts', ['questionattemptdbid' => $qa->get_database_id()],
                                'slot')->slot;

                $fs = get_file_storage();

                $html = '';

                $responsexmlfile = $fs->get_file($qubarecord->contextid, 'question', PROFORMA_RESPONSE_FILE_AREA .
                        "_{$qa->get_database_id()}", $qa->get_usage_id(),
                        "/", 'response.xml');
                if ($responsexmlfile) {
                    $doc = new DOMDocument();

                    set_error_handler(function($number, $error) {
                        if (preg_match('/^DOMDocument::loadXML\(\): (.+)$/', $error, $m) === 1) {
                            throw new Exception($m[1]);
                        }
                    });
                    try {
                        $doc->loadXML($responsexmlfile->get_content());
                    } catch (Exception $ex) {
                        $doc = false;
                    } finally {
                        restore_error_handler();
                    }

                    try {
                        if ($doc) {
                            $namespace = detect_proforma_namespace($doc);

                            $separatetestfeedbacklist = $doc->getElementsByTagNameNS($namespace, "separate-test-feedback");

                            if ($separatetestfeedbacklist->length == 1) {
                                // Separate test feedback.
                                $separatetestfeedbackelem = $separatetestfeedbacklist[0];

                                // Load task.xml to get grading hints and tests.
                                $fs = get_file_storage();
                                $taskxmlfile = $fs->get_file($qa->get_question()->contextid, 'question', PROFORMA_TASKXML_FILEAREA,
                                        $qa->get_question()->id, '/', 'task.xml');
                                $taskdoc = new DOMDocument();
                                $taskdoc->loadXML($taskxmlfile->get_content());
                                $taskxmlnamespace = detect_proforma_namespace($taskdoc);
                                $gradinghints = $taskdoc->getElementsByTagNameNS($taskxmlnamespace, 'grading-hints')[0];
                                $tests = $taskdoc->getElementsByTagNameNS($taskxmlnamespace, 'tests')[0];
                                $feedbackfiles = $doc->getElementsByTagNameNS($namespace, "files")[0];

                                $xpathtask = new DOMXPath($taskdoc);
                                $xpathtask->registerNamespace('p', $taskxmlnamespace);
                                $xpathresponse = new DOMXPath($doc);
                                $xpathresponse->registerNamespace('p', $namespace);

                                $separatefeedbackhelper = new separate_feedback_handler($gradinghints, $tests,
                                        $separatetestfeedbackelem, $feedbackfiles, $taskxmlnamespace, $namespace,
                                        $qa->get_max_mark(), $xpathtask, $xpathresponse);
                                $separatefeedbackhelper->process_result();

                                $fileinfos = [
                                    'component' => 'question',
                                    'itemid' => $qa->get_usage_id(),
                                    'fileareasuffix' => "_{$qa->get_database_id()}",
                                    'contextid' => $qubarecord->contextid,
                                    'filepath' => "/$initialslot/{$qa->get_usage_id()}/"
                                ];

                                if (!$separatefeedbackhelper->get_detailed_feedback()->has_internal_error() ||
                                        has_capability('mod/quiz:grade', $PAGE->context)) {
                                    $separatefeedbackrenderersummarised = new separate_feedback_text_renderer(
                                            $separatefeedbackhelper->get_summarised_feedback(),
                                            has_capability('mod/quiz:grade', $PAGE->context), $fileinfos,
                                            $qa->get_question()->showstudscorecalcscheme);
                                    $html .= '<p>' . $separatefeedbackrenderersummarised->render() . '</p>';

                                    $separatefeedbackrendererdetailed = new separate_feedback_text_renderer(
                                            $separatefeedbackhelper->get_detailed_feedback(), has_capability('mod/quiz:grade',
                                                    $PAGE->context), $fileinfos, $qa->get_question()->showstudscorecalcscheme);
                                    $html .= '<p>' . $separatefeedbackrendererdetailed->render() . '</p>';
                                } else {
                                    $html .= '<p>' . get_string('needsgradingbyteacher', 'qtype_programmingtask') . '</p>';
                                }
                            } else {
                                // Merged test feedback.
                                $html .= html_writer::div($doc->getElementsByTagNameNS(
                                                        $namespace, "student-feedback")[0]->nodeValue, 'studentfeedback');
                                if (has_capability('mod/quiz:grade', $PAGE->context)) {
                                    $html .= '<hr/>';
                                    $html .= html_writer::div($doc->getElementsByTagNameNS(
                                                            $namespace, "teacher-feedback")[0]->nodeValue, 'teacherfeedback');
                                }
                            }
                        } else {
                            $html = html_writer::div('The response contains an invalid response.xml file', 'gradingstatus');
                        }
                    } catch (\qtype_programmingtask\exceptions\grappa_exception $ex) {
                        // We did get a xml-valid response but something was still wrong. Display that message.
                        $html = html_writer::div($ex->getMessage(), 'gradingstatus');
                    } catch (\exception $ex) {
                        // Catch anything weird that might happend during processing of the response.
                        $html = html_writer::div($ex->getMessage(), 'gradingstatus') . html_writer::div($ex->getTraceAsString(),
                                        'gradingstatus');
                    } catch (\Error $er) {
                        // Catch anything weird that might happend during processing of the response.
                        $html = html_writer::div('Error code: ' . $er->getCode() . ". Message: " .
                                        $er->getMessage(), 'gradingstatus') .
                                html_writer::div('Stack trace:<br/>' . $er->getTraceAsString(), 'gradingstatus');
                    }
                } else {
                    $html = html_writer::div('Response didn\'t contain response.xml file', 'gradingstatus');
                }
                // If teacher, display response.zip for download.
                if (has_capability('mod/quiz:grade', $PAGE->context)) {
                    $slot = $qa->get_slot();
                    $responsefileinfos = array(
                        'component' => 'question',
                        'filearea' => PROFORMA_RESPONSE_FILE_AREA_RESPONSEFILE . "_{$qa->get_database_id()}",
                        'itemid' => "{$qa->get_usage_id()}/$slot/{$qa->get_usage_id()}",
                        'contextid' => $qubarecord->contextid,
                        'filepath' => "/",
                        'filename' => 'response.zip');
                    $url = moodle_url::make_pluginfile_url($responsefileinfos['contextid'], $responsefileinfos['component'],
                                    $responsefileinfos['filearea'], $responsefileinfos['itemid'], $responsefileinfos['filepath'],
                                    $responsefileinfos['filename'], true);
                    $html .= "<a href='$url' style='display:block;text-align:right;'>" .
                            " <span style='font-family: FontAwesome; display:inline-block;" .
                            "margin-right: 5px'>&#xf019;</span> Download complete 'response.zip' file</a>";
                }
                return $html;
            }
        }
        return '';
    }
}
