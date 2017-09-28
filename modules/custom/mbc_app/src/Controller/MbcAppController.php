<?php
namespace Drupal\mbc_app\Controller;
use Drupal\Core\Controller\ControllerBase;
class MbcAppController extends ControllerBase {
  public function viewMbcApp() {
    global $base_url;
    $title = '';
    $build['mbc_app'] = array(
      '#theme' => 'mbc_app_view',
      '#title' => $title,
    );
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/angularjs';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/angular_sanitize';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/angular_dnd_lists';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_app';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_controllers';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_services';
    $build['mbc_app']['#attached']['drupalSettings']['csrf'] = \Drupal::csrfToken()->get('rest');
    $build['mbc_app']['#attached']['drupalSettings']['baseUrl'] = $base_url;
    return $build;
  }
}