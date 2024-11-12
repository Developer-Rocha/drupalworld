<?php

namespace Drupal\seo_tokens\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class SeoTokenSettingsForm extends ConfigFormBase {

  public function getFormId() {
    return 'seo_token_settings_form';
  }

  protected function getEditableConfigNames() {
    return ['seo_tokens.settings'];
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('seo_tokens.settings');
    $content_types = \Drupal\node\Entity\NodeType::loadMultiple();

    foreach ($content_types as $type) {
      $fields = \Drupal::service('entity_field.manager')->getFieldDefinitions('node', $type->id());
      $text_fields = ['' => $this->t('- None -')];

      foreach ($fields as $field_name => $field) {
        if (in_array($field->getType(), ['text', 'text_long']) && $field_name !== 'field_seo_description') {
          $text_fields[$field_name] = $field->getLabel();
        }
      }

      if (!empty($text_fields)) {
        $form['content_types'][$type->id()] = [
          '#type' => 'details',
          '#title' => $type->label(),
          '#open' => TRUE,
        ];

        $form['content_types'][$type->id()]['fallback_field-' . $type->id()] = [
          '#type' => 'select',
          '#title' => $this->t('Fallback field for SEO description'),
          '#options' => $text_fields,
          '#default_value' => $config->get('content_types.' . $type->id() . '.fallback_field-' . $type->id()) ?: '',
        ];
      } else {
        $form['content_types'][$type->id()] = [
          '#type' => 'markup',
          '#markup' => $this->t('No text fields available for @content_type', ['@content_type' => $type->label()]),
        ];
      }
    }

    return parent::buildForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('seo_tokens.settings');
    $content_types = \Drupal\node\Entity\NodeType::loadMultiple();

    foreach ($content_types as $type) {
      $form_values = $form_state->getValue('fallback_field-' . $type->id());

      if (isset($form_values) && !empty($form_values)) {
        $config->set('content_types.' . $type->id() . '.fallback_field-' . $type->id(), $form_values);
      }
    }

    $config->save();
    parent::submitForm($form, $form_state);
  }
}
