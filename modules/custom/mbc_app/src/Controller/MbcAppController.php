<?php
namespace Drupal\mbc_app\Controller;
use Drupal\Core\Controller\ControllerBase;
class MbcAppController extends ControllerBase {
  public function viewMbcApp() {
    $title = '';
    $build['myelement'] = array(
      '#theme' => 'mbc_app_view',
      '#title' => $title,
    );
    $build['myelement']['#attached']['library'][] = 'mbc_app/angularjs';
    $build['myelement']['#attached']['library'][] = 'mbc_app/mbc_app';
    return $build;
  }
}