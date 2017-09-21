<?php
namespace Drupal\mbc_app\Controller;
use Drupal\Core\Controller\ControllerBase;
class MbcAppController extends ControllerBase {
  public function viewMbcApp() {
    $title = '';
    $build['mbc_app'] = array(
      '#theme' => 'mbc_app_view',
      '#title' => $title,
    );
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/angularjs';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/angular_sanitize';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_app';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_controllers';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_services';
    return $build;
  }
}