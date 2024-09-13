<?php

namespace Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\MigrateProcessInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;

/**
 * Downloads and saves an image file.
 *
 * @MigrateProcessPlugin(
 *   id = "file_import"
 * )
 */
class FileImport extends ProcessPluginBase implements MigrateProcessInterface {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    $url = 'https://image.tmdb.org/t/p/w500' . $value;
    $file_data = file_get_contents($url);
    $file = file_save_data($file_data, 'public://movies/' . basename($url), FILE_EXISTS_REPLACE);
    return $file ? $file->id() : NULL;
  }
}
