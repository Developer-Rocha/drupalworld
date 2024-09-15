<?php

namespace Drupal\tmdb_movies\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\MigrateProcessInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use GuzzleHttp\Exception\RequestException;
use Drupal\Core\File\FileSystemInterface;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;

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

    // Define the destination directory.
    $directory = 'public://movies';

    // Check if the directory exists or create it.
    $file_system = \Drupal::service('file_system');
    $file_system->prepareDirectory($directory, FileSystemInterface::CREATE_DIRECTORY);

    try {
      // Download the image content.
      $http_client = \Drupal::httpClient();
      $response = $http_client->get($url);
      $image_data = $response->getBody()->getContents();

      // Define the full path of the file.
      $file_name = basename($url);
      $destination = $directory . '/' . $file_name;

      // Save the file.
      $file = \Drupal::service('file.repository')->writeData($image_data, $destination, FileSystemInterface::EXISTS_REPLACE);

      // If the file has been saved, create a Media Image entity.
      if ($file instanceof File) {
        $media = Media::create([
          'bundle' => 'image',
          'name' => $file_name,
          'field_media_image' => [
            'target_id' => $file->id(),
            'alt' => $row->getSourceProperty('title') ?? 'Poster',
          ],
          'uid' => 1,
          'status' => 1,
        ]);

        $media->save();

        return $media->id();
      }
    }
    catch (RequestException $e) {
      \Drupal::logger('tmdb_movies')->error('Error downloading image from URL @url: @message', [
        '@url' => $url,
        '@message' => $e->getMessage(),
      ]);
      return NULL;
    }

    return NULL;
  }
}
