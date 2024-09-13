<?php

namespace Drupal\tmdb_movies\Plugin\migrate\source;

use Drupal\migrate\MigrateException;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Plugin\migrate\source\SourcePluginBase;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Client;

/**
 * Source plugin for fetching top movies from TMDb API.
 *
 * @MigrateSource(
 *   id = "tmdb_movies_source"
 * )
 */
class TmdbMoviesSource extends SourcePluginBase {

  /**
   * The TMDb API URL.
   *
   * @var string
   */
  protected $sourceUrl;

  /**
   * {@inheritdoc}
   */
  public function initializeIterator() {
    $key_manager = \Drupal::service('key.repository');
    $api_key = $key_manager->getKey('tmdb')->getKeyValue();
    $url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

    try {
      $client = new Client();
      $response = $client->get($url, [
        'headers' => [
          'Authorization' => 'Bearer ' . $api_key,
          'Accept' => 'application/json',
        ],
      ]);
      $movies = json_decode($response->getBody(), TRUE)['results'];

      // Return only the top 10 movies.
      return new \ArrayIterator(array_slice($movies, 0, 10));
    }
    catch (RequestException $e) {
      \Drupal::logger('tmdb_movies')->error('Error fetching movies from TMDb: @message', ['@message' => $e->getMessage()]);
      throw new MigrateException($e->getMessage());
    }
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'id' => $this->t('TMDb ID'),
      'original_title' => $this->t('Title'),
      'overview' => $this->t('Overview'),
      'poster_path' => $this->t('Poster URL'),
      'release_date' => $this->t('Release Date'),
      'vote_average' => $this->t('Vote Average'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'id' => [
        'type' => 'integer',
        'alias' => 'tmdb',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function __toString(): string {
    return $this->sourceUrl;
  }
}
