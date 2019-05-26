<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

defined('MOODLE_INTERNAL') || die();

// Name of file areas
define('proforma_TASKZIP_FILEAREA', 'taskfile');
define('proforma_ATTACHED_TASK_FILES_FILEAREA', 'attachedtaskfiles');
define('proforma_EMBEDDED_TASK_FILES_FILEAREA', 'embeddedtaskfiles');

//ProFormA task xml namespaces
define('proforma_TASK_XML_NAMESPACE', 'urn:proforma:v2.0');

/** Unzips the task zip file in the given draft area into the area
 *
 * @param type $draftareaid
 * @param type $user_context
 * @return string the name of the task file
 * @throws invalid_parameter_exception
 */
function unzip_task_file_in_draft_area($draftareaid, $user_context) {
    global $USER;

    $fs = get_file_storage();

    //Check if there is only the file we want
    $area = file_get_draft_area_info($draftareaid, "/");
    if ($area['filecount'] == 0) {
        return false;
    } elseif ($area['filecount'] > 1 || $area['foldercount'] != 0) {
        throw new invalid_parameter_exception('Only one file is allowed to be in this draft area: A ProFormA-Task as either ZIP or XML file.');
    }

    //Get name of the file
    $files = $fs->get_area_files($user_context->id, 'user', 'draft', $draftareaid);
    //get_area_files returns an associative array where the keys are some kind of hash value
    $keys = array_keys($files);
    //index 1 because index 0 is the current directory it seems
    $filename = $files[$keys[1]]->get_filename();

    $file = $fs->get_file($user_context->id, 'user', 'draft', $draftareaid, "/", $filename);

    //Check file type (it's really only checking the file extension but that is good enough here)
    $fileinfo = pathinfo($filename);
    $filetype = '';
    if (array_key_exists('extension', $fileinfo)) {
        $filetype = strtolower($fileinfo['extension']);
    }
    if ($filetype != 'zip') {
        throw new invalid_parameter_exception('Supplied file must be a zip file.');
    }

    //Unzip file - basically copied from draftfiles_ajax.php
    $zipper = get_file_packer('application/zip');

    // Find unused name for directory to extract the archive.
    $temppath = $fs->get_unused_dirname($user_context->id, 'user', 'draft', $draftareaid, "/" . pathinfo($filename, PATHINFO_FILENAME) . '/');
    $donotremovedirs = array();
    $doremovedirs = array($temppath);
    // Extract archive and move all files from $temppath to $filepath
    if ($file->extract_to_storage($zipper, $user_context->id, 'user', 'draft', $draftareaid, $temppath, $USER->id)) {
        $extractedfiles = $fs->get_directory_files($user_context->id, 'user', 'draft', $draftareaid, $temppath, true);
        $xtemppath = preg_quote($temppath, '|');
        foreach ($extractedfiles as $exfile) {
            $realpath = preg_replace('|^' . $xtemppath . '|', '/', $exfile->get_filepath());
            if (!$exfile->is_directory()) {
                // Set the source to the extracted file to indicate that it came from archive.
                $exfile->set_source(serialize((object) array('source' => '/')));
            }
            if (!$fs->file_exists($user_context->id, 'user', 'draft', $draftareaid, $realpath, $exfile->get_filename())) {
                // File or directory did not exist, just move it.
                $exfile->rename($realpath, $exfile->get_filename());
            } else if (!$exfile->is_directory()) {
                // File already existed, overwrite it
                repository::overwrite_existing_draftfile($draftareaid, $realpath, $exfile->get_filename(), $exfile->get_filepath(), $exfile->get_filename());
            } else {
                // Directory already existed, remove temporary dir but make sure we don't remove the existing dir
                $doremovedirs[] = $exfile->get_filepath();
                $donotremovedirs[] = $realpath;
            }
        }
    }
    // Remove remaining temporary directories.
    foreach (array_diff($doremovedirs, $donotremovedirs) as $filepath) {
        $file = $fs->get_file($user_context->id, 'user', 'draft', $draftareaid, $filepath, '.');
        if ($file) {
            $file->delete();
        }
    }

    return $filename;
}

/* * Removes all files and directories from the given draft area except a file with the given file name
 *
 * @param type $draftareaid
 * @param type $user_context
 * @param type $excluded_file_name
 */

function remove_all_files_from_draft_area($draftareaid, $user_context, $excluded_file_name) {
    $fs = get_file_storage();
    $files = $fs->get_area_files($user_context->id, 'user', 'draft', $draftareaid);
    foreach ($files as $fi) {
        if (($fi->is_directory() && $fi->get_filepath() != '/') || ($fi->get_filename() != $excluded_file_name && $fi->get_filename() != '.')) {
            $fi->delete();
        }
    }
}

/* * Creates a DOMDocument object from the task.xml file in the given file area and returns it.
 *
 * @param type $user_context
 * @param type $draftareid
 * @param type $zipfilename
 * @return \DOMDocument
 * @throws invalid_parameter_exception
 */

function create_domdocument_from_task_xml($user_context, $draftareid, $zipfilename) {
    $fs = get_file_storage();
    $file = $fs->get_file($user_context->id, 'user', 'draft', $draftareid, "/", 'task.xml');
    if (!$file) {
        remove_all_files_from_draft_area($draftareid, $user_context, $zipfilename);
        throw new invalid_parameter_exception('Supplied zip file doesn\'t contain task.xml file.');
    }

    $doc = new DOMDocument();
    if (!$doc->loadXML($file->get_content())) {
        remove_all_files_from_draft_area($draftareid, $user_context, $zipfilename);
        throw new invalid_parameter_exception('Error parsing the supplied task.xml file. See server log for details.');
    }


    return $doc;
}

