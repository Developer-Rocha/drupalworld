<?php

namespace Drupal\drupalizer_ui_patterns\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Plugin implementation of the 'email_mailto_href' formatter.
 *
 * @FieldFormatter(
 *   id = "email_mailto_href",
 *   label = @Translation("Email (href only)"),
 *   field_types = {
 *     "email"
 *   }
 * )
 */
class MailToHrefOnlyFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    foreach ($items as $delta => $item) {
      $elements[$delta] = [
        '#markup' => 'mailto:' . $item->value,
      ];
    }

    return $elements;
  }

}
