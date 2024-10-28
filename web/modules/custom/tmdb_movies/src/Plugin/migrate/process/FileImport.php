<?php

namespace Drupal\tmdb_movies\Plugin\migrate\process;

use Drupal\Core\File\FileSystemInterface;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\MigrateProcessInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use GuzzleHttp\Exception\RequestException;


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

    // Define the file name.
    $file_name = basename($url);

    // Step 1: Check if a media entity for this image already exists.
    $existing_media = $this->findExistingMediaByName($file_name);

    if ($existing_media) {
      // If the media already exists, return its ID.
      return $existing_media->id();
    }

    // Step 2: Download the image if media does not exist.
    try {
      // Download the image content.
      $http_client = \Drupal::httpClient();
      $response = $http_client->get($url);
      $image_data = $response->getBody()->getContents();

      // Define the full path of the file.
      $destination = $directory . '/' . $file_name;

      // Save the file.
      $file = \Drupal::service('file.repository')->writeData($image_data, $destination, FileSystemInterface::EXISTS_REPLACE);

      // Step 3: Create a new media entity if the file is saved successfully.
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

  /**
   * Helper function to find existing media by file name.
   */
  private function findExistingMediaByName($file_name) {
    // Query to find the media entity with the given file name.
    $media_query = \Drupal::entityTypeManager()->getStorage('media')->getQuery();
    $media_query->condition('bundle', 'image');
    $media_query->condition('name', $file_name);
    $media_query->accessCheck(FALSE);
    $media_ids = $media_query->execute();

    if (!empty($media_ids)) {
      // If a media entity is found, load and return the first one.
      return Media::load(reset($media_ids));
    }

    return NULL;
  }

}
