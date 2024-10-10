<?php

namespace Drupal\drupalizer_ui_patterns\Plugin\UIPatterns\SettingType;

use Drupal\ui_patterns_settings\Definition\PatternDefinitionSetting;
use Drupal\ui_patterns_settings\Plugin\EnumerationSettingTypeBase;

/**
 * Color widget setting type.
 *
 * @UiPatternsSettingType(
 *   id = "iconpicker",
 *   label = @Translation("Icon Picker")
 * )
 */
class IconPickerWidgetSettingType extends EnumerationSettingTypeBase {

  /**
   * {@inheritdoc}
   */
  protected function getEnumerationType(PatternDefinitionSetting $def): string {
    return 'select';
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, $value, PatternDefinitionSetting $def, $form_type): array {
    $form = parent::settingsForm($form, $value, $def, $form_type);
    $form['icon']['#type'] = 'iconpicker';
    return $form;
  }

}
