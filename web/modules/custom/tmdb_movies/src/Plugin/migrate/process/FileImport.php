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

    // Definir o diretório de destino.
    $directory = 'public://movies';

    // Verifique se o diretório existe ou crie-o.
    $file_system = \Drupal::service('file_system');
    $file_system->prepareDirectory($directory, FileSystemInterface::CREATE_DIRECTORY);

    try {
      // Baixar o conteúdo da imagem.
      $http_client = \Drupal::httpClient();
      $response = $http_client->get($url);
      $image_data = $response->getBody()->getContents();

      // Definir o caminho completo do arquivo.
      $file_name = basename($url);
      $destination = $directory . '/' . $file_name;

      // Salvar o arquivo.
      $file = \Drupal::service('file.repository')->writeData($image_data, $destination, FileSystemInterface::EXISTS_REPLACE);

      // Se o arquivo foi salvo, criar uma entidade Media Image.
      if ($file instanceof File) {
        $media = Media::create([
          'bundle' => 'image',
          'name' => $file_name,
          'field_media_image' => [
            'target_id' => $file->id(),
            'alt' => $row->getSourceProperty('title') ?? 'Poster',
          ],
          'uid' => 1, // ID do usuário que será o autor da mídia.
          'status' => 1,
        ]);

        $media->save();

        return $media->id();
      }
    }
    catch (RequestException $e) {
      \Drupal::logger('tmdb_movies')->error('Erro ao baixar a imagem da URL @url: @message', [
        '@url' => $url,
        '@message' => $e->getMessage(),
      ]);
      return NULL;
    }

    return NULL;
  }
}
