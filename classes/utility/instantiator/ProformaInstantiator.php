<?php


namespace qtype_programmingtask\utility\instantiator;

defined('MOODLE_INTERNAL') || die();


class ProformaInstantiator {
    private $instantiator_url;
    public function __construct() {
        $this->instantiator_url = 'http://localhost:8080/ProformaVariability/rest/instantiate';
    }

    public function instantiate_random(\stored_file $templatefile) {
        $curl = new \curl(array('debug' => true));
        //$curl->setHeader(['Accept: application/octet-stream,text/plain', 'Content-Type: multipart/form-data', 'Connection: keep-alive']);
        $instance = $curl->post($this->instantiator_url . '-random', array('task' => $templatefile));
        print_object($curl->get_raw_response());

        $info = $curl->get_info();
        $errno = $curl->get_errno();
        if ($errno != 0) {
            // Errno indicates errors on transport level therefore this is almost certainly an error we do not want
            // http errors need to be handled by each calling function individually.
            throw new \invalid_response_exception("Error accessing POST $this->instantiator_url; CURL error code: $errno; Error: {$curl->error}");
        }
        if ($info['http_code'] != 200 /* = OK */) {
            throw new \invalid_response_exception("Received HTTP status code $httpstatuscode when accessing URL POST $this->instantiator_url");
        }
        return $instance;
    }

    private function instantiate(array $params) {
        $curl = new \curl(array('debug' => true));
        //$curl->setHeader(['Accept: application/octet-stream,text/plain', 'Content-Type: multipart/form-data', 'Connection: keep-alive']);
        $instance = $curl->post($this->instantiator_url, $params);
        print_object($curl->get_raw_response());

        $info = $curl->get_info();
        $errno = $curl->get_errno();
        if ($errno != 0) {
            // Errno indicates errors on transport level therefore this is almost certainly an error we do not want
            // http errors need to be handled by each calling function individually.
            throw new \invalid_response_exception("Error accessing POST $this->instantiator_url; CURL error code: $errno; Error: {$curl->error}");
        }

        return array($instance, $info['http_code']);
    }
}