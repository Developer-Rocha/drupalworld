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
    $url = 'https://image.tmdb.org/t/p/w500' . $value;
    $destination = 'public://movies/' . basename($url);

    try {
      // Making the HTTP request to obtain the contents of the file.
      $client = \Drupal::httpClient();
      $response = $client->get($url);
      $file_data = $response->getBody()->getContents();

      // Get the public file directory.
      $file_system = \Drupal::service('file_system');
      $destination = 'public://movies/' . basename($url);

      // Check if directory exists, if not, create it.
      if (!$file_system->prepareDirectory('public://movies', FileSystemInterface::CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS)) {
        throw new \Exception('Unable to prepare directory public://movies.');
      }

      // Save the file.
      $file = file_save_data($file_data, $destination, FileSystemInterface::EXISTS_REPLACE);

      // Returning the ID of the saved file.
      return $file instanceof File ? $file->id() : NULL;
    }
    catch (RequestException $e) {
      \Drupal::logger('tmdb_movies')->error('Error downloading file from @url: @message', [
        '@url' => $url,
        '@message' => $e->getMessage(),
      ]);
      return NULL;
    }
  }
}
