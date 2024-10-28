<?php

namespace Drupal\tmdb_movies\EventSubscriber;

use Drupal\migrate\Event\MigrateImportEvent;
use Drupal\migrate\Event\MigrateEvents;
use Drupal\Core\Queue\QueueFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\node\Entity\Node;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Subscribes to migration post-import events.
 *
 * @package Drupal\tmdb_movies\EventSubscriber
 */
class MigrationPostImportSubscriber implements EventSubscriberInterface {

  /**
   * The queue factory.
   *
   * @var \Drupal\Core\Queue\QueueFactory
   */
  protected $queueFactory;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a new MigrationPostImportSubscriber.
   *
   * @param \Drupal\Core\Queue\QueueFactory $queue_factory
   *   The queue factory.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(QueueFactory $queue_factory, EntityTypeManagerInterface $entity_type_manager) {
    $this->queueFactory = $queue_factory;
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * React to migration post-import.
   *
   * @param \Drupal\migrate\Event\MigrateImportEvent $event
   *   The post-import event.
   */
  public function onPostImport(MigrateImportEvent $event) {
    $migration = $event->getMigration();

    if ($migration->id() == 'tmdb_movies') {
      \Drupal::logger('tmdb_movies')->info('Migration complete. Runnig the cron job.');

      // Get the AI queue.
      $queue = $this->queueFactory->get('ai_automator_field_modifier');

      // Get the migration ID map.
      $id_map = $migration->getIdMap();

      // Rewind the map to start iterating.
      $id_map->rewind();

      // Iterate over the ID map.
      while ($id_map->valid()) {
        // Get the source and destination IDs.
        $source_id = $id_map->currentSource();
        $destination_id = $id_map->currentDestination();

        if (!empty($destination_id)) {
          $destination_id = reset($destination_id);
          $node = Node::load($destination_id);

          if ($node) {
            // Add the node to the AI queue.
            $queue->createItem([
              'entity_type' => 'node',
              'entity_id' => $node->id(),
              'automatorConfig' => [
                'field_name' => 'fied_ai_review',
              ],
            ]);
            \Drupal::logger('tmdb_movies')->info('Node @nid added to the AI queue.', ['@nid' => $node->id()]);
          }
        }

        // Move to the next row in the map.
        $id_map->next();
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {
    return [
      MigrateEvents::POST_IMPORT => ['onPostImport'],
    ];
  }

}
