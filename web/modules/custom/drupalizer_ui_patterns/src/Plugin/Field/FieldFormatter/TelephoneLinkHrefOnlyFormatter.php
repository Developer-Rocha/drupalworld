<?php

namespace Drupal\drupalizer_ui_patterns\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Plugin implementation of the 'telephone_link_href' formatter.
 *
 * @FieldFormatter(
 *   id = "telephone_link_href",
 *   label = @Translation("Telephone link (href only)"),
 *   field_types = {
 *     "telephone"
 *   }
 * )
 */
class TelephoneLinkHrefOnlyFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    foreach ($items as $delta => $item) {
      $elements[$delta] = [
        '#markup' => 'tel:' . $item->value,
      ];
    }

    return $elements;
  }

}