function save_task_and_according_files($question) {
    global $USER, $DB;

    if (!isset($question->proformataskfileupload)) {
        return;
    }
    $draftareaid = $question->proformataskfileupload;

    $user_context = context_user::instance($USER->id);

    $filename = unzip_task_file_in_draft_area($draftareaid, $user_context);
    if (!$filename) {
        //Seems like no task file was submitted
        return false;
    }

    //Copy all extracted files to the corresponding file area
    file_save_draft_area_files($draftareaid, $question->context->id, 'question', proforma_ATTACHED_TASK_FILES_FILEAREA, $question->id, array('subdirs' => true));

    $doc = create_domdocument_from_task_xml($user_context, $draftareaid, $filename);

    $files_for_db = array();
    $fs = get_file_storage();
    $embedded_elems = array("embedded-bin-file", "embedded-txt-file");
    $attached_elems = array("attached-bin-file", "attached-txt-file");
    foreach ($doc->getElementsByTagNameNS(proforma_TASK_XML_NAMESPACE, 'file') as $file) {
        foreach ($file->childNodes as $child) {
            $break = false;
            if (in_array($child->localName, $embedded_elems)) {
                $content = '';
                if ($child->localName == 'embedded-bin-file') {
                    $content = base64_decode($child->nodeValue);
                } else {
                    $content = $child->nodeValue;
                }

                //Compensate the fact that the filename might contain a relative path
                $pathinfo = pathinfo('/' . $file->attributes->getNamedItem('id')->nodeValue . '/' . $child->attributes->getNamedItem('filename')->nodeValue);

                $fileinfo = array(
                    'component' => 'question',
                    'filearea' => proforma_EMBEDDED_TASK_FILES_FILEAREA,
                    'itemid' => $question->id,
                    'contextid' => $question->context->id,
                    'filepath' => $pathinfo['dirname'] . '/',
                    'filename' => $pathinfo['basename']);
                $fs->create_file_from_string($fileinfo, $content);

                $record = new stdClass();
                $record->questionid = $question->id;
                $record->fileid = $file->attributes->getNamedItem('id')->nodeValue;
                $record->usedbygrader = $file->attributes->getNamedItem('used-by-grader')->nodeValue == 'true' ? 1 : 0;
                $record->visibletostudents = $file->attributes->getNamedItem('visible')->nodeValue == 'true' ? 1 : 0;
                $record->usagebylms = $file->attributes->getNamedItem('usage-by-lms') != NULL ? $file->attributes->getNamedItem('usage-by-lms')->nodeValue : 'download';
                $record->filepath = '/' . $file->attributes->getNamedItem('id')->nodeValue . '/';
                $record->filename = $child->attributes->getNamedItem('filename')->nodeValue;
                $record->filearea = proforma_EMBEDDED_TASK_FILES_FILEAREA;
                $files_for_db[] = $record;

                $break = true;
            } elseif (in_array($child->localName, $attached_elems)) {

                //The file itself has already been copied - now only add the database entry

                $pathinfo = pathinfo('/' . $child->nodeValue);
                $record = new stdClass();
                $record->questionid = $question->id;
                $record->fileid = $file->attributes->getNamedItem('id')->nodeValue;
                $record->usedbygrader = $file->attributes->getNamedItem('used-by-grader')->nodeValue == 'true' ? 1 : 0;
                $record->visibletostudents = $file->attributes->getNamedItem('visible')->nodeValue == 'true' ? 1 : 0;
                $record->usagebylms = $file->attributes->getNamedItem('usage-by-lms') != NULL ? $file->attributes->getNamedItem('usage-by-lms')->nodeValue : 'download';
                $record->filepath = $pathinfo['dirname'] . '/';
                $record->filename = $pathinfo['basename'];
                $record->filearea = proforma_ATTACHED_TASK_FILES_FILEAREA;
                $files_for_db[] = $record;

                $break = true;
            }
            if ($break) {
                break;
            }
        }
    }

    //Now move the task zip file to the designated area
    $file = $fs->get_file($question->context->id, 'question', proforma_ATTACHED_TASK_FILES_FILEAREA, $question->id, '/', $filename);
    $new_file_record = array(
        'component' => 'question',
        'filearea' => proforma_TASKZIP_FILEAREA,
        'itemid' => $question->id,
        'contextid' => $question->context->id,
        'filepath' => '/',
        'filename' => $filename);
    $fs->create_file_from_storedfile($new_file_record, $file);
    $file->delete();

    $record = new stdClass();
    $record->questionid = $question->id;
    $record->fileid = 'task';
    $record->usedbygrader = 0;
    $record->visibletostudents = 0;
    $record->usagebylms = 'download';
    $record->filepath = '/';
    $record->filename = $filename;
    $record->filearea = proforma_TASKZIP_FILEAREA;
    $files_for_db[] = $record;

    //Save all records in database
    $DB->insert_records('qtype_programmingtask_files', $files_for_db);

    //Do a little bit of cleanup and remove everything from the file area we extracted
    remove_all_files_from_draft_area($draftareaid, $user_context, $filename);
}