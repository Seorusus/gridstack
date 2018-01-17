<?php
namespace Drupal\mbc_app\Controller;
use Drupal\Core\Controller\ControllerBase;
class MbcAppController extends ControllerBase {
  public function content() {
    global $base_url;
    $title = '';
    $build['mbc_app'] = array(
      '#theme' => 'mbc_app_page',
      '#title' => $title,
    );

    $build['mbc_app']['#attached']['library'][] = 'mbc_app/jquery';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/jquery.ui';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbcCountdown';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/videosharing';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/uiBootstrap';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/angularjs';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/angular_sanitize';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/jquery-scrollbar';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/angular_dnd_lists';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/lodash';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/gridstack';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/touchPunch';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/jquery-minicolors';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_app';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_controllers';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_directives';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/mbc_services';
    $build['mbc_app']['#attached']['library'][] = 'mbc_app/bootstrap';
    $build['mbc_app']['#attached']['drupalSettings']['csrf'] = \Drupal::csrfToken()->get('rest');
    $build['mbc_app']['#attached']['drupalSettings']['baseUrl'] = $base_url;
    return $build;
  }
}