<?php

namespace Drupal\tmdb_movies\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\MigrateProcessInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;

/**
 * Convert a date string to the format required by a date field.
 *
 * @MigrateProcessPlugin(
 *   id = "release_date_format"
 * )
 */
class ReleaseDateFormat extends ProcessPluginBase implements MigrateProcessInterface {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    // Ensure the value is in Y-m-d format (e.g., "2024-08-27").
    $date = \DateTime::createFromFormat('Y-m-d', $value);

    // If the date is valid, return it in the desired format for Drupal.
    if ($date) {
      return $date->format('Y-m-d');
    }

    // Return NULL if the date is not valid.
    return NULL;
  }

}
