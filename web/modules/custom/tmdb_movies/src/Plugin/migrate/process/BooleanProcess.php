<?php

namespace Drupal\ardo_product\Plugin\migrate\process;

use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\MigrateProcessInterface;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Custom plugin to convert boolean field.
 *
 * @MigrateProcessPlugin(
 *   id = "boolean"
 * )
 */
class BooleanProcess extends ProcessPluginBase implements MigrateProcessInterface {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    switch ($value) {
      case 'Yes':
       $value = 1;
       break;
      case 'No':
        $value = 0;
        break;
      default:
        $value = 0;
    }

    return $value;
  }

}
