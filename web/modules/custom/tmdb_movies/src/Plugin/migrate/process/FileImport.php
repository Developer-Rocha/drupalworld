<?php

namespace Drupal\tmdb_movies\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\MigrateProcessInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use Drupal\file\Entity\File;
use GuzzleHttp\Exception\RequestException;
use Drupal\Core\File\FileSystemInterface;

/**
 * Downloads and saves an image file.
 *
 * @MigrateProcessPlugin(
 *   id = "file_import",
 *   handle_multiples = TRUE
 * )
 */
class FileImport extends ProcessPluginBase implements MigrateProcessInterface {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    return 'https://image.tmdb.org/t/p/w500' . $value;
  }
}
