<?php

namespace Drupal\seo_tokens\Plugin\Token;

use Drupal\Core\Entity\EntityInterface;
use Drupal\token\Plugin\Token\Entity\EntityToken;

/**
 * Provides SEO description tokens.
 *
 * @Token(
 *   id = "seo_description_token",
 *   label = @Translation("SEO Description"),
 *   entity_type = "node"
 * )
 */
class SeoDescriptionToken extends EntityToken {

  /**
   * {@inheritdoc}
   */
  public function getTokenData(EntityInterface $entity, array $options, array $bubbleable_metadata) {
    $bundle = $entity->bundle();
    $fallback_field_key = 'fallback_field-' . $bundle;
    $fallback_field = $this->configFactory->get('seo_tokens.settings')->get($fallback_field_key);

    if ($entity->hasField('field_seo_description') && !$entity->get('field_seo_description')->isEmpty()) {
      return $entity->get('field_seo_description')->value;
    } elseif ($fallback_field && $entity->hasField($fallback_field) && !$entity->get($fallback_field)->isEmpty()) {
      return $entity->get($fallback_field)->value;
    }

    return '';
  }
}
